﻿var dataTable; // กำหนดตัวแปร Global
const url_getLoadType = getLoad.Urls.getLoadUrl;
const url_addLoadType = addLoad.Urls.addLoadUrl;
const url_editLoadType = editLoad.Urls.editLoadUrl;
$(document).ready(function () {
    // สร้าง DataTable
    dataTable = $("#loadtype-table").DataTable({
        pageLength: 10, // จำนวนแถวต่อหน้า
        ordering: true, // เปิดใช้งานการเรียงลำดับ
        searching: true, // เปิดใช้งานการค้นหา
        lengthChange: true, // อนุญาตให้เปลี่ยนจำนวนแถวต่อหน้า
    });
    getLoadType();
});


function getLoadType() {
    console.log(url_getLoadType);
    const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
    const token = tokenElement ? tokenElement.value : null;
    if (!token) {
        console.error("CSRF Token not found.");
        return;
    }
    $.ajax({
        url: url_getLoadType, // URL ของ API
        type: "POST",
        headers: { "RequestVerificationToken": token },
        success: function (data) {
            console.log("data output", data);

            // ล้างข้อมูลใน DataTable
            dataTable.clear();

            if (Array.isArray(data) && data.length > 0) {
                // เพิ่มข้อมูลใหม่ใน DataTable
                data.forEach(loadTyoe => {
                    dataTable.row.add([
                        loadTyoe.rowId,
                        loadTyoe.loadName,
                        `
                        <div class="form-button-action">
                            <button type="button" class="btn btn-link btn-primary btn-lg"
                                    data-bs-toggle="modal" data-bs-target="#addRowModal"
                                    data-loadtype-id="${loadTyoe.rowId}"
                                    data-loadtype-name="${loadTyoe.loadName}">
                                <i class="fa fa-edit"></i>
                            </button>
                            <button type="button" class="btn btn-link btn-danger"
                                    data-loadtype-id="${loadTyoe.rowId}">
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
                dataTable.row.add(["", "No truck Type found.", "", ""]).draw();
            }
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
        }
    });
}


// Click from Table Edir Rows
$("#loadtype-table").on("click", ".btn-primary", function () {
    const loadtypeid = $(this).data("loadtype-id");
    const load_name = $(this).data("loadtype-name");


    $("#h_name").text("Edit Row");
    $("#load_name").val(load_name);
    $("#loadtypeid").val(loadtypeid);
});


$("#loadtype-table").on("click", ".btn-danger", function () {
    // ดึงค่า department.rowId จาก data-id
    const loadtypeid = $(this).data("loadtype-id");
    const token = document.querySelector('input[name="__RequestVerificationToken"]').value; // ดึง CSRF Token
    swal({
        title: "Are you sure?",
        text: `Remove This Row for ID ${loadtypeid} clicked!`,
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
                url: url_editLoadType,
                type: "POST",
                headers: { "RequestVerificationToken": token },
                contentType: "application/json",
                data: JSON.stringify({
                    RowId: loadtypeid,
                    Status: 0
                }),
                success: function (data) {
                    console.log("data output", data);
                    if (data !== null && typeof data == 'object') {
                        if (data.status) {
                            //successClick(data.message);
                            getLoadType();
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

function saveLoadType() {
    console.log('save', url_addLoadType);
    const loadtypeid = $("#loadtypeid").val();
    const load_name = $("#load_name").val();
    const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
    const token = tokenElement ? tokenElement.value : null;
    if (!token) {
        console.error("CSRF Token not found.");
        return;
    }
    if (!load_name) {
        swal("Warning!", "Please input Load Type Name!", {
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
        if (!loadtypeid) {
            $.ajax({
                url: url_addLoadType,
                type: "POST",
                headers: { "RequestVerificationToken": token },
                contentType: "application/json",
                data: JSON.stringify({
                    LoadName: load_name
                }),
                success: function (data) {
                    console.log("data output", data);
                    if (data !== null && typeof data == 'object') {
                        if (data.status) {
                            successClick(data.message);
                            getLoadType();
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
            console.log(JSON.stringify({
                RowId: loadtypeid,
                LoadName: load_name
            }))
            $.ajax({
                url: url_editLoadType,
                type: "POST",
                headers: { "RequestVerificationToken": token },
                contentType: "application/json",
                data: JSON.stringify({
                    RowId: loadtypeid,
                    LoadName: load_name
                }),
                success: function (data) {
                    console.log("data output", data);
                    if (data !== null && typeof data == 'object') {
                        if (data.status) {
                            successClick(data.message);
                            getLoadType();
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