const url_getRequest = window.AppUrls.getRequestDataUrl;
var dataTable; // กำหนดตัวแปร Global


$(document).ready(function () {
    // สร้าง DataTable
    dataTable = $("#basic-datatables").DataTable({
        pageLength: 10, // จำนวนแถวต่อหน้า
        ordering: true, // เปิดใช้งานการเรียงลำดับ
        searching: true, // เปิดใช้งานการค้นหา
        lengthChange: true, // อนุญาตให้เปลี่ยนจำนวนแถวต่อหน้า
    });

    getRequestData();
  
});


function getRequestData() {
    console.log('getRequestData', url_getRequest);
    const start_date = $('#start_date').val();
    const end_date = $('#end_date').val();
    const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
    const token = tokenElement ? tokenElement.value : null;
    if (!token) {
        console.error("CSRF Token not found.");
        return;
    }
    console.log('start_date', start_date);
    console.log('end_date', end_date);
    console.log('Json',  JSON.stringify({
        startData: moment(start_date).format("YYYY-MM-DDTHH:mm:ss"),
        endData: moment(end_date).format("YYYY-MM-DDTHH:mm:ss")
    }));
    $.ajax({
        url: url_getRequest, // URL ของ API
        type: "POST",
        headers: { "RequestVerificationToken": token },
        contentType: 'application/json',
        data: JSON.stringify({
            startData: start_date,
            endData: end_date
        }),
        success: function (data) {
            console.log("data request", data);

            // ล้างข้อมูลใน DataTable
            dataTable.clear();

            // กำหนด Class สำหรับ statusName ตามเงื่อนไข
           

            if (Array.isArray(data) && data.length > 0) {
                // เพิ่มข้อมูลใหม่ใน DataTable
                data.forEach(ticket => {

                    let statusClass = "";
                    switch (ticket.statusName) {
                        case "Waiting":
                            statusClass = "badge bg-warning"; // สีเหลือง
                            break;
                        case "Received":
                            statusClass = "badge bg-success"; // สีเขียว
                            break;
                        case "Rejected":
                            statusClass = "badge bg-danger"; // สีแดง
                            break;
                        default:
                            statusClass = "badge bg-secondary"; // สีเทา
                            break;
                    }

                    dataTable.row.add([
                        ticket.rowId,
                        ticket.jobNo,
                        ticket.customerName,
                        ticket.loading,
                        `<span class="${statusClass}">${ticket.statusName}</span>`, // เพิ่ม Class สำหรับสี
                        ticket.assignName,
                        `
                        <div class="form-button-action">
                            <button type="button" class="btn btn-link btn-primary btn-lg"
                                    data-bs-toggle="modal" data-bs-target="#addRowModal"
                                    data-temps-id="${ticket.rowId}">
                                <i class="fa fa-edit"></i>
                            </button>
                            
                        </div>
                        `
                    ]);
                });
                //<button type="button" class="btn btn-link btn-danger"
                //    data-temps-id="${temps.rowId}">
                //    <i class="fa fa-times"></i>
                //</button>
                // อัปเดต DataTable
                dataTable.draw();
            } else {
                // แสดงข้อความเมื่อไม่มีข้อมูล
                dataTable.row.add(["","","", "No Requests found.", "", "",""]).draw();
            }
           
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
        }
    });
}

