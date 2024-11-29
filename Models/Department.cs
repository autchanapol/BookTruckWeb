using System;
using System.Collections.Generic;

namespace BookTruckWeb.Models;

public partial class Department
{
    public int RowId { get; set; }

    public string? DepartmentName { get; set; }

    public string? Dpn { get; set; }

    public int? Status { get; set; }

    public int? Status1 { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }
}
