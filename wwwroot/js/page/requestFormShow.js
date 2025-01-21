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
            success: function (data) {
                console.log("data getRequestFrm", data);
                if (data) {
                    $('#row_id').val(data.rowId);
                    $('#department_id').val(data.departmentName);
                    $('#customers_id').val(data.customerCode);
                    $('#customer_row').val(data.customerId);
                    $('#customers_name').val(data.customerName);
                    $('#trucktype_id').val(data.vehicleTypeName);
                    $('#temp_id').val(data.tempName);
                    $('#backhual').prop('checked', data.backhual === 1);
                    $('#origin').val(data.origin);
                    $('#loading').val(data.loading);
                    $('#destination').val(data.destination);
                    $('#eta').val(data.etatostore);
                    $('#typeload_id').val(data.loadName);
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
                    $('#assign').val(data.assignName);
                    $('#carName').val(data.vehicleName);
                    $('#carshow').val(data.vehicleLicense);
                    $('#sub').val(data.sub);
                    $('#driver').val(data.driver);
                    $('#tel').val(data.tel);
                    $('#cost').val(data.travelCosts);
                    $('#km').val(data.distance);
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
