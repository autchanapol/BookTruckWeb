﻿
const url_getDepartments = window.AppUrls.getDepartmentsUrl;
const url_getCustomers = window.AppUrls.getCustomersUrl;
const url_getVehiclesTypes = window.AppUrls.getVehiclesTypesUrl;
const url_getGetLoadType = window.AppUrls.getGetLoadTypeUrl;
const url_getTeamps = window.AppUrls.getTempsUrl;
const url_addTicketsFrmRequester = window.AppUrls.addRequestUrl;
const url_getAssignUrl = window.AppUrls.getAssignUrl;
const url_getVehiclesUrl = window.AppUrls.getVehiclesUrl;
const url_GetTicketsFrmJobNoUrl = window.AppUrls.getTicketsFrmJobNoUrl;
const url_getVehiclesRowIdUrl = window.AppUrls.getVehiclesRowIdUrl;
const url_getCustomerId = window.AppUrls.getCustomerWid;
const url_getVehiclesFrmNameUrl = window.AppUrls.getVehiclesFrmNameUrl;

let status_operation = 1;
// ตัวอย่างการใช้งาน 
const jobNo = getQueryParam("JobNo");
var input = document.getElementById("customers_code");
var carinput = document.getElementById("carname");

$(document).ready(function () {
    initialize();
});

async function initialize() {
    try {
        console.log("Loading master data...");
        await Promise.all([
            wrapWithLogging(getDepartment, "getDepartment"),
            wrapWithLogging(getTemps, "getTemps"),
            wrapWithLogging(getTrucType, "getTrucType"),
            wrapWithLogging(getLoadType, "getLoadType"),
            wrapWithLogging(getAssignUrl, "getAssignUrl")
        ]);
        console.log("Master data loaded successfully.");

        console.log("Calling getRequestFrm...");
        await getRequestFrm();
        console.log("getRequestFrm completed successfully.");
    } catch (error) {
        console.error("Error occurred in initialize:", error);
    }
}

// Helper function for logging
async function wrapWithLogging(fn, fnName) {
    try {
        console.log(`Starting ${fnName}...`);
        await fn();
        console.log(`${fnName} completed successfully.`);
    } catch (error) {
        console.error(`Error in ${fnName}:`, error);
        throw error; // Throw error เพื่อหยุด process
    }
}


