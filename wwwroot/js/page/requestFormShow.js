const url_GetTicketsFrmJobNoUrl = window.AppUrls.getTicketsFrmJobNoUrl;
const url_setConfirmUrl = window.AppUrls.setConfirmUrl;

let status_operation = 1;
// ตัวอย่างการใช้งาน 
const jobNo = getQueryParam("JobNo");


$(document).ready(function () {
    initialize();
});


async function initialize() {
    try {
        await Promise.all([
            getRequestFrm()
        ]);
        //await getVehicles();
        console.log("All functions completed successfully.");
    } catch (error) {
        console.error("Error occurred:", error);
    }
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param); // คืนค่าของ parameter ที่ต้องการ

}

function saveConfirm() {
    const url = new URL(window.location.href);
    const row_id = $('#row_id').val();
    const jobno = url.searchParams.get("JobNo");
    swal({
        title: "Are you sure?",
        text: ` คุณต้องการยืนยันเลขงานที่ ${jobno} clicked!`,
        icon: "warning",
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
    }).then((result) => {
        if (result) {
            conformTikget(jobno, row_id);
        }
    });
}

function conformTikget(jobNo, ticketid) {
    console.log(url_setConfirmUrl);
    const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
    const token = tokenElement ? tokenElement.value : null;
    if (!token) {
        console.error("CSRF Token not found.");
        return;
    }
    if (!jobNo || jobNo.trim() === "" && !ticketid || ticketid === 0) {
        console.error("JobNo is invalid.");
        return;
    }
    else {
        $.ajax({
            url: url_setConfirmUrl, // URL ของ API
            type: "POST",
            headers: { "RequestVerificationToken": token },
            contentType: "application/json",
            data: JSON.stringify({
                RowId: ticketid,
                JobNo: jobNo,
                StatusOperation: 1
            }),
            success: function (data) {
                console.log("data assign", data);

                if (data.success) {
                    console.log("Success:", data.message); // แสดงข้อความจาก API
                    document.getElementById("confirmButton").style.display = "none";
                    swal("Successfully!", data.message + " Job No." + jobNo, {
                        icon: "success",
                        buttons: {
                            confirm: {
                                className: "btn btn-success",
                            },
                        },
                    });


                } else {
                    swal({
                        title: "Error!",
                        text: data.message,
                        icon: "error"
                    });
                    console.log("Failed:", data.message);
                }

            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
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
            success: function (response) {
                console.log("data getRequestFrm", response);
                if (response) {
                    $('#row_id').val(response.rowId);
                    $('#department_id').val(response.departmentName);
                    $('#trucktype_id').val(response.vehicleTypeName);
                    $('#temp_id').val(response.tempName);
                    $('#backhual').prop('checked', response.backhual === 1);
                    $('#loading').val(response.loading);
                    $('#eta').val(response.etatostore);
                    $('#typeload_id').val(response.loadName);
                    $('#man').val(response.deliveryMan);
                    $('#handjack').prop('checked', response.handjack === 1);
                    $('#cart').prop('checked', response.cart === 1);
                    $('#cardboard').prop('checked', response.cardboard === 1);
                    $('#foam_box').prop('checked', response.foamBox === 1);
                    $('#dry_ice').prop('checked', response.dryIce === 1);
                    $('#comment').val(response.comment);
                    $('#assign').val(response.assignName);
                    $('#carName').val(response.vehicleName);
                    $('#carshow').val(response.vehicleLicense);
                    $('#sub').val(response.sub);
                    $('#driver').val(response.driver);
                    $('#tel').val(response.tel);
                    $('#cost').val(response.travelCosts);
                    $('#km').val(response.distance);
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
                                { data: "customerCode", title: "รหัสลูกค้า" },
                                { data: "customerName", title: "ลูกค้า" },
                                { data: "origin", title: "Origin" },
                                { data: "destination", title: "Destination" },
                                { data: "qty", title: "QTY" },
                                { data: "weight", title: "Weight" },
                                { data: "cbm", title: "CBM" }
                            ]
                        });
                    } else {
                        console.log("No data available");
                    }


                }
                else {
                    console.log("No data available");
                }

            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
            }
        });
    });
}
