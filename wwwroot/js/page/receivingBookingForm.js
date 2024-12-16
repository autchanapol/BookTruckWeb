﻿const url_getDepartments = window.AppUrls.getDepartmentsUrl;
const url_getCustomers = window.AppUrls.getCustomersUrl;
const url_getVehiclesTypes = window.AppUrls.getVehiclesTypesUrl;
const url_getGetLoadType = window.AppUrls.getGetLoadTypeUrl;
const url_getTeamps = window.AppUrls.getTempsUrl;
const url_addTicketsFrmRequester = window.AppUrls.addRequestUrl;
const url_getAssignUrl = window.AppUrls.getAssignUrl;
const url_getVehiclesUrl = window.AppUrls.getVehiclesUrl;
const url_GetTicketsFrmJobNoUrl = window.AppUrls.getTicketsFrmJobNoUrl;
const url_getVehiclesRowIdUrl = window.AppUrls.getVehiclesRowIdUrl;

let status_operation = 1;
// ตัวอย่างการใช้งาน 
const jobNo = getQueryParam("JobNo");


$(document).ready(function () {
    initialize();
});


$("#carDropdown").change(function () {
    const selectedVehicleId = $(this).val(); // ดึงค่า rowId ของรถที่เลือก

    if (selectedVehicleId) {
        getVehicleLicense(selectedVehicleId);
    } else {
        // หากไม่ได้เลือกอะไร เคลียร์ค่าใน input
        $("#carshow").val("-");
    }
})

function getVehicleLicense(id) {
    const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
    const token = tokenElement ? tokenElement.value : null;

    if (!token) {
        console.error("CSRF Token not found.");
        return;
    }

    $.ajax({
        url: url_getVehiclesRowIdUrl, // URL ของ API
        type: "POST",
        headers: { "RequestVerificationToken": token },
        contentType: "application/json",
        data: JSON.stringify({
            RowId: id
        }),
        success: function (data) {
            console.log("data License", data);
            if (data)
                $('#carshow').val(data.vehicleLicense);
            else
                $('#carshow').val("-");
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
        }
    });

}

async function initialize() {
    try {
        await Promise.all([
            getCustomers(),
            getDepartment(),
            getTemps(),
            getTrucType(),
            getLoadType(),
            getAssignUrl(),
            getRequestFrm()
            //getVehicles()
        ]);
        //await getVehicles();
        console.log("All functions completed successfully.");
    } catch (error) {
        console.error("Error occurred:", error);
    }
}

function getRequestFrm() {

    console.log('getRequestFrm', url_GetTicketsFrmJobNoUrl);
    console.log("JobNo:", jobNo);
    const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
    const token = tokenElement ? tokenElement.value : null;

    if (!token) {
        console.error("CSRF Token not found.");
        return;
    }
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url_GetTicketsFrmJobNoUrl, // URL ของ API
            type: "POST",
            headers: { "RequestVerificationToken": token },
            contentType: "application/json",
            data: JSON.stringify({
                JobNo: jobNo
            }),
            success: function (data) {
                console.log("data getRequestFrm", data);
                if (data) {
                    $('#row_id').val(data.rowId);
                    $('#department_id').val(data.departmentId);
                    $('#customers_id').val(data.customerId);
                    $('#trucktype_id').val(data.vehiclesTypeId);
                    $('#temp_id').val(data.tempId);
                    $('#backhual').prop('checked', data.backhual === 1);
                    $('#origin').val(data.origin);
                    $('#loading').val(data.loading);
                    $('#destination').val(data.destination);
                    $('#eta').val(data.etatostore);
                    $('#typeload_id').val(data.typeloadId);
                    $('#qty').val(data.qty);
                    $('#weight').val(data.weight);
                    $('#cbm').val(data.cbm);
                    $('#man').val(data.deliveryMan);
                    $('#handjack').prop('checked', data.handjack === 1);
                    $('#cart').prop('checked', data.cart === 1);
                    $('#cardboard').prop('checked', data.cardboard === 1);
                    $('#foam_box').prop('checked', data.foamBox === 1);
                    $('#dry_ice').prop('checked', data.dryIce === 1);
                    $('#comment').val(data.comment);
                    getVehicles();
                }
                else {

                }

            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
            }
        });
    });
}

