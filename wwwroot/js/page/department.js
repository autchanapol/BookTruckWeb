

const basePath = window.location.pathname.split("/").slice(1, 2).join("/"); // ดึง "app"

var url = yourApp.Urls.editUserUrl;
var url_add = add_dep.Urls.saveDep;
var url_edit = edit_dep.Urls.saveDep;
var dataTable; // กำหนดตัวแปร Global

//getDepartments();
function getDepartments() {
    if (!dataTable) { // ตรวจสอบว่า dataTable ถูกสร้างแล้ว
        console.error("dataTable is not initialized.");
        return;
    }

    const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
    const token = tokenElement ? tokenElement.value : null;

    if (!token) {
        console.error("CSRF Token not found.");
        return;
    }

    $.ajax({
        url: url, // URL ของ API
        type: "POST",
        headers: { "RequestVerificationToken": token },
        success: function (data) {
            console.log("data output", data);

            // ล้างข้อมูลใน DataTable
            dataTable.clear();

            if (Array.isArray(data) && data.length > 0) {
                // เพิ่มข้อมูลใหม่ใน DataTable
                data.forEach(department => {
                    dataTable.row.add([
                        department.rowId,
                        department.departmentName,
                        department.dpn,
                        `
                        <div class="form-button-action">
                            <button type="button" class="btn btn-link btn-primary btn-lg"
                                    data-bs-toggle="modal" data-bs-target="#addRowModal"
                                    data-department-id="${department.rowId}"
                                    data-department-name="${department.departmentName}"
                                    data-department-dpn="${department.dpn}">
                                <i class="fa fa-edit"></i>
                            </button>
                            <button type="button" class="btn btn-link btn-danger"
                                    data-department-id="${department.rowId}">
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
                dataTable.row.add(["", "No departments found.", "", ""]).draw();
            }
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
        }
    });
}


// Click from Table Edir Rows
$("#departmentsTable").on("click", ".btn-primary", function () {
    const departmentId = $(this).data("department-id");
    const departmentName = $(this).data("department-name");
    const dpn = $(this).data("department-dpn");

    // เปลี่ยนชื่อ Modal Title
    $("#h_name").text("Edit Row");

    // ใส่ค่าลงในฟิลด์ของ Modal
    $("#dpn").val(dpn);

    // ใส่ค่าลงในฟิลด์ของ Modal
    $("#departmentName").val(departmentName);

    // คุณสามารถเก็บ ID ไว้ในที่ซ่อน (hidden input) หากต้องการ
    $("#departmentId").val(departmentId);
});


$("#departmentsTable").on("click", ".btn-danger", function () {
    // ดึงค่า department.rowId จาก data-id
    const departmentId = $(this).data("department-id");
    const token = document.querySelector('input[name="__RequestVerificationToken"]').value; // ดึง CSRF Token
    swal({
        title: "Are you sure?",
        text: `Remove This Row for ID ${departmentId} clicked!`,
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
                url: url_edit,
                type: "POST",
                headers: { "RequestVerificationToken": token },
                contentType: "application/json",
                data: JSON.stringify({
                    RowId: departmentId,
                    Status : 0
                }),
                success: function (data) {
                    console.log("data output", data);
                    if (data !== null && typeof data == 'object') {
                        if (data.success) {
                            //successClick(data.message);
                            getDepartments();
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


$(document).ready(function () {
    // สร้าง DataTable
    dataTable = $("#departmentsTable").DataTable({
        pageLength: 10, // จำนวนแถวต่อหน้า
        ordering: true, // เปิดใช้งานการเรียงลำดับ
        searching: true, // เปิดใช้งานการค้นหา
        lengthChange: true, // อนุญาตให้เปลี่ยนจำนวนแถวต่อหน้า
    });

    // เรียกโหลดข้อมูลครั้งแรก
    getDepartments(); // ไม่จำเป็นต้องส่ง dataTable เพราะเป็นตัวแปร Global
});



function addDepartmentHandler() {
    const newDepartmentName = $("#departmentName").val();
    const newDpn = $("#dpn").val();
    const RowId = $("#departmentId").val();
    const token = document.querySelector('input[name="__RequestVerificationToken"]').value; // ดึง CSRF Token
    console.log('Row ID', RowId);
    if (!newDepartmentName) {
        swal("Warning!", "Please input Department Name!", {
            icon: "warning",
            buttons: {
                confirm: {
                    className: "btn btn-warning",
                },
            },
        });
        return;
    } else if (!newDpn) {
        swal("Warning!", "Please input DPN!", {
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
                url: url_add,
                type: "POST",
                headers: { "RequestVerificationToken": token },
                contentType: "application/json",
                data: JSON.stringify({
                    DepartmentName: newDepartmentName,
                    Dpn: newDpn
                }),
                success: function (data) {
                    console.log("data output", data);
                    if (data !== null && typeof data == 'object') {
                        if (data.success) {
                            successClick(data.message);
                            getDepartments();
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
                RowId: RowId,
                DepartmentName: newDepartmentName,
                Dpn: newDpn,
                Status: 1
            }));
            $.ajax({
                url: url_edit,
                type: "POST",
                headers: { "RequestVerificationToken": token },
                contentType: "application/json",
                data: JSON.stringify({
                    RowId: RowId,
                    DepartmentName: newDepartmentName,
                    Dpn: newDpn,
                    Status: 1
                }),
                success: function (data) {
                    console.log("data output", data);
                    if (data !== null && typeof data == 'object') {
                        if (data.success) {
                            successClick(data.message);
                            getDepartments();
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

};

$('#addRowModal').on('show.bs.modal', function () {
    // ล้างค่า Input ทุกช่องใน Modal
    $('#departmentId').val('');
    $('#departmentName').val('');
    $('#dpn').val('');
});


