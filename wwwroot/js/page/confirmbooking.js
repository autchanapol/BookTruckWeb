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

    window.addEventListener("pageshow", function (event) {
        if (event.persisted || performance.navigation.type === 2) {
            getRequestData(); // เรียกใช้ฟังก์ชันอีกครั้งเมื่อย้อนกลับมา
        }
    });

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
    console.log('Json', JSON.stringify({
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
                        case "New Request":
                            statusClass = "badge bg-secondary"; // สีเหลือง
                            break;
                        case "Waiting":
                            statusClass = "badge bg-yellow"; // สีเหลือง
                            break;
                        case "Approved":
                            statusClass = "badge bg-success"; // สีเขียว
                            break;
                        case "Rejected":
                            statusClass = "badge bg-danger"; // สีส้มกำหนดเอง
                            break;
                        case "Closed":
                            statusClass = "badge bg-warning"; // สีแดง
                            break;
                        default:
                            statusClass = "badge bg-secondary"; // สีเทา
                            break;
                    }

                    dataTable.row.add([
                        ticket.rowId,
                        ticket.jobNo,
                        ticket.customerName,
                        ticket.createdDate,
                        `<span class="${statusClass}">${ticket.statusName}</span>`, // เพิ่ม Class สำหรับสี
                        ticket.requestFrom,
                        ticket.assignName,
                        `
                        <!-- ปุ่ม Check -->
                        <div class="form-button-action">
                         <button type="button" class="btn btn-link btn-primary btn-lg"
                                    data-ticket-id="${ticket.rowId}" 
                                    data-ticket-jobno="${ticket.jobNo}" 
                                    >
                                <i class="fa fa-check"></i>
                            </button>
                            <!-- ปุ่ม Edit -->
                            <button type="button" class="btn btn-link btn-success btn-lg"
                                onclick="redirectToConfrimBookingForm('${ticket.jobNo}')">
                                <i class="bi bi-clipboard-check-fill"></i>
                            </button>
                        </div>
                        `
                    ]);
                });

                // อัปเดต DataTable
                dataTable.draw();
            } else {
                // แสดงข้อความเมื่อไม่มีข้อมูล
                dataTable.row.add(["", "", "", "No Requests found.", "", "", "", ""]).draw();
            }

        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
        }
    });
}

$("#basic-datatables").on("click", ".btn-primary", function () {
    const ticketid = $(this).data("ticket-id");
    const jobno = $(this).data("ticket-jobno");
    const token = document.querySelector('input[name="__RequestVerificationToken"]').value; // ดึง CSRF Token
    console.log(ticketid);
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
            swal({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
            });
        }
    });
});

function redirectToConfrimBookingForm(jobNo) {
    if (!jobNo || jobNo.trim() === "") {
        console.error("JobNo is invalid.");
        return;
    }
    const url = `${confrimBookingUrl}?JobNo=${encodeURIComponent(jobNo)}`;
    console.log("Redirecting to:", url);
    window.location.href = url;
}
