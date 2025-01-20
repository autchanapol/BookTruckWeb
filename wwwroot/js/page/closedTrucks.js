var dataTable; // กำหนดตัวแปร Global
const url_getTruckData = window.AppUrls.getTruckDataUrl;
const url_setClosedUrl = window.AppUrls.setClosedUrl;
const url_setRevertUrl = window.AppUrls.setRevertUrl;
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
                        `<input type="checkbox" class="form-check-input" data-ticket-id="${trucks.rowId}">`, // เพิ่ม Checkbox ในคอลัมน์แรก
                        trucks.rowId,
                        trucks.vehicleName,
                        trucks.vehicleLicense,
                        trucks.driver,
                        trucks.counnt_Job,
                        `
                        <div class="form-button-action">
                            <button type="button" class="btn btn-link btn-primary"
                                    data-trucks-id="${trucks.rowId}"
                                    data-trucks-license="${trucks.vehicleLicense}"
                                    >
                                <i class="bi bi-check-square-fill"></i>
                            </button>
                              <button type="button" class="btn btn-link btn-danger"
                                    data-trucks-id="${trucks.rowId}"
                                    data-trucks-license="${trucks.vehicleLicense}"
                                    >
                                <i class="bi bi-arrow-clockwise"></i>
                            </button>
                        </div>
                        `
                    ]);
                });
            } else {
                // แสดงข้อความเมื่อไม่มีข้อมูล
                dataTable.row.add(["", "", "", "No Trucks found.", "", "", ""]).draw();
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