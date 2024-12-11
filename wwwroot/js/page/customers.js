﻿var dataTable; // กำหนดตัวแปร Global
/*const url_getCustomers = getCustomers.Urls.getCustomersUrl;*/
const url_getCustomers = window.AppUrls.getCustomersUrl;
const url_getCustomersRow = window.AppUrls.getCustomersRowUrl;
const url_addCustomers = window.AppUrls.addCustomersUrl;
const url_editCustomers = window.AppUrls.editCustomersUrl;

$(document).ready(function () {
    // สร้าง DataTable
    dataTable = $("#customers-table").DataTable({
        pageLength: 10, // จำนวนแถวต่อหน้า
        ordering: true, // เปิดใช้งานการเรียงลำดับ
        searching: true, // เปิดใช้งานการค้นหา
        lengthChange: true, // อนุญาตให้เปลี่ยนจำนวนแถวต่อหน้า
    });
    getCustomers();
});

function getCustomers() {
    console.log('getCustomers', url_getCustomers);
    const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
    const token = tokenElement ? tokenElement.value : null;
    if (!token) {
        console.error("CSRF Token not found.");
        return;
    }

    $.ajax({
        url: url_getCustomers, // URL ของ API
        type: "POST",
        headers: { "RequestVerificationToken": token },
        success: function (data) {
            console.log("data output", data);

            // ล้างข้อมูลใน DataTable
            dataTable.clear();

            if (Array.isArray(data) && data.length > 0) {
                // เพิ่มข้อมูลใหม่ใน DataTable
                data.forEach(customers => {
                    dataTable.row.add([
                        customers.rowId,
                        customers.customerId,
                        customers.companyId,
                        customers.customerName,
                        `
                        <div class="form-button-action">
                            <button type="button" class="btn btn-link btn-primary btn-lg"
                                    data-bs-toggle="modal" data-bs-target="#addRowModal"
                                    data-customers-id="${customers.rowId}">
                                <i class="fa fa-edit"></i>
                            </button>
                            <button type="button" class="btn btn-link btn-danger"
                                    data-customers-id="${customers.rowId}">
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
                dataTable.row.add(["", "", "No truck Type found.", "", ""]).draw();
            }
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
        }
    });
}


$("#customers-table").on("click", ".btn-primary", function () {
    const rowId = $(this).data("customers-id");
    console.log('getRw', url_getCustomersRow + ' ' + rowId);
    $("#hn").text("Edit Row ");
    const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
    const token = tokenElement ? tokenElement.value : null;
    if (!token) {
        console.error("CSRF Token not found.");
        return;
    }
    if (rowId) {
        console.log('data', JSON.stringify({
            RowId: rowId
        }));
        $.ajax({
            url: url_getCustomersRow,
            type: "POST",
            headers: { "RequestVerificationToken": token },
            contentType: "application/json",
            data: JSON.stringify({ RowId: rowId }),
            success: function (data) {
                console.log("data output", data);
                if (data) {
                    $("#rowId").val(rowId);
                    $("#customer_name").val(data.customerName);
                    $("#customer_id").val(data.customerId);
                    $("#company_id").val(data.companyId);
                    $("#address1").val(data.address1);
                    $("#address2").val(data.address2);
                    $("#address3").val(data.address3);
                    $("#city").val(data.city);
                    $("#state").val(data.state);
                    $("#country").val(data.country);
                    $("#pastal_code").val(data.pastalCode);
                }
                else {
                    console.error("Error:", 'No Data return');
                }
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
            }
        });
    }
    else {
        console.log('no have rowId');
    }
})

$("#customers-table").on("click", ".btn-danger", function () {
    // ดึงค่า department.rowId จาก data-id
    const rowId = $(this).data("customers-id");
    const token = document.querySelector('input[name="__RequestVerificationToken"]').value; // ดึง CSRF Token
    swal({
        title: "Are you sure?",
        text: `Remove This Row for ID ${rowId} clicked!`,
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
                url: url_editCustomers,
                type: "POST",
                headers: { "RequestVerificationToken": token },
                contentType: "application/json",
                data: JSON.stringify({
                    RowId: rowId,
                    Status: 0
                }),
                success: function (data) {
                    console.log("data output", data);
                    if (data !== null && typeof data == 'object') {
                        if (data.status) {
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

function saveCustomers() {

    const rowId = $("#rowId").val();
    const customer_name = $("#customer_name").val();
    const customer_id = $("#customer_id").val();
    const company_id = $("#company_id").val();
    const address1 = $("#address1").val();
    const address2 = $("#address2").val();
    const address3 = $("#address3").val();
    const city = $("#city").val();
    const state = $("#state").val();
    const country = $("#country").val();
    const pastal_code = $("#pastal_code").val();
    const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
    const token = tokenElement ? tokenElement.value : null;
    if (!token) {
        console.error("CSRF Token not found.");
        return;
    }

    if (!customer_name) {
        swal("Warning!", "Please input Customer Name!", {
            icon: "warning",
            buttons: {
                confirm: {
                    className: "btn btn-warning",
                },
            },
        });
        return;
    }
    else if (!customer_id) {
        swal("Warning!", "Please input Customer ID!", {
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
        if (!rowId) {
            $.ajax({
                url: url_addCustomers,
                type: "POST",
                headers: { "RequestVerificationToken": token },
                contentType: "application/json",
                data: JSON.stringify({
                    CustomerId: customer_id,
                    CustomerName: customer_name,
                    CompanyId: company_id,
                    Address1: address1,
                    Address2: address2,
                    Address3: address3,
                    City: city,
                    State: state,
                    Country: country,
                    PastalCode: pastal_code,
                    Remarks: "",
                    Active: 1
                }),
                success: function (data) {
                    console.log("data output", data);
                    if (data !== null && typeof data == 'object') {
                        if (data.status) {
                            successClick(data.message);
                            getCustomers();
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
                url: url_editCustomers,
                type: "POST",
                headers: { "RequestVerificationToken": token },
                contentType: "application/json",
                data: JSON.stringify({
                    RowId: rowId,
                    CustomerId: customer_id,
                    CustomerName: customer_name,
                    CompanyId: company_id,
                    Address1: address1,
                    Address2: address2,
                    Address3: address3,
                    City: city,
                    State: state,
                    Country: country,
                    PastalCode: pastal_code,
                    Remarks: "",
                    Active: 1
                }),
                success: function (data) {
                    console.log("data output", data);
                    if (data !== null && typeof data == 'object') {
                        if (data.status) {
                            successClick(data.message);
                            getCustomers();
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

$('#addRowModal').on('show.bs.modal', function () {
    // ล้างค่า Input ทุกช่องใน Modal
    $("#hn").text('New Row');
    $("#rowId").val('');
    $("#customer_name").val('');
    $("#customer_id").val('');
    $("#company_id").val('');
    $("#address1").val('');
    $("#address2").val('');
    $("#address3").val('');
    $("#city").val('');
    $("#state").val('');
    $("#country").val('');
    $("#pastal_code").val('');
});