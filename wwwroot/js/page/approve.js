const url_getRequest = window.AppUrls.getRequestDataUrl;
const url_getDataJsonUrl = window.AppUrls.getDataJsonUrl;
const url_getVehiclesFrmNameUrl = window.AppUrls.getVehiclesFrmNameUrl;
const url_setDataApproveUrl = window.AppUrls.setDataApproveUrl;

var input = document.getElementById("carname");
var dataTable; // กำหนดตัวแปร Global

$(document).ready(function () {
    // สร้าง DataTable
    dataTable = $("#basic-datatables").DataTable({
        pageLength: 10, // จำนวนแถวต่อหน้า
        ordering: true, // เปิดใช้งานการเรียงลำดับ
        searching: true, // เปิดใช้งานการค้นหา
        lengthChange: true, // อนุญาตให้เปลี่ยนจำนวนแถวต่อหน้า
    });

    getRequestData();

    window.addEventListener("pageshow", function (event) {
        if (event.persisted || performance.navigation.type === 2) {
            getRequestData(); // เรียกใช้ฟังก์ชันอีกครั้งเมื่อย้อนกลับมา
        }
    });

});

$('#scrollableModal').on('show.bs.modal', function () {
    const zIndex = 1050 + ($('.modal:visible').length * 10); // เพิ่ม z-index อัตโนมัติ
    $(this).css('z-index', zIndex);
    const backdrop = $('.modal-backdrop').not('.modal-stack').first();
    backdrop.css('z-index', zIndex - 5).addClass('modal-stack');
});

$('body').on('shown.bs.modal', '.modal', function () {
    const modalStack = $('.modal:visible').length;
    if (modalStack > 1) {
        $('body').addClass('modal-open');
    }
});

$('body').on('hidden.bs.modal', '.modal', function () {
    const modalStack = $('.modal:visible').length;
    if (modalStack === 0) {
        $('body').removeClass('modal-open');
    }
});



input.addEventListener("keypress", function (event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
        console.log("Enter");
        // Cancel the default action, if needed
        event.preventDefault();

        const carname = $('#carname').val();
        if (!carname) {
            swal("Warning!", "กรุณากรอกชื่อรถก่อน!", {
                icon: "warning",
                buttons: {
                    confirm: {
                        className: "btn btn-warning",
                    },
                },
            });
            return;
        }
        else {
            getVehicleWhereId(carname);
        }
    }
});


function getVehicleWhereId(carname) {
    console.log(url_getVehiclesFrmNameUrl);
    const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
    const token = tokenElement ? tokenElement.value : null;
    if (!token) {
        console.error("CSRF Token not found.");
        return;
    }

    $.ajax({
        url: url_getVehiclesFrmNameUrl,
        type: "POST",
        contentType: "application/json",
        headers: { "RequestVerificationToken": token },
        data: JSON.stringify({
            VehicleName: carname,
        }),

        success: function (response) {
            console.log("customers", response);
            if (response.status == "success") {
                populateTable(response.data);

                $('#scrollableModal').modal('show');
            }
            else {
                swal("Warning!", "ไม่พบข้อมูลที่ค้นหา!", {
                    icon: "warning",
                    buttons: {
                        confirm: {
                            className: "btn btn-warning",
                        },
                    },
                });
                return;
            }
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
        }
    });
}


