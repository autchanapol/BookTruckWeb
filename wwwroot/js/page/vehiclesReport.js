var dataTable; // กำหนดตัวแปร Global
const url_getVehicles = yourApp.Urls.editUserUrl;
const url_gettucktype = getvehicleType.Urls.getvehicle_url;
const url_addVehicles = addvehicle.Urls.addvehicle_url;
const url_editVehicles = editvehicle.Urls.editvehicle_url;

$(document).ready(function () {
    // สร้าง DataTable
    dataTable = $("#vehicles-table").DataTable({
        pageLength: 10, // จำนวนแถวต่อหน้า
        ordering: true, // เปิดใช้งานการเรียงลำดับ
        searching: true, // เปิดใช้งานการค้นหา
        lengthChange: true, // อนุญาตให้เปลี่ยนจำนวนแถวต่อหน้า
    });
    getVehicles();
    getVehiclesType();
});

function getVehiclesType() {
    console.log('getVehiclesType', url_gettucktype);
    const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
    const token = tokenElement ? tokenElement.value : null;
    if (!token) {
        console.error("CSRF Token not found.");
        return;
    }
    $.ajax({
        url: url_gettucktype, // URL ของ API
        type: "POST",
        headers: { "RequestVerificationToken": token },
        success: function (data) {
            console.log("data output", data);

            // เคลียร์ Option เก่าทั้งหมดใน Select
            $("#vehicle_type").empty();

            // เพิ่ม Option เริ่มต้น
            $("#vehicle_type").append('<option value="">-- Select an option --</option>');

            if (Array.isArray(data) && data.length > 0) {
                data.forEach(function (type) {
                    $("#vehicle_type").append(
                        `<option value="${type.rowId}">${type.vehicleTypeName}</option>`
                    );
                });
            } else {
                // เพิ่ม Option กรณีไม่มีข้อมูล
                $("#vehicle_type").append('<option value="">No options available</option>');
            }
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
        }
    });
}


function getVehicles() {
    console.log('getVehicles', url_getVehicles);
    const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
    const token = tokenElement ? tokenElement.value : null;
    if (!token) {
        console.error("CSRF Token not found.");
        return;
    }
    $.ajax({
        url: url_getVehicles, // URL ของ API
        type: "POST",
        headers: { "RequestVerificationToken": token },
        success: function (data) {
            console.log("data output", data);

            // ล้างข้อมูลใน DataTable
            dataTable.clear();

            if (Array.isArray(data) && data.length > 0) {
                // เพิ่มข้อมูลใหม่ใน DataTable

                data.forEach(vehicles => {

                    let statusClass = "";
                    switch (vehicles.statusName) {
                        case "Available":
                            statusClass = "badge bg-success"; 
                            break;
                        case "Unavailable":
                            statusClass = "badge bg-danger"; 
                            break;
                    }

                    dataTable.row.add([
                        vehicles.rowId,
                        vehicles.vehicleName,
                        vehicles.vehicleLicense,
                        vehicles.vehicleTypeName,
                        `<span class="${statusClass}">${vehicles.statusName}</span>`
                    ]);
                });

                // อัปเดต DataTable
                dataTable.draw();
            } else {
                // แสดงข้อความเมื่อไม่มีข้อมูล
                dataTable.row.add(["", "No Vehicles found.", "", "", ""]).draw();
            }
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
        }
    });
}

// Click from Table Edir Rows
$("#vehicles-table").on("click", ".btn-primary", function () {
    const rowId = $(this).data("vehicles-id");
    const vehicleName = $(this).data("vehicles-name");
    const vehicleLicense = $(this).data("vehicles-license");
    const vehicleType = $(this).data("vehicles-type");
    const weightempty = $(this).data("vehicles-weightempty");
    const weightcapacity = $(this).data("vehicles-weightcapacity");
    const cubecapacity = $(this).data("vehicles-cubecapacity");
    // เปลี่ยนชื่อ Modal Title
    console.log('vehicleType', vehicleType);
    console.log('rowId', rowId);
    $("#h_name").text("Edit Row");
    $("#rowId").val(rowId);
    $("#vehicle_name").val(vehicleName);
    $("#vehicle_license").val(vehicleLicense);
    $("#vehicle_type").val(vehicleType);
    $("#weight_empty").val(weightempty);
    $("#weight_capacity").val(weightcapacity);
    $("#cube_capacity").val(cubecapacity);
});