// ดึงค่าจาก URL Query String
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param); // คืนค่าของ parameter ที่ต้องการ

}

function getVehicles() {
    const vehicleType = $('#trucktype_id').val();
        console.log("getVehicles", url_getVehiclesUrl)
    const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
    const token = tokenElement ? tokenElement.value : null;
    if (!token) {
        console.error("CSRF Token not found.");
        return;
    }
    return new Promise((resolve, reject) => {
        console.log('VehicleType',JSON.stringify({
            VehicleType: vehicleType
        }));
        $.ajax({
            url: url_getVehiclesUrl, // URL ของ API
            type: "POST",
            headers: { "RequestVerificationToken": token },
            contentType: "application/json",
            data: JSON.stringify({
                VehicleType: vehicleType
            }),
            success: function (data) {
                console.log("data getVehicles", data);
                // เคลียร์ Option เก่าทั้งหมดใน Select
                $("#carDropdown").empty();
                // เพิ่ม Option เริ่มต้น
                $("#carDropdown").append('<option value="">-- Select an option --</option>');
                if (Array.isArray(data) && data.length > 0) {
                    data.forEach(function (vehicle) {
                        $("#carDropdown").append(
                            `<option value="${vehicle.rowId}">${vehicle.vehicleName}</option>`
                        );
                    });
                } else {
                    // เพิ่ม Option กรณีไม่มีข้อมูล
                    $("#carDropdown").append('<option value="">No options available</option>');
                }
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
            }
        });
    });
}

function getAssignUrl() {
    console.log("getAssignUrl", url_getAssignUrl)
    const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
    const token = tokenElement ? tokenElement.value : null;
    if (!token) {
        console.error("CSRF Token not found.");
        return;
    }
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url_getAssignUrl, // URL ของ API
            type: "POST",
            headers: { "RequestVerificationToken": token },
            contentType: "application/json",
            data: JSON.stringify({
                RowId: 1
            }),
            success: function (data) {
                console.log("data assign", data);

                // เคลียร์ Option เก่าทั้งหมดใน Select
                $("#assign").empty();

                // เพิ่ม Option เริ่มต้น
                $("#assign").append('<option value="">-- Select an option --</option>');

                if (Array.isArray(data) && data.length > 0) {
                    data.forEach(function (as) {
                        $("#assign").append(
                            `<option value="${as.rowId}">${as.name}</option>`
                        );
                    });
                } else {
                    // เพิ่ม Option กรณีไม่มีข้อมูล
                    $("#assign").append('<option value="">No options available</option>');
                }
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
            }
        });
    });
}

function getDepartment() {
    const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
    const token = tokenElement ? tokenElement.value : null;
    if (!token) {
        console.error("CSRF Token not found.");
        return;
    }
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url_getDepartments, // URL ของ API
            type: "POST",
            headers: { "RequestVerificationToken": token },
            success: function (data) {
                console.log("data dep", data);

                // เคลียร์ Option เก่าทั้งหมดใน Select
                $("#department_id").empty();

                // เพิ่ม Option เริ่มต้น
                $("#department_id").append('<option value="">-- Select an option --</option>');

                if (Array.isArray(data) && data.length > 0) {
                    data.forEach(function (dep) {
                        $("#department_id").append(
                            `<option value="${dep.rowId}">${dep.departmentName}</option>`
                        );
                    });
                } else {
                    // เพิ่ม Option กรณีไม่มีข้อมูล
                    $("#department_id").append('<option value="">No options available</option>');
                }
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
            }
        });
    });
}

function getCustomers() {
    console.log('getCustomers', url_getCustomers);
    const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
    const token = tokenElement ? tokenElement.value : null;
    if (!token) {
        console.error("CSRF Token not found.");
        return;
    }
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url_getCustomers, // URL ของ API
            type: "POST",
            headers: { "RequestVerificationToken": token },
            success: function (data) {
                console.log("data cus", data);

                // เคลียร์ Option เก่าทั้งหมดใน Select
                $("#customers_id").empty();

                // เพิ่ม Option เริ่มต้น
                $("#customers_id").append('<option value="">-- Select an option --</option>');

                if (Array.isArray(data) && data.length > 0) {
                    data.forEach(function (cus) {
                        $("#customers_id").append(
                            `<option value="${cus.rowId}">${cus.customerName}</option>`
                        );
                    });
                } else {
                    // เพิ่ม Option กรณีไม่มีข้อมูล
                    $("#customers_id").append('<option value="">No options available</option>');
                }
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
            }
        });
    });
}

