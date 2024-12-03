var dataTable; // กำหนดตัวแปร Global
var url = yourApp.Urls.editUserUrl;
const url_getdep = getDep.Urls.depUrl;
const url_getrole = getDep2.Urls.depUrl2;
const url_role = roles.Urls.roleUrl;



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
                        users.username,
                        users.firstName + ' ' + users.lastName,
                        users.roleName,
                        users.departmentName,
                        `
                        <div class="form-button-action">
                            <button type="button" class="btn btn-link btn-primary btn-lg"
                                    data-bs-toggle="modal" data-bs-target="#addRowModal"
                                    data-users-userid="${users.rowId}"
                                    data-users-idEmployee="${users.idEmployee}"
                                    data-users-firstName="${users.firstName}"
                                    data-users-lastName="${users.lastName}"
                                    data-users-username="${users.username}"
                                    data-users-password="${users.password}"
                                    data-users-email="${users.email}"
                                    data-users-phone="${users.phone}"
                                    data-users-roleId="${users.roleId}"
                                    data-users-departmentId="${users.departmentId}">
                                <i class="fa fa-edit"></i>
                            </button>
                            <button type="button" class="btn btn-link btn-danger"
                                    data-department-id="${users.rowId}">
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
    const employee_id = $(this).data("users-idEmployee");
    const email = $(this).data("users-email");
    const phone = $(this).data("users-phone");
    const password = $(this).data("users-password");
    const username = $(this).data("users-username");
    const firstName = $(this).data("users-firstName");
    const lastName = $(this).data("users-lastName");
    const departments_id = $(this).data("users-departmentId");
    const role_id = $(this).data("users-roleId");
    console.log(employee_id);
    //$("#h_name").text("Edit User : " + userid);
    $("#userid").val(userid);
    $("#email").val(email);
    $("#username").val(username);
    $("#password").val(password);
    $("#firstName").val(firstName);
    $("#lastName").val(lastName);
    $("#employee_id").val(employee_id);
    $("#departments_id").val(departments_id);
    $("#role_id").val(role_id);
    $("#phone").val(phone);

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