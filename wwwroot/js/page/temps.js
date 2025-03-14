﻿var dataTable; // กำหนดตัวแปร Global
const url_getTrucType = yourApp.Urls.editUserUrl;
const url_addTrucType = addTrucType.Urls.addUrl;
const url_editTrucType = editTrucType.Urls.editUrl;
$(document).ready(function () {
    // สร้าง DataTable
    dataTable = $("#trucktype-table").DataTable({
        pageLength: 10, // จำนวนแถวต่อหน้า
        ordering: true, // เปิดใช้งานการเรียงลำดับ
        searching: true, // เปิดใช้งานการค้นหา
        lengthChange: true, // อนุญาตให้เปลี่ยนจำนวนแถวต่อหน้า
    });
    getTemps();
});



function getTemps() {
    console.log('getDepartments', url_getTrucType);
    const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
    const token = tokenElement ? tokenElement.value : null;
    if (!token) {
        console.error("CSRF Token not found.");
        return;
    }

    $.ajax({
        url: url_getTrucType, // URL ของ API
        type: "POST",
        headers: { "RequestVerificationToken": token },
        success: function (data) {
            console.log("data output", data);

            // ล้างข้อมูลใน DataTable
            dataTable.clear();

            if (Array.isArray(data) && data.length > 0) {
                // เพิ่มข้อมูลใหม่ใน DataTable
                data.forEach(temps => {
                    dataTable.row.add([
                        temps.rowId,
                        temps.tempName,
                        `
                        <div class="form-button-action">
                            <button type="button" class="btn btn-link btn-primary btn-lg"
                                    data-bs-toggle="modal" data-bs-target="#addRowModal"
                                    data-temps-id="${temps.rowId}"
                                    data-temps-name="${temps.tempName}">
                                <i class="fa fa-edit"></i>
                            </button>
                            <button type="button" class="btn btn-link btn-danger"
                                    data-temps-id="${temps.rowId}">
                                <i class="fa fa-times"></i>
                            </button>
                        </div>
                        `
                    ]);
                });

                // อัปเดต DataTable
                dataTable.draw();
            } else {
                // แสดงข้อความเมื่อไม่มีข้อมูล
                dataTable.row.add(["", "No Temps found.", "", ""]).draw();
            }
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
        }
    });
}





// Click from Table Edir Rows
$("#trucktype-table").on("click", ".btn-primary", function () {
    const tempsid = $(this).data("temps-id");
    const tempsname = $(this).data("temps-name");

    // เปลี่ยนชื่อ Modal Title
    $("#h_name").text("Edit Row");

    // ใส่ค่าลงในฟิลด์ของ Modal
    $("#temp_name").val(tempsname);

    // คุณสามารถเก็บ ID ไว้ในที่ซ่อน (hidden input) หากต้องการ
    $("#row_id").val(tempsid);
});

$('#addRowModal').on('show.bs.modal', function () {
    // ล้างค่า Input ทุกช่องใน Modal
    $('#row_id').val('');
    $('#temp_name').val('');
});


$("#trucktype-table").on("click", ".btn-danger", function () {
    // ดึงค่า department.rowId จาก data-id
    const row_id = $(this).data("temps-id");
    const token = document.querySelector('input[name="__RequestVerificationToken"]').value; // ดึง CSRF Token
    swal({
        title: "Are you sure?",
        text: `Remove This Row for ID ${row_id} clicked!`,
        type: "warning",
        buttons: {
            confirm: {
                text: "Yes, delete it!",
                className: "btn btn-success",
            },
            cancel: {
                visible: true,
                className: "btn btn-danger",
            },
        },
    }).then((Delete) => {
        if (Delete) {

            $.ajax({
                url: url_editTrucType,
                type: "POST",
                headers: { "RequestVerificationToken": token },
                contentType: "application/json",
                data: JSON.stringify({
                    RowId: row_id,
                    Status: 0
                }),
                success: function (data) {
                    console.log("data output", data);
                    if (data !== null && typeof data == 'object') {
                        if (data.status) {
                            //successClick(data.message);
                            getTemps();
                            swal({
                                title: "Deleted!",
                                text: "Your file has been deleted.",
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

function addHandler() {
    const RowId = $("#row_id").val();
    const temp_name = $("#temp_name").val();
    const token = document.querySelector('input[name="__RequestVerificationToken"]').value; // ดึง CSRF Token
    console.log('Row ID', RowId);
    if (!temp_name) {
        swal("Warning!", "Please input Vehicle Type Name!", {
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
        if (!RowId) {
            $.ajax({
                url: url_addTrucType,
                type: "POST",
                headers: { "RequestVerificationToken": token },
                contentType: "application/json",
                data: JSON.stringify({
                    TempName: temp_name
                }),
                success: function (data) {
                    console.log("data output", data);
                    if (data !== null && typeof data == 'object') {
                        if (data.status) {
                            successClick(data.message);
                            getTemps();
                            $("#addRowModal").modal("hide");
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
        }
        else {
            $.ajax({
                url: url_editTrucType,
                type: "POST",
                headers: { "RequestVerificationToken": token },
                contentType: "application/json",
                data: JSON.stringify({
                    RowId: RowId,
                    TempName: temp_name
                }),
                success: function (data) {
                    console.log("data output", data);
                    if (data !== null && typeof data == 'object') {
                        if (data.status) {
                            successClick(data.message);
                            getTemps();
                            $("#addRowModal").modal("hide");
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
        }
    }
}

