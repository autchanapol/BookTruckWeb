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
                    dataTable.row.add([
                        vehicles.rowId,
                        vehicles.vehicleName,
                        vehicles.vehicleLicense,
                        vehicles.vehicleTypeName,
                        `
                        <div class="form-button-action">
                            <button type="button" class="btn btn-link btn-primary btn-lg"
                                    data-bs-toggle="modal" data-bs-target="#addRowModal"
                                    data-vehicles-id="${vehicles.rowId}"
                                    data-vehicles-name="${vehicles.vehicleName}"
                                    data-vehicles-license="${vehicles.vehicleLicense}"
                                    data-vehicles-type="${vehicles.vehicleType}"
                                    data-vehicles-weightempty="${vehicles.weightEmpty}"
                                    data-vehicles-weightcapacity="${vehicles.weightCapacity}"
                                    data-vehicles-cubecapacity="${vehicles.cubeCapacity}"
                                    >
                                <i class="fa fa-edit"></i>
                            </button>
                            <button type="button" class="btn btn-link btn-danger"
                                    data-vehicles-id="${vehicles.rowId}">
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
    console.log('vehicleType',vehicleType);
    console.log('rowId',rowId);
    $("#h_name").text("Edit Row");
    $("#rowId").val(rowId);
    $("#vehicle_name").val(vehicleName);
    $("#vehicle_license").val(vehicleLicense);
    $("#vehicle_type").val(vehicleType);
    $("#weight_empty").val(weightempty);
    $("#weight_capacity").val(weightcapacity);
    $("#cube_capacity").val(cubecapacity);
});


$("#vehicles-table").on("click", ".btn-danger", function () {
    const rowId = $(this).data("vehicles-id");
    const token = document.querySelector('input[name="__RequestVerificationToken"]').value; // ดึง CSRF Token
    console.log('RowId', rowId);
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
                url: url_editVehicles,
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
                            getVehicles();
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

$('#addRowModal').on('show.bs.modal', function () {
    // ล้างค่า Input ทุกช่องใน Modal
    $("#rowId").val('');
    $("#vehicle_name").val('');
    $("#vehicle_license").val('');
    $("#vehicle_type").val('');
    $("#weight_empty").val('');
    $("#weight_capacity").val('');
    $("#cube_capacity").val('');
});

function saveVehicles() {
    console.log('save', url_addVehicles);
    const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
    const token = tokenElement ? tokenElement.value : null;
    if (!token) {
        console.error("CSRF Token not found.");
        return;
    }
    const rowId = $('#rowId').val();
    const vehicle_name = $('#vehicle_name').val();
    const vehicle_license = $('#vehicle_license').val();
    const vehicle_type = $('#vehicle_type').val();
    const weight_empty = $('#weight_empty').val();
    const weight_capacity = $('#weight_capacity').val();
    const cube_capacity = $('#cube_capacity').val();

    if (!vehicle_name) {
        swal("Warning!", "Please input Vehicle Name!", {
            icon: "warning",
            buttons: {
                confirm: {
                    className: "btn btn-warning",
                },
            },
        });
        return;
    }
    else if (!vehicle_license) {
        swal("Warning!", "Please input License!", {
            icon: "warning",
            buttons: {
                confirm: {
                    className: "btn btn-warning",
                },
            },
        });
        return;
    }
    else if (!vehicle_type || vehicle_type == 0)
    {
        swal("Warning!", "Please Select Car Type!", {
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
                url: url_addVehicles,
                type: "POST",
                headers: { "RequestVerificationToken": token },
                contentType: "application/json",
                data: JSON.stringify({
                    VehicleName: vehicle_name,
                    VehicleLicense: vehicle_license,
                    Status: 1,
                    VehicleType: vehicle_type,
                    WeightCapacity: weight_capacity,
                    WeightEmpty: weight_empty,
                    CubeCapacity: cube_capacity
                }),
                success: function (data) {
                    console.log("data output", data);
                    if (data !== null && typeof data == 'object') {
                        if (data.status) {
                            successClick(data.message);
                            getVehicles();
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
                RowId: rowId,
                VehicleName: vehicle_name,
                VehicleLicense: vehicle_license,
                VehicleType: vehicle_type,
                WeightCapacity: weight_capacity,
                WeightEmpty: weight_empty,
                CubeCapacity: cube_capacity
            }))
            $.ajax({
                url: url_editVehicles,
                type: "POST",
                headers: { "RequestVerificationToken": token },
                contentType: "application/json",
                data: JSON.stringify({
                    RowId: rowId,
                    VehicleName: vehicle_name,
                    VehicleLicense: vehicle_license,
                    VehicleType: vehicle_type,
                    WeightCapacity: weight_capacity,
                    WeightEmpty: weight_empty,
                    CubeCapacity: cube_capacity
                }),
                success: function (data) {
                    console.log("data output", data);
                    if (data !== null && typeof data == 'object') {
                        if (data.status) {
                            successClick(data.message);
                            getVehicles();
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