function populateTable(data) {
    const tbody = document.querySelector("#vehicle-table tbody"); // อ้างอิง <tbody>
    let selectedRow = null;

    // ล้างข้อมูลเก่า
    tbody.innerHTML = "";

    // ตรวจสอบข้อมูลก่อนลูป
    if (!Array.isArray(data)) {
        console.error("Data is not an array.");
        return;
    }

    // เพิ่มข้อมูลใหม่ในตาราง
    data.forEach((vehicles, index) => {
        const row = document.createElement("tr");
        row.setAttribute("data-rowid", vehicles.rowId);

        // สร้างเซลล์และเพิ่มข้อมูล
        const cellIndex = document.createElement("td");
        cellIndex.textContent = index + 1;

        const cellvehicleName = document.createElement("td");
        cellvehicleName.textContent = vehicles.vehicleName;

        const cellVehicleLicense = document.createElement("td");
        cellVehicleLicense.textContent = vehicles.vehicleLicense;

        const cellVehicleTypeName = document.createElement("td");
        cellVehicleTypeName.textContent = vehicles.vehicleTypeName;

        // เพิ่มเซลล์ในแถว
        row.appendChild(cellIndex);
        row.appendChild(cellvehicleName);
        row.appendChild(cellVehicleLicense);
        row.appendChild(cellVehicleTypeName);

        // เพิ่ม Event Listener สำหรับเลือกแถว css
        row.addEventListener("click", function () {
            if (selectedRow) {
                selectedRow.classList.remove("selected");
                console.log("Removed selected from:", selectedRow);
            }
            selectedRow = this;
            this.classList.add("selected");
            console.log("Added selected to:", selectedRow);
        });


        // เพิ่มแถวในตาราง
        tbody.appendChild(row);
    });

    // เพิ่ม Event Listener ให้กับปุ่ม "เลือก"
    const selectBtn = document.getElementById("select-btn");
    selectBtn.replaceWith(selectBtn.cloneNode(true)); // ลบ Event Listener เก่าถ้ามี

    document.getElementById("select-btn").addEventListener("click", function () {
        if (selectedRow) {
            const rowId = selectedRow.getAttribute("data-rowid");
            const vehicleName = selectedRow.children[1].textContent;
            const vehicleLicense = selectedRow.children[2].textContent;
            const vehicleTypeName = selectedRow.children[3].textContent;

            // แสดงข้อมูลที่เลือกใน console.log
            console.log("rowId:", rowId);
            console.log("vehicleName:", vehicleName);
            console.log("vehicleLicense:", vehicleLicense);
            console.log("vehicleTypeName:", vehicleTypeName);

            // เติมค่าในฟิลด์ input
            $('#car_id').val(rowId);
            $('#carname').val(vehicleName);
            $('#carshow').val(vehicleLicense);
            $('#cartype').val(vehicleTypeName);
            // ปิด Modal
            $('#scrollableModal').modal('hide');
        } else {
            swal("Warning!", "กรุณาเลือกรายการก่อน!", {
                icon: "warning",
                buttons: {
                    confirm: {
                        className: "btn btn-warning",
                    },
                },
            });
        }
    });
}

function updateApprovalButton() {
    // เลือก Checkbox ที่ถูก Checked
    const checkedCheckboxes = document.querySelectorAll('input[type="checkbox"].form-check-input:checked');
    const btnCheckSelected = document.getElementById('btnCheckSelected');

    // อัปเดตข้อความบนปุ่ม
    if (checkedCheckboxes.length > 0) {
        btnCheckSelected.innerHTML = `ทำการอนุมัติ (${checkedCheckboxes.length})`;
    } else {
        btnCheckSelected.innerHTML = 'ทำการอนุมัติ';
    }
}

function resetCheckboxAndButton() {
    // ล้างค่า Checkbox ทั้งหมดใน DataTable
    document.querySelectorAll('input[type="checkbox"].form-check-input').forEach(checkbox => {
        checkbox.checked = false;
    });

    // รีเซ็ตข้อความปุ่ม
    const btnCheckSelected = document.getElementById('btnCheckSelected');
    btnCheckSelected.innerHTML = 'ทำการอนุมัติ';
}

function checkSelectedCheckboxes() {
    // เลือก Checkbox ทั้งหมดที่อยู่ใน DataTable และถูก Checked
    const checkedCheckboxes = document.querySelectorAll('input[type="checkbox"].form-check-input:checked');

    if (checkedCheckboxes.length === 0) {
        // หากไม่มีการกด Checkbox ให้แสดง Alert
        swal("Warning!", "กรุณาเลือกอย่างน้อยหนึ่งรายการ!", {
            icon: "warning",
            buttons: {
                confirm: {
                    className: "btn btn-warning",
                },
            },
        });
        return;
    } else {
        // ดึงข้อมูลจาก Checkbox ที่เลือก
        const selectedData = Array.from(checkedCheckboxes).map(checkbox => {
            return {
                RowId: checkbox.dataset.ticketId,
                JobNo: checkbox.dataset.jobNo
            };
        });

        // แปลงข้อมูลเป็น JSON
        const jsonData = JSON.stringify(selectedData, null, 2); // จัดรูปแบบ JSON ให้ดูง่าย
        console.log(jsonData); // แสดง JSON ใน Console

        const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
        const token = tokenElement ? tokenElement.value : null;
        if (!token) {
            console.error("CSRF Token not found.");
            return;
        }

        console.log(url_getDataJsonUrl);

        $.ajax({
            url: url_getDataJsonUrl,
            type: "POST",
            headers: { "RequestVerificationToken": token },
            contentType: 'application/json',
            data: jsonData,
            success: function (data) {
                console.log("data", data);
                const tableBody = document.querySelector("#selectedDataTable tbody");
                tableBody.innerHTML = "";

                // เพิ่มข้อมูลใหม่ในตาราง
                data.forEach(item => {
                    const row = `
                <tr>
                    <td>${item.rowId}</td>
                    <td>${item.jobNo}</td>
                    <td>${item.customerName || "N/A"}</td>
                    <td><input type="number" class="form-control" placeholder="Enter cost"</td>
                    <td><input type="number" class="form-control" placeholder="Enter KM"</td>
                </tr>
            `;
                    tableBody.innerHTML += row; // เพิ่มแถวใหม่ในตาราง
                });

                // เปิด Modal
                $("#selectedDataModal").modal("show");
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
            }
        });
    }
}

