const url_getDepartments = window.AppUrls.getDepartmentsUrl;
const url_getCustomers = window.AppUrls.getCustomersUrl;
const url_getVehiclesTypes = window.AppUrls.getVehiclesTypesUrl;
const url_getGetLoadType = window.AppUrls.getGetLoadTypeUrl;
const url_getTeamps = window.AppUrls.getTempsUrl;
const url_addTicketsFrmRequester = window.AppUrls.addRequestUrl;
const url_getAssignUrl = window.AppUrls.getAssignUrl;

$(document).ready(function () {

    getCustomers();
    getDepartment();
    getTemps();
    getTrucType();
    getLoadType();
    getAssignUrl();

});


function getAssignUrl() {
    console.log("getAssignUrl", url_getAssignUrl)
    const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
    const token = tokenElement ? tokenElement.value : null;
    if (!token) {
        console.error("CSRF Token not found.");
        return;
    }
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
}

function getDepartment() {
    const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
    const token = tokenElement ? tokenElement.value : null;
    if (!token) {
        console.error("CSRF Token not found.");
        return;
    }

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
}

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
}

function getTrucType() {
    const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
    const token = tokenElement ? tokenElement.value : null;
    if (!token) {
        console.error("CSRF Token not found.");
        return;
    }

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
}

function getTemps() {
    const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
    const token = tokenElement ? tokenElement.value : null;
    if (!token) {
        console.error("CSRF Token not found.");
        return;
    }

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
}

function getLoadType() {
    const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
    const token = tokenElement ? tokenElement.value : null;
    if (!token) {
        console.error("CSRF Token not found.");
        return;
    }

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

function saveRequestFrom() {
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
    const assign = $('#assign').val();
    const currentDateTime = new Date();
    const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
    const token = tokenElement ? tokenElement.value : null;

    const date_loading = new Date(loading); // สร้าง Date Object จากค่าใน input
    const date_eta = new Date(eta);
    console.log(loading);
    console.log(date_loading);
    console.log(currentDateTime);

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
    //else if (date_loading < currentDateTime) {
    //    swal("Warning!", "The selected date and time is in the past (Loading) !", {
    //        icon: "warning",
    //        buttons: {
    //            confirm: {
    //                className: "btn btn-warning",
    //            },
    //        },
    //    });
    //    return;
    //}
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
    //else if (date_eta < currentDateTime)
    //{
    //    swal("Warning!", "The selected date and time is in the past (ETA) !", {
    //        icon: "warning",
    //        buttons: {
    //            confirm: {
    //                className: "btn btn-warning",
    //            },
    //        },
    //    });
    //    return;
    //}
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
    else if (!assign) {
        swal("Warning!", "Please Specify Assign To !", {
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

        console.log("date", JSON.stringify({
            JobNo: "TT",
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
            StatusOperation: 1,
            Assign: assign
        }));

        $.ajax({
            url: url_addTicketsFrmRequester,
            type: "POST",
            headers: { "RequestVerificationToken": token },
            contentType: "application/json",
            data: JSON.stringify({
                JobNo: "TT",
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
                StatusOperation: 1,
                Assign: assign
            }),
            success: function (data) {
                console.log("data output", data);
                if (data !== null && typeof data == 'object') {
                    if (data.status) {
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
                        //successClick(data.message);
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