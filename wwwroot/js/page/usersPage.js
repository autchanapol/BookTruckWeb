var dataTable; // กำหนดตัวแปร Global
var url = yourApp.Urls.editUserUrl;
const url_getdep = getDep.Urls.depUrl;
const url_getrole = getDep2.Urls.depUrl2;
const url_role = roles.Urls.roleUrl;
const url_addUser = addUser.Urls.addUrl;
const url_editUser = editUser.Urls.editUrl;


function getDepartments() {
    console.log('getDepartments', url_getdep);
    const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
    const token = tokenElement ? tokenElement.value : null;
    if (!token) {
        console.error("CSRF Token not found.");
        return;
    }

    $.ajax({
        url: url_getdep, // URL ของ API
        type: "POST",
        headers: { "RequestVerificationToken": token },
        success: function (data) {
            console.log("data output", data);

            // เคลียร์ Option เก่าทั้งหมดใน Select
            $("#departments_id").empty();

            // เพิ่ม Option เริ่มต้น
            $("#departments_id").append('<option value="">-- Select an option --</option>');

            if (Array.isArray(data) && data.length > 0) {
                data.forEach(function (dep) {
                    $("#departments_id").append(
                        `<option value="${dep.rowId}">${dep.departmentName}</option>`
                    );
                });
            } else {
                // เพิ่ม Option กรณีไม่มีข้อมูล
                $("#departments_id").append('<option value="">No options available</option>');
            }
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
        }
    });
}


function getRole() {

    console.log('getRole', url_role);
    const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
    const token = tokenElement ? tokenElement.value : null;
    if (!token) {
        console.error("CSRF Token not found.");
        return;
    }

    $.ajax({
        url: url_role, // URL ของ API
        type: "POST",
        headers: { "RequestVerificationToken": token },
        success: function (data) {
            console.log("data roles", data);

            // เคลียร์ Option เก่าทั้งหมดใน Select
            $("#role_id").empty();

            // เพิ่ม Option เริ่มต้น
            $("#role_id").append('<option value="">-- Select an option --</option>');

            if (Array.isArray(data) && data.length > 0) {
                data.forEach(function (role) {
                    $("#role_id").append(
                        `<option value="${role.rowId}">${role.roleName}</option>`
                    );
                });
            } else {
                // เพิ่ม Option กรณีไม่มีข้อมูล
                $("#role_id").append('<option value="">No options available</option>');
            }
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
        }
    });
}

