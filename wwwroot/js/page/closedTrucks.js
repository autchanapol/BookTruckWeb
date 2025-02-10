var dataTable; // กำหนดตัวแปร Global
const url_getTruckData = window.AppUrls.getTruckDataUrl;
const url_setClosedUrl = window.AppUrls.setClosedUrl;
const url_setRevertUrl = window.AppUrls.setRevertUrl;
const url_getVehiclesFrmJobUrl = window.AppUrls.getVehiclesFrmJobUrl;
const url_getVehiclesFrmNameUrl = window.AppUrls.getVehiclesFrmNameUrl;
const url_setChangeTruckUrl = window.AppUrls.setChangeTruckUrl;

let carname = document.getElementById("carname");

$(document).ready(function () {
    // สร้าง DataTable
    dataTable = $("#vehicles-table").DataTable({
        pageLength: 10, // จำนวนแถวต่อหน้า
        ordering: true, // เปิดใช้งานการเรียงลำดับ
        searching: true, // เปิดใช้งานการค้นหา
        lengthChange: true, // อนุญาตให้เปลี่ยนจำนวนแถวต่อหน้า
    });

    getTruckData();

});

carname.addEventListener("keypress", function (event) {

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

function saveTruck() {

    const carId = $('#car_id').val();
    const jobno = $('#jobno').val();
    const driver = $('#driver').val();
    const sub = $('#sub').val();
    const tel = $('#tel').val();

    swal({
        title: "เปลี่ยนรถ?",
        icon: "warning",
        text: `คุณต้องการเปลี่ยนรถเลขงาน ${jobno} นี้ใช่หรือไม่`,
        buttons: {
            confirm: {
                text: "Yes",
                className: "btn btn-success",
            },
            cancel: {
                visible: true,
                className: "btn btn-danger",
            },
        },
    }).then((Approve) => {
        if (Approve) {
            console.log(url_setChangeTruckUrl);
            const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
            const token = tokenElement ? tokenElement.value : null;
            if (!token) {
                console.error("CSRF Token not found.");
                return;
            }

            $.ajax({
                url: url_setChangeTruckUrl,
                type: "POST",
                headers: { "RequestVerificationToken": token },
                contentType: "application/json",
                data: JSON.stringify({
                    JobNo: jobno,
                    VehiclesId: carId,
                    Driver: driver,
                    Sub: sub,
                    Tel: tel
                }),
                success: function (response) {
                    console.log("data output", response);
                    if (response !== null && typeof response == 'object') {
                        if (response.status) {
                            getTruckData();
                            swal({
                                title: "Success!",
                                icon: "success",
                                text: "เปลี่ยนรถเรียบร้อยแล้ว",
                                type: "success",
                                buttons: {
                                    confirm: {
                                        className: "btn btn-success",
                                    },
                                },
                            });
                            $('#changeTruckModal').modal('hide');
                        }
                        else {
                            console.log("not success:", data.message);
                        }
                    }
                    else {
                        console.log("Error:", "Error");
                    }
                },
                error: function (xhr, status, error) {
                    console.error("Error:", error);
                }
            });
        }
    }); 
}

function getTruckData() {
    console.log('getTruckData', url_getTruckData);
    const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
    const token = tokenElement ? tokenElement.value : null;
    if (!token) {
        console.error("CSRF Token not found.");
        return;
    }

    $.ajax({
        url: url_getTruckData, // URL ของ API
        type: "POST",
        headers: { "RequestVerificationToken": token },
        contentType: 'application/json',
        success: function (data) {
            console.log("data etTruck", data);
            dataTable.clear();

            if (Array.isArray(data) && data.length > 0) {
                data.forEach(trucks => {
                    dataTable.row.add([
                        /*`<input type="checkbox" class="form-check-input" data-ticket-id="${trucks.rowId}">`, // เพิ่ม Checkbox ในคอลัมน์แรก*/
                        trucks.rowId,
                        trucks.vehicleName,
                        trucks.vehicleLicense,
                        trucks.driver,
                        trucks.jobNo,
                        trucks.etatostore,
                        `
                        <div class="form-button-action">
                            <button type="button"  class="btn  btn-primary"
                                    data-trucks-id="${trucks.rowId}"
                                    data-trucks-license="${trucks.vehicleLicense}"
                                    style="margin-right: 2px;"
                                    >
                               
                                ปิดงาน
                            </button>
                              <button type="button" class="btn  btn-danger"
                                    data-trucks-id="${trucks.rowId}"
                                    data-trucks-license="${trucks.vehicleLicense}"
                                    style="margin-right: 2px;"
                                    >
                                ดึงกลับ
                            </button>
                             </button>
                              <button type="button" class="btn  btn-success"
                                    data-trucks-id="${trucks.rowId}"
                                    data-trucks-license="${trucks.vehicleLicense}"
                                    data-trucks-jobno="${trucks.jobNo}"
                                    >
                                เปลี่ยน
                            </button>
                        </div>
                        `
                    ]);
                });
            } else {
                // แสดงข้อความเมื่อไม่มีข้อมูล
                dataTable.row.add(["", "", "", "" , "No Trucks found.", "", "", ""]).draw();
            }

            dataTable.draw();
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
        }
    });
}

$("#vehicles-table").on("click", ".btn-primary", function () {
    const truckid = $(this).data("trucks-id");
    const license = $(this).data("trucks-license");
    console.log('closed', truckid);
    swal({
        title: "ปิดงาน?",
        icon: "warning",
        text: `คุณต้องการปิดงานรถทะเบียน ${license} นี้ใช่หรือไม่`,
        buttons: {
            confirm: {
                text: "Yes",
                className: "btn btn-success",
            },
            cancel: {
                visible: true,
                className: "btn btn-danger",
            },
        },
    }).then((Approve) => {
        if (Approve) {

            const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
            const token = tokenElement ? tokenElement.value : null;
            if (!token) {
                console.error("CSRF Token not found.");
                return;
            }

            $.ajax({
                url: url_setClosedUrl,
                type: "POST",
                headers: { "RequestVerificationToken": token },
                contentType: "application/json",
                data: JSON.stringify({
                    RowId: truckid
                }),
                success: function (data) {
                    console.log("data output", data);
                    if (data !== null && typeof data == 'object') {
                        if (data.status) {
                            getTruckData();
                            swal({
                                title: "Success!",
                                icon: "success",
                                text: "ปิดงานรถคันนี้เรียบร้อยแล้ว",
                                type: "success",
                                buttons: {
                                    confirm: {
                                        className: "btn btn-success",
                                    },
                                },
                            });
                        }
                        else {
                            console.log("not success:", data.message);
                        }
                    }
                    else {
                        // ไม่มีข้อมูล
                        console.log("Error:", "Error");
                    }
                },
                error: function (xhr, status, error) {
                    console.error("Error:", error);
                }
            });
        } else {
            swal.close();
        }
    });
});

$("#vehicles-table").on("click", ".btn-success", function () {
    const truckid = $(this).data("trucks-id");
    const license = $(this).data("trucks-license");
    const jobno = $(this).data("trucks-jobno");

    console.log('return', truckid);
    console.log(url_getVehiclesFrmJobUrl);
    const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
    const token = tokenElement ? tokenElement.value : null;
    if (!token) {
        console.error("CSRF Token not found.");
        return;
    }
    $.ajax({
        url: url_getVehiclesFrmJobUrl,
        type: "POST",
        headers: { "RequestVerificationToken": token },
        contentType: "application/json",
        data: JSON.stringify({
            JobNo: jobno
        }),
        success: function (response) {
            console.log("data output", response);
            if (response !== null) {
                $('#car_id').val(response.vehiclesId);
                $('#carname').val(response.vehicleName);
                $('#carshow').val(response.vehicleLicense);
                $('#cartype').val(response.vehicleTypeName);
                $('#driver').val(response.driver);
                $('#sub').val(response.sub);
                $('#tel').val(response.tel);
                $('#jobno').val(jobno);
                $("#changeTruckModal").modal("show");
            }
            else {
                // ไม่มีข้อมูล
                console.log("Error:", "Error");
            }
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
        }
    });
});

$("#vehicles-table").on("click", ".btn-danger", function () {
    const truckid = $(this).data("trucks-id");
    const license = $(this).data("trucks-license");
    console.log('return', truckid);

    swal({
        title: "ดึงรถกลับ?",
        icon: "warning",
        text: `คุณต้องการดึงรถทะเบียน ${license} นี้กลับใช่หรือไม่`,
        buttons: {
            confirm: {
                text: "Yes",
                className: "btn btn-success",
            },
            cancel: {
                visible: true,
                className: "btn btn-danger",
            },
        },
    }).then((Approve) => {
        if (Approve) {

            const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
            const token = tokenElement ? tokenElement.value : null;
            if (!token) {
                console.error("CSRF Token not found.");
                return;
            }
            $.ajax({
                url: url_setRevertUrl,
                type: "POST",
                headers: { "RequestVerificationToken": token },
                contentType: "application/json",
                data: JSON.stringify({
                    RowId: truckid
                }),
                success: function (data) {
                    console.log("data output", data);
                    if (data !== null && typeof data == 'object') {
                        if (data.status) {
                            getTruckData();
                            swal({
                                title: "Success!",
                                icon: "success",
                                text: "ทำการดึงรถกลับเรียบร้อยแล้ว",
                                type: "success",
                                buttons: {
                                    confirm: {
                                        className: "btn btn-success",
                                    },
                                },
                            });
                        }
                        else {
                            console.log("not success:", data.message);
                        }
                    }
                    else {
                        // ไม่มีข้อมูล
                        console.log("Error:", "Error");
                    }
                },
                error: function (xhr, status, error) {
                    console.error("Error:", error);
                }
            });

        } else {
            swal.close();
        }
    });
});