function validateInputs() {
    let isValid = true; // ตัวแปรสำหรับตรวจสอบว่าข้อมูลถูกต้องหรือไม่
    const rows = document.querySelectorAll("#selectedDataTable tbody tr");

    rows.forEach((row, index) => {
        // ดึงค่าจาก <input> ในแต่ละแถว
        const costInput = row.querySelector('input[placeholder="Enter cost"]');
        const kmInput = row.querySelector('input[placeholder="Enter KM"]');

        // ตรวจสอบว่ามีค่าใน <input> หรือไม่
        if (!costInput.value.trim()) {
            isValid = false;
            //alert(`กรุณากรอกค่าในช่อง Cost ที่แถวที่ ${index + 1}`);
        }

        if (!kmInput.value.trim()) {
            isValid = false;
            //alert(`กรุณากรอกค่าในช่อง KM ที่แถวที่ ${index + 1}`);
        }
    });

    return isValid; // คืนค่า true หากข้อมูลถูกต้องทั้งหมด
}


function approveJob() {

    const car_id = $('#car_id').val();
    const driver = $('#driver').val();
    const sub = $('#sub').val();
    const tel = $('#tel').val();

    if (!car_id) {
        swal("Warning!", "กรุณาเลือกรถก่อน!", {
            icon: "warning",
            buttons: {
                confirm: {
                    className: "btn btn-warning",
                },
            },
        });
        return;
    }
    else if (!driver) {
        swal("Warning!", "กรุณากรอกชื่อผู้ขับ!", {
            icon: "warning",
            buttons: {
                confirm: {
                    className: "btn btn-warning",
                },
            },
        });
        return;
    }
    else if (!tel) {
        swal("Warning!", "กรุณากรอกเบอร์ติดต่อ!", {
            icon: "warning",
            buttons: {
                confirm: {
                    className: "btn btn-warning",
                },
            },
        });
        return;
    }
    else {

        if (validateInputs()) {
            const tableBody = document.querySelector("#selectedDataTable tbody");
            const rows = tableBody.querySelectorAll("tr"); // ดึงทุกแถวใน tbody
            const jsonData = [];
            let jsonDataapi;
            rows.forEach(row => {
                const rowId = row.children[0].textContent.trim();
                const jobNo = row.children[1].textContent.trim();
                const cost = row.children[3].querySelector("input").value.trim();
                const km = row.children[4].querySelector("input").value.trim();

                // เพิ่มข้อมูลลงใน JSON
                jsonData.push({
                    RowId: rowId,
                    JobNo: jobNo,
                    TravelCosts: cost || null,
                    Distance: km || null
                });
            });

            jsonDataapi = JSON.stringify({
                VehiclesId: car_id,
                Driver: driver,
                Sub: sub,
                Tel: tel,
                StatusOperation: 2,
                data: jsonData
            });

            swal({
                title: "Are you sure?",
                icon: "warning",
                text: `คุณต้องการอนุมัติงานทั้งหมดที่เลือก ใช่หรือไม่`,
                buttons: {
                    confirm: {
                        text: "Yes, Approve",
                        className: "btn btn-success",
                    },
                    cancel: {
                        visible: true,
                        className: "btn btn-danger",
                    },
                },
            }).then((Approve) => {
                if (Approve) {
                    sentApiApprove(jsonDataapi);
                } else {
                    swal.close();
                }
            });



        } else {

            swal("Warning!", "กรุณากรอกข้อมูลในตารางให้ครบถ้วนก่อนบันทึก!", {
                icon: "warning",
                buttons: {
                    confirm: {
                        className: "btn btn-warning",
                    },
                },
            });
        }
    }
}

function sentApiApprove(jsonData) {
    console.log(url_setDataApproveUrl);
    console.log("JSON Data for API:", jsonData);
    const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
    const token = tokenElement ? tokenElement.value : null;

    if (!token) {
        console.error("CSRF Token not found.");
        return Promise.reject("CSRF Token not found.");
    }
    $.ajax({
        url: url_setDataApproveUrl, // URL ของ API
        type: "POST",
        headers: { "RequestVerificationToken": token },
        contentType: "application/json",
        data: jsonData,
        success: function (data) {
            if (data !== null && typeof data == 'object') {
                if (data.success) {
                    clearText();
                    getRequestData();
                    $("#selectedDataModal").modal("hide");
                    swal("Successfully!", data.message, {
                        icon: "success",
                        buttons: {
                            confirm: {
                                className: "btn btn-success",
                            },
                        },
                    });
                    return;
                }
                else {
                    console.log("not success:", data.message);
                }
            }
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
            reject(error); // reject ในกรณีเกิด error
        }
    });
}