carinput.addEventListener("keypress", function (event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
        console.log("Enter");
        // Cancel the default action, if needed
        event.preventDefault();

        const carname = $('#carname').val();
        if (!carname) {
            swal("Warning!", "กรุณากรอกชื่อรถก่อน!", {
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
            getVehicleWhereId(carname);
        }
    }
});


function getVehicleWhereId(carname) {
    console.log(url_getVehiclesFrmNameUrl);
    const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
    const token = tokenElement ? tokenElement.value : null;
    if (!token) {
        console.error("CSRF Token not found.");
        return;
    }

    $.ajax({
        url: url_getVehiclesFrmNameUrl,
        type: "POST",
        contentType: "application/json",
        headers: { "RequestVerificationToken": token },
        data: JSON.stringify({
            VehicleName: carname,
        }),

        success: function (response) {
            console.log("customers", response);
            if (response.status == "success") {
                populateTables(response.data);

                $('#carModal').modal('show');
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

function populateTables(data) {
    const tbody = document.querySelector("#vehicle-table tbody"); // อ้างอิง <tbody>
    let selectedRow = null;

    // ล้างข้อมูลเก่า
    tbody.innerHTML = "";

    // ตรวจสอบข้อมูลก่อนลูป
    if (!Array.isArray(data)) {
        console.error("Data is not an array.");
        return;
    }

    // เพิ่มข้อมูลใหม่ในตาราง
    data.forEach((vehicles, index) => {
        const row = document.createElement("tr");
        row.setAttribute("data-rowid", vehicles.rowId);

        // สร้างเซลล์และเพิ่มข้อมูล
        const cellIndex = document.createElement("td");
        cellIndex.textContent = index + 1;

        const cellvehicleName = document.createElement("td");
        cellvehicleName.textContent = vehicles.vehicleName;

        const cellVehicleLicense = document.createElement("td");
        cellVehicleLicense.textContent = vehicles.vehicleLicense;

        const cellVehicleTypeName = document.createElement("td");
        cellVehicleTypeName.textContent = vehicles.vehicleTypeName;

        // เพิ่มเซลล์ในแถว
        row.appendChild(cellIndex);
        row.appendChild(cellvehicleName);
        row.appendChild(cellVehicleLicense);
        row.appendChild(cellVehicleTypeName);

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
            const vehicleName = selectedRow.children[1].textContent;
            const vehicleLicense = selectedRow.children[2].textContent;
            const vehicleTypeName = selectedRow.children[3].textContent;

            // แสดงข้อมูลที่เลือกใน console.log
            console.log("rowId:", rowId);
            console.log("vehicleName:", vehicleName);
            console.log("vehicleLicense:", vehicleLicense);
            console.log("vehicleTypeName:", vehicleTypeName);

            // เติมค่าในฟิลด์ input
            $('#car_id').val(rowId);
            $('#carname').val(vehicleName);
            $('#carshow').val(vehicleLicense);
            $('#cartype').val(vehicleTypeName);
            // ปิด Modal
            $('#carModal').modal('hide');
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

input.addEventListener("keypress", function (event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
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
            console.log("else ");
            getCustomersWhereId(customers_code);
        }
    }
});

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
                if (response.data.length < 0) {
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
                else {
                    populateTable(response.data);

                    $('#scrollableModal').modal('show');
                }
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


async  function getRequestFrm() {
    console.log("getRequestFrm is called."); // เพิ่ม log นี้
    console.log('getRequestFrm', url_GetTicketsFrmJobNoUrl);
    console.log("JobNo:", jobNo);
    const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
    const token = tokenElement ? tokenElement.value : null;

    if (!token) {
        console.error("CSRF Token not found.");
        return Promise.reject("CSRF Token not found.");
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
            success: function (response) {
                console.log("data getRequestFrm", response);
                if (response) {
                    $('#row_id').val(response.rowId);
                    $('#department_id').val(response.departmentId);
                    $('#trucktype_id').val(response.vehiclesTypeId);
                    $('#temp_id').val(response.tempId);
                    $('#backhual').prop('checked', response.backhual === 1);
                    $('#loading').val(response.loading);
                    $('#eta').val(response.etatostore);
                    $('#typeload_id').val(response.typeloadId);
                    $('#man').val(response.deliveryMan);
                    $('#handjack').prop('checked', response.handjack === 1);
                    $('#cart').prop('checked', response.cart === 1);
                    $('#cardboard').prop('checked', response.cardboard === 1);
                    $('#foam_box').prop('checked', response.foamBox === 1);
                    $('#dry_ice').prop('checked', response.dryIce === 1);
                    $('#comment').val(response.comment);
                    $('#title').val(response.title);

                    if (response.data) {
                        $('#dataTable').DataTable({
                            destroy: true, // ลบ DataTable เดิมก่อนโหลดใหม่
                            data: response.data, // ใช้ response.data ที่ส่งมาจาก API
                            columns: [
                                //{ data: "RowId", title: "No." },
                                {
                                    title: "No.",
                                    data: null,
                                    render: function (data, type, row, meta) {
                                        return meta.row + 1;
                                    }
                                },
                                { data: "rowId", title: "RowId", visible: false },
                                { data: "customerCode", title: "รหัสลูกค้า" },
                                { data: "customerName", title: "ลูกค้า" },
                                { data: "origin", title: "Origin" },
                                { data: "destination", title: "Destination" },
                                {
                                    data: "qty",
                                    title: "QTY",
                                    render: function (data, type, row) {
                                        return `<input type="number" class="form-control qty-input" value="${data}" data-id="${row.customerCode}" />`;
                                    }
                                },
                                {
                                    data: "weight",
                                    title: "Weight",
                                    render: function (data, type, row) {
                                        return `<input type="number" class="form-control weight-input" value="${data}" data-id="${row.customerCode}" />`;
                                    }
                                },
                                {
                                    data: "cbm",
                                    title: "CBM",
                                    render: function (data, type, row) {
                                        return `<input type="number" class="form-control cbm-input" value="${data}" data-id="${row.customerCode}" />`;
                                    }
                                }
                            ]
                        });

                        //// เพิ่ม Event Listener สำหรับ input
                        //$('#dataTable tbody').on('input', '.qty-input, .weight-input, .cbm-input', function () {
                        //    var rowId = $(this).data("id");
                        //    var newValue = $(this).val();
                        //    console.log(`Row ID: ${rowId}, New Value: ${newValue}`);
                        //});

                    } else {
                        console.log("No data available");
                    }

                    if (response.statusOperation == "2") {
                        document.getElementById("card-body").style.display = "none";
                        document.getElementById("approve").style.display = "none";
                        document.getElementById("changejob").removeAttribute("hidden");
                    }
                    else if (response.statusOperation == "3") {
                        document.getElementById("card-body").style.display = "none";
                        document.getElementById("reject").style.display = "none";
                        document.getElementById("approve").style.display = "none";
                    }

                    // เรียก getVehicles() และรอให้เสร็จก่อน resolve
                    getVehicles()
                        .then(resolve)
                        .catch(reject);
                } else {
                    console.warn("No data received from getRequestFrm.");
                    resolve(); // ไม่มี data แต่ยังถือว่า success
                }
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
                reject(error); // reject ในกรณีเกิด error
            }
        });
    });
}


// ดึงค่าจาก URL Query String
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param); // คืนค่าของ parameter ที่ต้องการ

}

async function getVehicles() {
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
                resolve();
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
                reject(error);
            }
        });
    });
}

