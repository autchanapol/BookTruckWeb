const url_getDepartments = window.AppUrls.getDepartmentsUrl;
const url_getCustomers = window.AppUrls.getCustomersUrl;
const url_getVehiclesTypes = window.AppUrls.getVehiclesTypesUrl;
const url_getGetLoadType = window.AppUrls.getGetLoadTypeUrl;
const url_getTeamps = window.AppUrls.getTempsUrl;
const url_addTicketsFrmRequester = window.AppUrls.addRequestUrl;
const url_getAssignUrl = window.AppUrls.getAssignUrl;
const url_getCustomerId = window.AppUrls.getCustomerWid;
//const url_getAssignUrl = window.AppUrls.getAssignUrl;
var input = document.getElementById("customers_id");
const jobNo = getQueryParam("JobNo");

$(document).ready(function () {

    //getCustomers();
    getDepartment();
    getTemps();
    getTrucType();
    getLoadType();
    getAssignUrl();
    //getRequestFrm();

});

input.addEventListener("keypress", function (event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
        // Cancel the default action, if needed
        event.preventDefault();

        const customers_id = $('#customers_id').val();
        if (!customers_id) {
            swal("Warning!", "กรุณากรอกรหัสลูกค้าก่อนค้นหา!", {
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
            getCustomersWhereId(customers_id);
            // ใช้ Bootstrap Modal API เปิด modal
            //const modal = new bootstrap.Modal(document.getElementById('scrollableModal'));
            //modal.show(); // แสดง modal
        }
    }
});

// ดึงค่าจาก URL Query String
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param); // คืนค่าของ parameter ที่ต้องการ

}
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

function getCustomersWhereId(customerid) {
    console.log(url_getCustomerId);
    const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
    const token = tokenElement ? tokenElement.value : null;
    if (!token) {
        console.error("CSRF Token not found.");
        return;
    }

    $.ajax({
        url: url_getCustomerId, 
        type: "POST",
        contentType: "application/json",
        headers: { "RequestVerificationToken": token },
        data: JSON.stringify({
            CustomerId: customerid,
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
    const tbody = document.querySelector("#customer-table tbody"); // อ้างอิง <tbody>
    let selectedRow = null;

    // ล้างข้อมูลเก่า
    tbody.innerHTML = "";

    // ตรวจสอบข้อมูลก่อนลูป
    if (!Array.isArray(data)) {
        console.error("Data is not an array.");
        return;
    }

    // เพิ่มข้อมูลใหม่ในตาราง
    data.forEach((customer, index) => {
        const row = document.createElement("tr");
        row.setAttribute("data-rowid", customer.rowId);

        // สร้างเซลล์และเพิ่มข้อมูล
        const cellIndex = document.createElement("td");
        cellIndex.textContent = index + 1;

        const cellCustomerId = document.createElement("td");
        cellCustomerId.textContent = customer.customerId;

        const cellCustomerName = document.createElement("td");
        cellCustomerName.textContent = customer.customerName;

        // เพิ่มเซลล์ในแถว
        row.appendChild(cellIndex);
        row.appendChild(cellCustomerId);
        row.appendChild(cellCustomerName);

        // เพิ่ม Event Listener สำหรับเลือกแถว
        row.addEventListener("click", function () {
            if (selectedRow) {
                selectedRow.classList.remove("selected"); // เอาคลาส selected ออกจากแถวที่เลือกก่อนหน้า
            }
            selectedRow = this; // กำหนดแถวที่เลือกใหม่
            this.classList.add("selected"); // เพิ่มคลาส selected ให้กับแถวที่เลือก
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
            const customerId = selectedRow.children[1].textContent;
            const customerName = selectedRow.children[2].textContent;

            // แสดงข้อมูลที่เลือกใน console.log
            console.log("RowId:", rowId);
            console.log("CustomerId:", customerId);
            console.log("CustomerName:", customerName);

            // เติมค่าในฟิลด์ input
            $('#customer_row').val(rowId);
            $('#customers_id').val(customerId);
            $('#customers_name').val(customerName);
            
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
    $('#customer_row').val('');
    
}

function saveRequestFrom() {
    const customer_row = $('#customer_row').val();
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
    else if (!customer_row) {
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
            CustomerId: customer_row,
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
                CustomerId: customer_row,
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