function getTrucType() {
    const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
    const token = tokenElement ? tokenElement.value : null;
    if (!token) {
        console.error("CSRF Token not found.");
        return;
    }
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url_getVehiclesTypes, // URL ของ API
            type: "POST",
            headers: { "RequestVerificationToken": token },
            success: function (data) {
                console.log(data);

                // เคลียร์ Option เก่าทั้งหมดใน Select
                $("#trucktype_id").empty();

                // เพิ่ม Option เริ่มต้น
                $("#trucktype_id").append('<option value="">-- Select an option --</option>');

                if (Array.isArray(data) && data.length > 0) {
                    data.forEach(function (trucktype) {
                        $("#trucktype_id").append(
                            `<option value="${trucktype.rowId}">${trucktype.vehicleTypeName}</option>`
                        );
                    });
                } else {
                    // เพิ่ม Option กรณีไม่มีข้อมูล
                    $("#trucktype_id").append('<option value="">No options available</option>');
                }
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
            }
        });
    });
}

function getTemps() {
    const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
    const token = tokenElement ? tokenElement.value : null;
    if (!token) {
        console.error("CSRF Token not found.");
        return;
    }
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url_getTeamps, // URL ของ API
            type: "POST",
            headers: { "RequestVerificationToken": token },
            success: function (data) {
                console.log("data dep", data);

                // เคลียร์ Option เก่าทั้งหมดใน Select
                $("#temp_id").empty();

                // เพิ่ม Option เริ่มต้น
                $("#temp_id").append('<option value="">-- Select an option --</option>');

                if (Array.isArray(data) && data.length > 0) {
                    data.forEach(function (temp) {
                        $("#temp_id").append(
                            `<option value="${temp.rowId}">${temp.tempName}</option>`
                        );
                    });
                } else {
                    // เพิ่ม Option กรณีไม่มีข้อมูล
                    $("#temp_id").append('<option value="">No options available</option>');
                }
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
            }
        });
    });
}

function getLoadType() {
    const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
    const token = tokenElement ? tokenElement.value : null;
    if (!token) {
        console.error("CSRF Token not found.");
        return;
    }
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url_getGetLoadType, // URL ของ API
            type: "POST",
            headers: { "RequestVerificationToken": token },
            success: function (data) {
                console.log("data dep", data);

                // เคลียร์ Option เก่าทั้งหมดใน Select
                $("#typeload_id").empty();

                // เพิ่ม Option เริ่มต้น
                $("#typeload_id").append('<option value="">-- Select an option --</option>');

                if (Array.isArray(data) && data.length > 0) {
                    data.forEach(function (load) {
                        $("#typeload_id").append(
                            `<option value="${load.rowId}">${load.loadName}</option>`
                        );
                    });
                } else {
                    // เพิ่ม Option กรณีไม่มีข้อมูล
                    $("#typeload_id").append('<option value="">No options available</option>');
                }
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
            }
        });
    });
}

function approve() {
    swal({
        title: "Are you sure?",
        text: `Approve This Job No ${jobNo} clicked!`,
        type: "warning",
        buttons: {
            confirm: {
                text: "Yes, Approve it!",
                className: "btn btn-success",
            },
            cancel: {
                visible: true,
                className: "btn btn-danger",
            },
        },
    }).then((Approve) => {
        if (Approve) {
            status_operation = 2;
            sendApi();
        } else {
            swal.close();
        }
    });
}

function reject() {
    swal({
        title: "Are you sure?",
        text: `Reject This Job No ${jobNo} clicked!`,
        type: "warning",
        buttons: {
            confirm: {
                text: "Yes, Reject it!",
                className: "btn btn-success",
            },
            cancel: {
                visible: true,
                className: "btn btn-danger",
            },
        },
    }).then((Reject) => {
        if (Reject) {
            status_operation = 3;
            sendApi();
        } else {
            swal.close();
        }
    });
}

