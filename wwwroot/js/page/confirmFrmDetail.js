const url_GetTicketsFrmJobNoUrl = window.AppUrls.getTicketsFrmJobNoUrl;

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