async  function getAssignUrl() {
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
                resolve();
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
                reject(error);
            }
        });
    });
}

async function getDepartment() {
    const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
    const token = tokenElement ? tokenElement.value : null;
    if (!token) {
        console.error("CSRF Token not found.");
        return;
    }
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url_getDepartments,
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
                resolve(); // สำเร็จ
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
                reject(error); // เกิดข้อผิดพลาด
            }
        });
    });
}

//async  function getCustomers() {
//    console.log('getCustomers', url_getCustomers);
//    const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
//    const token = tokenElement ? tokenElement.value : null;
//    if (!token) {
//        console.error("CSRF Token not found.");
//        return;
//    }
//    return new Promise((resolve, reject) => {
//        $.ajax({
//            url: url_getCustomers, // URL ของ API
//            type: "POST",
//            headers: { "RequestVerificationToken": token },
//            success: function (data) {
//                console.log("data cus", data);

//                // เคลียร์ Option เก่าทั้งหมดใน Select
//                $("#customers_id").empty();

//                // เพิ่ม Option เริ่มต้น
//                $("#customers_id").append('<option value="">-- Select an option --</option>');

//                if (Array.isArray(data) && data.length > 0) {
//                    data.forEach(function (cus) {
//                        $("#customers_id").append(
//                            `<option value="${cus.rowId}">${cus.customerName}</option>`
//                        );
//                    });
//                } else {
//                    // เพิ่ม Option กรณีไม่มีข้อมูล
//                    $("#customers_id").append('<option value="">No options available</option>');
//                }
//            },
//            error: function (xhr, status, error) {
//                console.error("Error:", error);
//            }
//        });
//    });
//}

async function getTrucType() {
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
                resolve();
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
                reject(error);
            }
        });
    });
}

async function getTemps() {
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
                resolve();
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
                reject(error);
            }
        });
    });
}

async function getLoadType() {
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
                resolve();
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
                reject(error);
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

function changejob() { }

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
    const vehiclesId = $('#car_id').val();
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

        const table = $('#dataTable').DataTable(); // ใช้ DataTables API
        const rows = table.rows().nodes(); // ดึงทุกแถวจาก DataTables
        const data = [];
        if (rows.length === 0) {
            swal("Warning!", "กรุณาเพิ่มรายละเอียดงานก่อน", {
                icon: "warning",
                buttons: {
                    confirm: {
                        className: "btn btn-warning",
                    },
                },
            });
            return;
        } else {
           

            // 🔥 แปลง NodeList เป็น Array ก่อนใช้ forEach
            Array.from(rows).forEach((row, index) => {
                const rowData = table.row(index).data(); // ดึงข้อมูลแต่ละแถว

                if (!rowData) return; // ป้องกันกรณี DataTables คืนค่า undefined

                const rowObject = {
                    RowId: rowData.rowId, // ดึงค่าจาก DataTable API
                    Qty: $(row).find('.qty-input').val().trim(), // ดึงค่าจาก input
                    Weight: $(row).find('.weight-input').val().trim(),
                    Cbm: $(row).find('.cbm-input').val().trim()
                };

                data.push(rowObject);
            });

            console.log(JSON.stringify(data, null, 2));
        }



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
            Distance: status_operation === 3 ? null : km || null,
            data: data

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
                Distance: status_operation === 3 ? null : km || null,
                data: data

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


function onChangeCar(selectElement) {
    const selectedValue = selectElement.value; // ค่า value ที่ถูกเลือก
    const selectedText = selectElement.options[selectElement.selectedIndex].text; // ข้อความที่ถูกเลือก

    console.log("Selected Value:", selectedValue);
    //console.log("Selected Text:", selectedText);

    if (selectedValue) {
        getVehicleLicense(selectedValue);
        //console.log(`You selected ${selectedText} with value ${selectedValue}`);
    } else {
        $('#carshow').val("-");
        console.log("No car selected.");
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
    $('#car_id').val('');
    $('#carname').val('');
    $('#carshow').val('');
    $('#cartype').val('');
    $('#driver').val('');
    $('#sub').val('');
    $('#tel').val('');
    $('#cost').val('');
    $('#km').val('');
}