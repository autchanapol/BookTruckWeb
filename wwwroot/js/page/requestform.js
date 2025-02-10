const url_getDepartments = window.AppUrls.getDepartmentsUrl;
const url_getCustomers = window.AppUrls.getCustomersUrl;
const url_getVehiclesTypes = window.AppUrls.getVehiclesTypesUrl;
const url_getGetLoadType = window.AppUrls.getGetLoadTypeUrl;
const url_getTeamps = window.AppUrls.getTempsUrl;
const url_addTicketsFrmRequester = window.AppUrls.addRequestUrl;
const url_getAssignUrl = window.AppUrls.getAssignUrl;
const url_getCustomerId = window.AppUrls.getCustomerWid;
//const url_getAssignUrl = window.AppUrls.getAssignUrl;
var input = document.getElementById("customers_code");
const jobNo = getQueryParam("JobNo");
var i = 0;

// Alert /////
let title_ticketInput = document.getElementById("title_ticket");
let department_idOption = document.getElementById("department_id");
let trucktype_idOption = document.getElementById("trucktype_id");
let temp_idOption = document.getElementById("temp_id");
let loading_input = document.getElementById("loading");
let eta_input = document.getElementById("eta");
let typeload_idOption = document.getElementById("typeload_id");
let assign_option = document.getElementById("assign");
let customers_idInput = document.getElementById("customers_id");
let customers_codeInput = document.getElementById("customers_code");
let origin_input = document.getElementById("origin");
let destination_input = document.getElementById("destination");
let qty_input = document.getElementById("qty");
let weight_input = document.getElementById("weight");
let cbm_input = document.getElementById("cbm");

title_ticketInput.addEventListener("input", function () {
    if (title_ticketInput.value.trim() !== "") {
        title_ticketInput.classList.remove("is-invalid");
    }

});
department_idOption.addEventListener("change", function () {
    if (department_idOption.value.trim() !== "") {
        department_idOption.classList.remove("is-invalid");
    }
})
trucktype_idOption.addEventListener("change", function () {
    if (trucktype_idOption.value.trim() !== "") {
        trucktype_idOption.classList.remove("is-invalid");
    }
})
temp_idOption.addEventListener("change", function () {
    if (temp_idOption.value.trim() !== "") {
        temp_idOption.classList.remove("is-invalid");
    }
})
loading_input.addEventListener("input", function () {
    if (loading_input.value.trim() !== "") {
        loading_input.classList.remove("is-invalid");
    }
})
eta_input.addEventListener("input", function () {
    if (eta_input.value.trim() !== "") {
        eta_input.classList.remove("is-invalid");
    }
})
typeload_idOption.addEventListener("change", function () {
    if (typeload_idOption.value.trim() !== "") {
        typeload_idOption.classList.remove("is-invalid");
    }
})
assign_option.addEventListener("change", function () {
    if (assign_option.value.trim() !== "") {
        assign_option.classList.remove("is-invalid");
    }
})
customers_codeInput.addEventListener("input", function () {
    if (customers_codeInput.value.trim() !== "") {
        customers_codeInput.classList.remove("is-invalid");
    }
});
customers_idInput.addEventListener("input", function () {
    if (customers_idInput.value.trim() !== "") {
        customers_codeInput.classList.remove("is-invalid");
    }
});
origin_input.addEventListener("input", function () {
    if (origin_input.value.trim() !== "") {
        origin_input.classList.remove("is-invalid");
    }
    //document.querySelector(".error-message").style.display = "block"; // แสดงข้อความ error
});
destination_input.addEventListener("input", function () {
    if (destination_input.value.trim() !== "") {
        destination_input.classList.remove("is-invalid");
    }
});
qty_input.addEventListener("input", function () {
    if (qty_input.value.trim() !== "") {
        qty_input.classList.remove("is-invalid");
    }
});
weight_input.addEventListener("input", function () {
    if (weight_input.value.trim() !== "") {
        weight_input.classList.remove("is-invalid");
    }
});
cbm_input.addEventListener("input", function () {
    if (cbm_input.value.trim() !== "") {
        cbm_input.classList.remove("is-invalid");
    }
});

