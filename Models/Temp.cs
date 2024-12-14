using System;
using System.Collections.Generic;

namespace BookTruckWeb.Models;

public partial class Temp
{
    public int RowId { get; set; }

    public string? TempName { get; set; }

    public int? Status { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }
}