function sendApi() {
    console.log('sendApi', url_addTicketsFrmRequester)
    const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
    const token = tokenElement ? tokenElement.value : null;
    const row_id = $('#row_id').val();
    const department_id = $('#department_id').val();
    const customers_id = $('#customers_id').val();
    const trucktype_id = $('#trucktype_id').val();
    const temp_id = $('#temp_id').val();
    const backhual = $('#backhual').is(':checked') ? 1 : 0;
    const origin = $('#origin').val();
    const loading = $('#loading').val();
    const destination = $('#destination').val();
    const eta = $('#eta').val();
    const typeload_id = $('#typeload_id').val();
    const qty = $('#qty').val();
    const weight = $('#weight').val();
    const cbm = $('#cbm').val();
    const man = $('#man').val();
    const handjack = $('#handjack').is(':checked') ? 1 : 0;
    const cart = $('#cart').is(':checked') ? 1 : 0;
    const cardboard = $('#cardboard').is(':checked') ? 1 : 0;
    const foam_box = $('#foam_box').is(':checked') ? 1 : 0;
    const dry_ice = $('#dry_ice').is(':checked') ? 1 : 0;
    const comment = $('#comment').val();
    //const assign = $('#assign').val();
    const vehiclesId = $('#carDropdown').val();
    const driver = $('#driver').val();
    const sub = $('#sub').val();
    const tel = $('#tel').val();
    const cost = $('#cost').val();
    const km = $('#km').val();

    const currentDateTime = new Date();
    const date_loading = new Date(loading); // สร้าง Date Object จากค่าใน input
    const date_eta = new Date(eta);

    if (!token) {
        console.error("CSRF Token not found.");
        return;
    }

    if (!department_id) {
        swal("Warning!", "Please Select a Department!", {
            icon: "warning",
            buttons: {
                confirm: {
                    className: "btn btn-warning",
                },
            },
        });
        return;
    }
    else if (!customers_id) {
        swal("Warning!", "Please Select a Customer!", {
            icon: "warning",
            buttons: {
                confirm: {
                    className: "btn btn-warning",
                },
            },
        });
        return;
    }
    else if (!trucktype_id) {
        swal("Warning!", "Please Select a Truck Type!", {
            icon: "warning",
            buttons: {
                confirm: {
                    className: "btn btn-warning",
                },
            },
        });
        return;
    }
    else if (!temp_id) {
        swal("Warning!", "Please Select a Temp!", {
            icon: "warning",
            buttons: {
                confirm: {
                    className: "btn btn-warning",
                },
            },
        });
        return;
    }
    else if (!origin) {
        swal("Warning!", "Please Specify Origin !", {
            icon: "warning",
            buttons: {
                confirm: {
                    className: "btn btn-warning",
                },
            },
        });
        return;
    }
    else if (!loading) {
        swal("Warning!", "Please Specify Loading Date !", {
            icon: "warning",
            buttons: {
                confirm: {
                    className: "btn btn-warning",
                },
            },
        });
        return;
    }
    else if (!destination) {
        swal("Warning!", "Please Specify Destination !", {
            icon: "warning",
            buttons: {
                confirm: {
                    className: "btn btn-warning",
                },
            },
        });
        return;
    }
    else if (!eta) {
        swal("Warning!", "Please Specify ETA Date !", {
            icon: "warning",
            buttons: {
                confirm: {
                    className: "btn btn-warning",
                },
            },
        });
        return;
    }
    else if (!qty) {
        swal("Warning!", "Please Specify QTY !", {
            icon: "warning",
            buttons: {
                confirm: {
                    className: "btn btn-warning",
                },
            },
        });
        return;
    }
    else if (!weight) {
        swal("Warning!", "Please Specify Weight !", {
            icon: "warning",
            buttons: {
                confirm: {
                    className: "btn btn-warning",
                },
            },
        });
        return;
    }
    else if (!cbm) {
        swal("Warning!", "Please Specify CBM !", {
            icon: "warning",
            buttons: {
                confirm: {
                    className: "btn btn-warning",
                },
            },
        });
        return;
    }
    else if (!vehiclesId && status_operation == 2) {
        swal("Warning!", "Please Specify Vehicles !", {
            icon: "warning",
            buttons: {
                confirm: {
                    className: "btn btn-warning",
                },
            },
        });
        return;
    }
    else if (!driver && status_operation == 2) {
        swal("Warning!", "Please Specify Driver !", {
            icon: "warning",
            buttons: {
                confirm: {
                    className: "btn btn-warning",
                },
            },
        });
        return;
    }
    else if (!cost && status_operation == 2) {
        swal("Warning!", "Please Specify Cost !", {
            icon: "warning",
            buttons: {
                confirm: {
                    className: "btn btn-warning",
                },
            },
        });
        return;
    }
    else if (!km && status_operation == 2) {
        swal("Warning!", "Please Specify KM !", {
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
        console.log('data json', JSON.stringify({
            RowId: row_id,
            JobNo: "-",
            DepartmentId: department_id,
            CustomerId: customers_id,
            VehiclesTypeId: trucktype_id,
            TempId: temp_id,
            Backhual: backhual,
            Origin: origin,
            Loading: loading,
            Destination: destination,
            Etatostore: eta,
            TypeloadId: typeload_id,
            Qty: qty,
            Weight: weight,
            Cbm: cbm,
            DeliveryMan: man,
            Handjack: handjack,
            Cart: cart,
            Cardboard: cardboard,
            FoamBox: foam_box,
            DryIce: dry_ice,
            Comment: comment,
            StatusOperation: status_operation,

            VehiclesId: status_operation === 3 ? null : vehiclesId || null,
            Driver: status_operation === 3 ? null : driver || null,
            Sub: status_operation === 3 ? null : sub || null,
            Tel: status_operation === 3 ? null : tel || null,
            TravelCosts: status_operation === 3 ? null : cost || null,
            Distance: status_operation === 3 ? null : km || null

        }) );

        $.ajax({
            url: url_addTicketsFrmRequester,
            type: "POST",
            headers: { "RequestVerificationToken": token },
            contentType: "application/json",
            data: JSON.stringify({
                RowId: row_id,
                JobNo: "-",
                DepartmentId: department_id,
                CustomerId: customers_id,
                VehiclesTypeId: trucktype_id,
                TempId: temp_id,
                Backhual: backhual,
                Origin: origin,
                Loading: loading,
                Destination: destination,
                Etatostore: eta,
                TypeloadId: typeload_id,
                Qty: qty,
                Weight: weight,
                Cbm: cbm,
                DeliveryMan: man,
                Handjack: handjack,
                Cart: cart,
                Cardboard: cardboard,
                FoamBox: foam_box,
                DryIce: dry_ice,
                Comment: comment,
                StatusOperation: status_operation,

                VehiclesId: status_operation === 3 ? null : vehiclesId || null,
                Driver: status_operation === 3 ? null : driver || null,
                Sub: status_operation === 3 ? null : sub || null,
                Tel: status_operation === 3 ? null : tel || null,
                TravelCosts: status_operation === 3 ? null : cost || null,
                Distance: status_operation === 3 ? null : km || null

            }),
            success: function (data) {
                console.log("data output", data);
                if (data !== null && typeof data == 'object') {
                    if (data.success) {
                        clearText();
                        swal("Successfully!", data.message + " Job No." + data.jobNo, {
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
                else {
                    // ไม่มีข้อมูล
                    console.log("Error:", "Error");
                }
            },
            error: function (xhr, status, error) {
                console.error("Status:", status);
                console.error("Error:", error);
                console.error("Response:", xhr.responseText); // ข้อความตอบกลับจากเซิร์ฟเวอร์
            }
        });
    }
}

function clearText() {

    $('#department_id').val('');
    $('#customers_id').val('');
    $('#trucktype_id').val('');
    $('#temp_id').val('');
    $('#backhual').prop('checked', false);
    $('#origin').val('');
    $('#loading').val('');
    $('#destination').val('');
    $('#eta').val('');
    $('#typeload_id').val('');
    $('#qty').val('');
    $('#weight').val('');
    $('#cbm').val('');
    $('#man').val('');
    $('#handjack').prop('checked', false);
    $('#cart').prop('checked', false);
    $('#cardboard').prop('checked', false);
    $('#foam_box').prop('checked', false);
    $('#dry_ice').prop('checked', false);
    $('#comment').val('');
    $('#assign').val('');
}