// End Alert /////

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
        console.log("Enter");
        // Cancel the default action, if needed
        event.preventDefault();

        const customers_code = $('#customers_code').val();
        if (!customers_code) {
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
            console.log(customers_code);
            getCustomersWhereId(customers_code);
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

        // เพิ่ม Event Listener สำหรับเลือกแถว css
        row.addEventListener("click", function () {
            if (selectedRow) {
                selectedRow.classList.remove("selected");
                console.log("Removed selected from:", selectedRow);
            }
            selectedRow = this;
            this.classList.add("selected");
            console.log("Added selected to:", selectedRow);
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
            $('#customers_id').val(rowId);
            $('#customers_code').val(customerId);
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
    const today = moment().format("YYYY-MM-DDTHH:mm");
    //$('#loading').val('');
    //$('#eta').val('');
    const startDateInput = document.querySelector("#loading");
    const eta = document.querySelector("#eta");
    startDateInput.value = today;
    eta.value = today;
    startDateInput.setAttribute(
        "data-date",
        moment(today, "YYYY-MM-DDTHH:mm").format(startDateInput.getAttribute("data-date-format"))
    );
    eta.setAttribute(
        "data-date",
        moment(today, "YYYY-MM-DDTHH:mm").format(eta.getAttribute("data-date-format"))
    );
    i = 0;
    $('#department_id').val('');
    $('#customers_id').val('');
    $('#title_ticket').val('');
    $('#trucktype_id').val('');
    $('#temp_id').val('');
    $('#backhual').prop('checked', false);
    $('#origin').val('');
    $('#destination').val('');
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
    $('#customer_id').val('');
    $('#customers_code').val('');
    $('#customers_name').val('');
    const tableBody = document.getElementById('dataTable').querySelector('tbody');
    tableBody.innerHTML = ""; // ลบข้อมูลทั้งหมดใน <tbody>

    
}

function clearTextDetails() {
    $('#customers_code').val('');
    $('#customers_name').val('');
    $('#customers_id').val('');
    $('#destination').val('');
    $('#qty').val('');
    $('#weight').val('');
    $('#cbm').val('');
    $('#origin').val('');

}


function addRequestRow() {
    let isValid = true;
    const customers_id = $('#customers_id').val();
    const customers_code = $('#customers_code').val();
    const customers_name = $('#customers_name').val();
    const destination = $('#destination').val();
    const qty = $('#qty').val();
    const weight = $('#weight').val();
    const cbm = $('#cbm').val();
    const origin = $('#origin').val();

    if (!destination) {
        isValid = false;
        destination_input.classList.add("is-invalid");
    }
    else {
        destination_input.classList.remove("is-invalid");
    }

    if (!customers_id) {
        isValid = false;
        customers_codeInput.classList.add("is-invalid");
    }
    else {
        customers_codeInput.classList.remove("is-invalid");
    }
    if (!qty) {
        isValid = false;
        qty_input.classList.add("is-invalid");
    }
    else {
        qty_input.classList.remove("is-invalid");
    }
    if (!weight) {
        isValid = false;
        weight_input.classList.add("is-invalid");
    }
    else {
        weight_input.classList.remove("is-invalid");
    }
    if (!cbm) {
        isValid = false;
        cbm_input.classList.add("is-invalid");
    }
    else {
        cbm_input.classList.remove("is-invalid");
    }
    if (!origin) {
        isValid = false;
        origin_input.classList.add("is-invalid");
    }
    else {
        origin_input.classList.remove("is-invalid");
    }
    if (isValid == false)
    {
        swal("Warning!", "กรุณารุะบุตามในช่องที่แดงให้ครบก่อน !", {
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

        const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
        // สร้างแถวใหม่
        const newRow = tableBody.insertRow();
        i += 1;
        const cell0 = newRow.insertCell();
        cell0.textContent = i;
       
        //const cell1 = newRow.insertCell();
        //cell1.textContent = customers_code;

        newRow.insertCell().textContent = customers_code;
        newRow.insertCell().textContent = customers_name;
        newRow.insertCell().textContent = origin;
        newRow.insertCell().textContent = destination;
        newRow.insertCell().textContent = qty;
        newRow.insertCell().textContent = weight;
        newRow.insertCell().textContent = cbm;

        // ✅ เพิ่มปุ่มลบในแถวนี้
        const actionCell = newRow.insertCell();
        const deleteButton = document.createElement('button');
        deleteButton.textContent = "ลบ";
        deleteButton.style.backgroundColor = "red";
        deleteButton.style.color = "white";
        deleteButton.style.border = "none";
        deleteButton.style.padding = "5px";
        deleteButton.style.cursor = "pointer";

        // เมื่อกดปุ่มลบ ให้ลบแถวนี้
        deleteButton.onclick = function () {
            newRow.remove();
        };
        actionCell.appendChild(deleteButton);

        newRow.setAttribute('data-customers_id', customers_id);
    }


    clearTextDetails();

}

function saveRequestFrom() {
    const customer_row = $('#customer_row').val();
    const title_ticket = $('#title_ticket').val();
    const department_id = $('#department_id').val();
    const trucktype_id = $('#trucktype_id').val();
    const temp_id = $('#temp_id').val();
    const backhual = $('#backhual').is(':checked') ? 1 : 0;
    const loading = $('#loading').val();
    const eta = $('#eta').val();
    const typeload_id = $('#typeload_id').val();
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
    let isValid = true; // ใช้เพื่อตรวจสอบว่ามีข้อผิดพลาดหรือไม่
    if (!token) {
        console.error("CSRF Token not found.");
        return;
    }

    if (!title_ticket) {
        title_ticketInput.classList.add("is-invalid");
        isValid = false;
        //swal("Warning!", "Please Specify a Title!", {
        //    icon: "warning",
        //    buttons: {
        //        confirm: {
        //            className: "btn btn-warning",
        //        },
        //    },
        //});
        //return;
    }
    else {
        title_ticketInput.classList.remove("is-invalid");
    }

    if (!department_id) {
        isValid = false;
        department_idOption.classList.add("is-invalid");
    }
    else {
        department_idOption.classList.remove("is-invalid");
    }
    if (!trucktype_id) {
        isValid = false;
        trucktype_idOption.classList.add("is-invalid")
    }
    else {
        trucktype_idOption.classList.remove("is-invalid")
    }


    if (!temp_id) {
        isValid = false;
        temp_idOption.classList.add("is-invalid");
    }
    else {
        temp_idOption.classList.remove("is-invalid");
    }
    
     if (!loading) {
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
     if (!eta) {
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
    if (!assign) {
        isValid = false;
        assign_option.classList.add("is-invalid");
    }
    else {
        assign_option.classList.remove("is-invalid");
    }

    if (isValid == false) {
            swal("Warning!", "กรุณากรอกตามช่องสีแดงให้ครบก่อน !", {
                icon: "warning",
                buttons: {
                    confirm: {
                        className: "btn btn-warning",
                    },
                },
            });
            return;
    }

 
        const tableBody = document.getElementById('dataTable').querySelector('tbody');
        const rows = tableBody.querySelectorAll('tr');

        if (rows.length == 0) {
            swal("Warning!", "กรุณาเพิ่มรายละเอียดงานก่อน", {
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
            const data = [];

            rows.forEach(row => {
                const cells = row.querySelectorAll('td');

                const rowData = {
                    CustomerId: row.getAttribute('data-customers_id'),
                    Origin: cells[3].textContent.trim(),
                    Destination: cells[4].textContent.trim(),
                    Qty: cells[5].textContent.trim(),
                    Weight: cells[6].textContent.trim(),
                    Cbm: cells[7].textContent.trim()
                };

                data.push(rowData);
            });

            console.log(JSON.stringify(data, null, 2));

            console.log("date", JSON.stringify({
                JobNo: "TT",
                Title: title_ticket,
                DepartmentId: department_id,
                VehiclesTypeId: trucktype_id,
                TempId: temp_id,
                Backhual: backhual,
                Loading: loading,
                Etatostore: eta,
                TypeloadId: typeload_id,
                DeliveryMan: man,
                Handjack: handjack,
                Cart: cart,
                Cardboard: cardboard,
                FoamBox: foam_box,
                DryIce: dry_ice,
                Comment: comment,
                StatusOperation: 1,
                Assign: assign,
                Data: data
            }));

            $.ajax({
                url: url_addTicketsFrmRequester,
                type: "POST",
                headers: { "RequestVerificationToken": token },
                contentType: "application/json",
                data: JSON.stringify({
                    JobNo: "TT",
                    Title: title_ticket,
                    DepartmentId: department_id,
                    VehiclesTypeId: trucktype_id,
                    TempId: temp_id,
                    Backhual: backhual,
                    Loading: loading,
                    Etatostore: eta,
                    TypeloadId: typeload_id,
                    DeliveryMan: man,
                    Handjack: handjack,
                    Cart: cart,
                    Cardboard: cardboard,
                    FoamBox: foam_box,
                    DryIce: dry_ice,
                    Comment: comment,
                    StatusOperation: 0,
                    Assign: assign,
                    Data: data
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