function getUser() {
    console.log('getUser');
    console.log('url', url);
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
                data.forEach(users => {
                    dataTable.row.add([
                        users.rowId,
                        users.idEmployee,
                        users.username,
                        users.firstName + ' ' + users.lastName,
                        users.roleName,
                        users.departmentName,
                        `
                        <div class="form-button-action">
                            <button type="button" class="btn btn-link btn-primary btn-lg"
                                    data-bs-toggle="modal" data-bs-target="#addRowModal"
                                    data-users-userid="${users.rowId}"
                                    data-users-idemployee="${users.idEmployee}"
                                    data-users-firstname="${users.firstName}"
                                    data-users-lastname="${users.lastName}"
                                    data-users-username="${users.username}"
                                    data-users-password="${users.password}"
                                    data-users-email="${users.email}"
                                    data-users-phone="${users.phone}"
                                    data-users-roleid="${users.roleId}"
                                    data-users-departmentid="${users.departmentId}">
                                <i class="fa fa-edit"></i>
                            </button>
                            <button type="button" class="btn btn-link btn-danger"
                                    data-users-userid="${users.rowId}">
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
                dataTable.row.add(["", "No Users found.", "", ""]).draw();
            }
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
        }
    });
}

// Click from Table Edir Rows
$("#UsersTable").on("click", ".btn-primary", function () {
    const userid = $(this).data("users-userid");
    //const employee_id = $(this).data("users-idEmployee");
    const idEmployee = $(this).data("users-idemployee"); // ต้องใช้ชื่อที่ตรงกัน
    const email = $(this).data("users-email");
    const phone = $(this).data("users-phone");
    const password = $(this).data("users-password");
    const username = $(this).data("users-username");
    
    const firstName = $(this).data("users-firstname");
    const lastName = $(this).data("users-lastname");
    const departments_id = $(this).data("users-departmentid");
    const role_id = $(this).data("users-roleid");
    console.log(password + " " + phone + " " + username + " " + firstName + " " + lastName);
    $("#h_name").text("Edit Us RowID : " + userid);
    $("#userid").val(userid);
    $("#email").val(email);
    $("#username").val(username);
    document.getElementById("username").readOnly = true;
    $("#password").val(password);
    $("#firstName").val(firstName);
    $("#lastName").val(lastName);
    $("#employee_id").val(idEmployee);
    $("#departments_id").val(departments_id);
    $("#role_id").val(role_id);
    $("#phone").val(phone);

});


$("#UsersTable").on("click", ".btn-danger", function () {
    // ดึงค่า department.rowId จาก data-id
    const userId = $(this).data("users-userid");
    const token = document.querySelector('input[name="__RequestVerificationToken"]').value; // ดึง CSRF Token
    swal({
        title: "Are you sure?",
        text: `Remove This Row for ID ${userId} clicked!`,
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
                url: url_editUser,
                type: "POST",
                headers: { "RequestVerificationToken": token },
                contentType: "application/json",
                data: JSON.stringify({
                    RowId: userId,
                    Status: 0
                }),
                success: function (data) {
                    console.log("data output", data);
                    if (data !== null && typeof data == 'object') {
                        if (data.status) {
                            //successClick(data.message);
                            getUser();
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
    dataTable = $("#UsersTable").DataTable({
        pageLength: 10, // จำนวนแถวต่อหน้า
        ordering: true, // เปิดใช้งานการเรียงลำดับ
        searching: true, // เปิดใช้งานการค้นหา
        lengthChange: true, // อนุญาตให้เปลี่ยนจำนวนแถวต่อหน้า
    });

    getDepartments();

    // เรียกโหลดข้อมูลครั้งแรก
    getUser(); // ไม่จำเป็นต้องส่ง dataTable เพราะเป็นตัวแปร Global
    getRole();
});


function addUserHandler() {
    const RowId = $('#userid').val();
    const employee_id = $('#employee_id').val();
    const username = $('#username').val();
    const password = $('#password').val();
    const firstName = $('#firstName').val();
    const lastName = $('#lastName').val();
    const email = $('#email').val();
    const departments_id = $('#departments_id').val();
    const role_id = $('#role_id').val();
    const phone = $('#phone').val();
    const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
    const token = tokenElement ? tokenElement.value : null;
    if (!token) {
        console.error("CSRF Token not found.");
        return;
    }
    console.log('Row ID', RowId);

    if (!employee_id || employee_id.trim() == "") {
        swal("Warning!", "Please input Employee ID!", {
            icon: "warning",
            buttons: {
                confirm: {
                    className: "btn btn-warning",
                },
            },
        });
        return;
    }
    else if (!username || username.trim() == "") {
        swal("Warning!", "Please input Username!", {
            icon: "warning",
            buttons: {
                confirm: {
                    className: "btn btn-warning",
                },
            },
        });
        return;
    }
    else if (!password || password.trim() == "") {
        swal("Warning!", "Please input Password!", {
            icon: "warning",
            buttons: {
                confirm: {
                    className: "btn btn-warning",
                },
            },
        });
        return;
    }
    else if (!firstName || firstName.trim() == "") {
        swal("Warning!", "Please input First Name!", {
            icon: "warning",
            buttons: {
                confirm: {
                    className: "btn btn-warning",
                },
            },
        });
        return;
    }
    else if (!lastName || lastName.trim() == "") {
        swal("Warning!", "Please input Last Name!", {
            icon: "warning",
            buttons: {
                confirm: {
                    className: "btn btn-warning",
                },
            },
        });
        return;
    }
    else if (!departments_id) {
        swal("Warning!", "Please Select the departments!", {
            icon: "warning",
            buttons: {
                confirm: {
                    className: "btn btn-warning",
                },
            },
        });
        return;
    }
    else if (!role_id) {
        swal("Warning!", "Please Select the Role!", {
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
                url: url_addUser,
                type: "POST",
                headers: { "RequestVerificationToken": token },
                contentType: "application/json",
                data: JSON.stringify({
                    Username: username,
                    Password: password,
                    FirstName: firstName,
                    LastName: lastName,
                    Email: email,
                    Status: 1,
                    Phone: phone,
                    RoleId: role_id,
                    DepartmentId: departments_id,
                    IdEmployee: employee_id
                }),
                success: function (data) {
                    console.log("data output", data);
                    if (data !== null && typeof data == 'object') {
                        if (data.status) {
                            successClick(data.message);
                            getUser();
                            $("#addRowModal").modal("hide");
                        }
                        else {
                            dangerClick(data.message);
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
            console.log('url edit user', url_editUser);
            $.ajax({
                url: url_editUser,
                type: "POST",
                headers: { "RequestVerificationToken": token },
                contentType: "application/json",
                data: JSON.stringify({
                    RowId: RowId,
                    Username: username,
                    Password: password,
                    FirstName: firstName,
                    LastName: lastName,
                    Email: email,
                    Status: 1,
                    Phone: phone,
                    RoleId: role_id,
                    DepartmentId: departments_id,
                    IdEmployee: employee_id
                }),
                success: function (data) {
                    console.log("data output", data);
                    if (data !== null && typeof data == 'object') {
                        if (data.status) {
                            successClick(data.message);
                            getUser();
                            $("#addRowModal").modal("hide");
                        }
                        else {
                            dangerClick(data.message);
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

$('#addRowModal').on('show.bs.modal', function () {
    // ล้างค่า Input ทุกช่องใน Modal
    $('#employee_id').val('');
    $('#username').val('');
    $('#password').val('');
    $('#firstName').val('');
    $('#lastName').val('');
    $('#email').val('');
    $('#departments_id').val('');
    $('#role_id').val('');
    $('#phone').val('');
    document.getElementById("username").readOnly = false;
});