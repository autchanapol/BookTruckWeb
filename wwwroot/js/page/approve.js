const url_getRequest = window.AppUrls.getRequestDataUrl;
const url_getDataJsonUrl = window.AppUrls.getDataJsonUrl;

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
    if (validateInputs()) {
        // หากข้อมูลถูกต้องทั้งหมด
        alert("ข้อมูลทั้งหมดถูกต้อง! พร้อมบันทึกข้อมูล");
        // ดำเนินการบันทึกข้อมูล เช่น เรียกใช้ AJAX POST
    } else {
        // หากพบข้อผิดพลาด
        alert("กรุณากรอกข้อมูลให้ครบถ้วนก่อนบันทึก");
    }
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
                        `<input type="checkbox" class="form-check-input" 
                        data-ticket-id="${ticket.rowId}"
                        data-job-no="${ticket.jobNo}"
                        data-customer-name="${ticket.customerName}" 
                        >` , 
                        ticket.rowId,
                        ticket.jobNo,
                        ticket.customerName,
                        ticket.createdDate,
                        `<span class="${statusClass}">${ticket.statusName}</span>`, 
                        ticket.requestFrom,
                        ticket.assignName,
                        `
                        <!-- ปุ่ม Check -->
                        <div class="form-button-action">
                            <!-- ปุ่ม Delete -->
                            <button type="button" class="btn btn-link btn-danger"
                             data-temps-id="${ticket.rowId}">
                             <i class="fa fa-times"></i>
                                </button>
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
    const url = `${receivingBookingUrl}?JobNo=${encodeURIComponent(jobNo)}`;
    console.log("Redirecting to:", url);
    window.location.href = url;
}
