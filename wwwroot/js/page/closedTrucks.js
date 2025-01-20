var dataTable; // กำหนดตัวแปร Global
const url_getTruckData = window.AppUrls.getTruckDataUrl;

$(document).ready(function () {
    // สร้าง DataTable
    dataTable = $("#vehicles-table").DataTable({
        pageLength: 10, // จำนวนแถวต่อหน้า
        ordering: true, // เปิดใช้งานการเรียงลำดับ
        searching: true, // เปิดใช้งานการค้นหา
        lengthChange: true, // อนุญาตให้เปลี่ยนจำนวนแถวต่อหน้า
    });

    getTruckData();

});


function getTruckData() {
    console.log('getTruckData', url_getTruckData);
    const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
    const token = tokenElement ? tokenElement.value : null;
    if (!token) {
        console.error("CSRF Token not found.");
        return;
    }

    $.ajax({
        url: url_getTruckData, // URL ของ API
        type: "POST",
        headers: { "RequestVerificationToken": token },
        contentType: 'application/json',
        success: function (data) {
            console.log("data etTruck", data);
            dataTable.clear();

            if (Array.isArray(data) && data.length > 0) {
                data.forEach(trucks => {
                    dataTable.row.add([
                        `<input type="checkbox" class="form-check-input" data-ticket-id="${ticket.rowId}">`, // เพิ่ม Checkbox ในคอลัมน์แรก
                        trucks.rowId,
                        trucks.vehicleName,
                        trucks.vehicleLicense,
                        trucks.driver,
                        trucks.counnt_Job,
                        `
                        <div class="form-button-action">
                          <button type="button" class="btn btn-success"
                          data-loadtype-id="${trucks.rowId}">
                          ปิดงาน
                          
                          </button>
                        </div>
                        `
                    ]);
                });
            } else {
                // แสดงข้อความเมื่อไม่มีข้อมูล
                dataTable.row.add(["", "", "", "No Trucks found.", "", "", ""]).draw();
            }

            dataTable.draw();
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
        }
    });

}