function clearText() {
    $('#car_id').val('');
    $('#driver').val('');
    $('#sub').val('');
    $('#tel').val('');
}

function getRequestData() {
    console.log('getRequestData', url_getRequest);
    const start_date = $('#start_date').val();
    const end_date = $('#end_date').val();
    const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
    const token = tokenElement ? tokenElement.value : null;
    if (!token) {
        console.error("CSRF Token not found.");
        return;
    }
    console.log('start_date', start_date);
    console.log('end_date', end_date);
    console.log('Json', JSON.stringify({
        startData: moment(start_date).format("YYYY-MM-DDTHH:mm:ss"),
        endData: moment(end_date).format("YYYY-MM-DDTHH:mm:ss")
    }));
    $.ajax({
        url: url_getRequest, // URL ของ API
        type: "POST",
        headers: { "RequestVerificationToken": token },
        contentType: 'application/json',
        data: JSON.stringify({
            startData: start_date,
            endData: end_date
        }),
        success: function (data) {
            console.log("data request", data);

            // ล้างข้อมูลใน DataTable
            dataTable.clear();

            if (Array.isArray(data) && data.length > 0) {
                // เพิ่มข้อมูลใหม่ใน DataTable
                data.forEach(ticket => {

                    let statusClass = "";
                    switch (ticket.statusName) {
                        case "New Request":
                            statusClass = "badge bg-secondary"; // สีเหลือง
                            break;
                        case "Waiting":
                            statusClass = "badge bg-secondary"; // สีเหลือง
                            break;
                        case "Approved":
                            statusClass = "badge bg-success"; // สีเขียว
                            break;
                        case "Rejected":
                            statusClass = "badge bg-danger"; // สีส้มกำหนดเอง
                            break;
                        case "Closed":
                            statusClass = "badge bg-warning"; // สีแดง
                            break;
                        default:
                            statusClass = "badge bg-secondary"; // สีเทา
                            break;
                    }

                    dataTable.row.add([
                        ticket.statusName === "Waiting"
                            ? `<input type="checkbox" class="form-check-input" 
                                data-ticket-id="${ticket.rowId}"
                                data-job-no="${ticket.jobNo}"
                                data-customer-name="${ticket.customerName}">`
                            : "", // หากไม่ใช่ Waiting จะไม่แสดง checkbox
                        ticket.rowId,
                        ticket.jobNo,
                        ticket.customerName,
                        ticket.createdDate,
                        `<span class="${statusClass}">${ticket.statusName}</span>`,
                        ticket.requestFrom,
                        ticket.assignName,
                        `
                         <div class="form-button-action">
                             <!-- ปุ่มดูรายละเอียด (แสดงตลอด) -->
                             <button type="button" class="btn btn-link btn-primary"
                                onclick="redirectToReceivingBookingForm('${ticket.jobNo}')"
                                 data-temps-id="${ticket.rowId}">
                                 <i class="bi bi-eye"></i>
                             </button>

                             <!-- ปุ่ม Delete (แสดงเฉพาะสถานะ Waiting) -->
                             ${ticket.statusName === "Waiting" ? `
                                 <button type="button" class="btn btn-link btn-danger"
                                     data-temps-id="${ticket.rowId}">
                                     <i class="fa fa-times"></i>
                                 </button>
                             ` : ""}
                         </div>
    `
                    ]);



                    setTimeout(() => {
                        const checkbox = document.querySelector(`input[data-ticket-id="${ticket.rowId}"]`);
                        if (checkbox) {
                            checkbox.addEventListener('change', updateApprovalButton);
                        }
                    }, 0);

                });

                dataTable.draw();
            } else {
                dataTable.row.add(["", "", "", "", "No Requests found.", "", "", "", ""]).draw();
            }
            resetCheckboxAndButton();
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
        }
    });
}

function redirectToReceivingBookingForm(jobNo) {
    if (!jobNo || jobNo.trim() === "") {
        console.error("JobNo is invalid.");
        return;
    }
    const url = `${requestFormShowUrl}?JobNo=${encodeURIComponent(jobNo)}`;
    console.log("Redirecting to:", url);
    window.location.href = url;
}

