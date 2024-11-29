

const basePath = window.location.pathname.split("/").slice(1, 2).join("/"); // ดึง "app"

var url = yourApp.Urls.editUserUrl;

getDepartments();
function getDepartments() {
    const token = document.querySelector('input[name="__RequestVerificationToken"]').value; // ดึง CSRF Token
    console.log("url", url)
    $.ajax({
        url: url,
        type: "POST",
        headers: { "RequestVerificationToken": token },
        success: function (data) {
            console.log("data output", data);
            $("#departmentsTable tbody").empty();
            if (data !== null && data.length > 0) {
    
                //  เพิ่มข้อมูลใหม่ลงใน Table
                data.forEach(department => {
                    $("#departmentsTable tbody").append(
                        `
                        <tr>
                          <td>${department.rowId}</td>
                          <td>${department.departmentName}</td>
                           <td>
                                    <div class="form-button-action">
                                        <button type="button"
                                                data-bs-toggle="tooltip"
                                                title=""
                                                class="btn btn-link btn-primary btn-lg"
                                                data-original-title="Edit Task">
                                            <i class="fa fa-edit"></i>
                                        </button>
                                        <button type="button"
                                                data-bs-toggle="tooltip"
                                                title=""
                                                class="btn btn-link btn-danger"
                                                data-original-title="Remove">
                                            <i class="fa fa-times"></i>
                                        </button>
                                    </div>
                                </td>
                        </tr>
                        `
                    )
                });
            }
            else {
                // ไม่มีข้อมูล
                $("#departmentsTable tbody").empty().append(
                    `<tr><td colspan="2">No departments found.</td></tr>`
                );
            }
         
          
           
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
        }
    });
}




$(document).ready(function () {
    $("#departmentsTable").DataTable({});

    $("#multi-filter-select").DataTable({
        pageLength: 5,
        initComplete: function () {
            this.api()
                .columns()
                .every(function () {
                    var column = this;
                    var select = $(
                        '<select class="form-select"><option value=""></option></select>'
                    )
                        .appendTo($(column.footer()).empty())
                        .on("change", function () {
                            var val = $.fn.dataTable.util.escapeRegex($(this).val());

                            column
                                .search(val ? "^" + val + "$" : "", true, false)
                                .draw();
                        });

                    column
                        .data()
                        .unique()
                        .sort()
                        .each(function (d, j) {
                            select.append(
                                '<option value="' + d + '">' + d + "</option>"
                            );
                        });
                });
        },
    });

    // Add Row
    //$("#add-row").DataTable({
    //    pageLength: 5,
    //});

    //var action =
    //    '<td> <div class="form-button-action"> <button type="button" data-bs-toggle="tooltip" title="" class="btn btn-link btn-primary btn-lg" data-original-title="Edit Task"> <i class="fa fa-edit"></i> </button> <button type="button" data-bs-toggle="tooltip" title="" class="btn btn-link btn-danger" data-original-title="Remove"> <i class="fa fa-times"></i> </button> </div> </td>';

    //$("#addRowButton").click(function () {
    //    $("#add-row")
    //        .dataTable()
    //        .fnAddData([
    //            $("#addName").val(),
    //            $("#addPosition").val(),
    //            $("#addOffice").val(),
    //            action,
    //        ]);
    //    $("#addRowModal").modal("hide");
    //});
});