using System;
using System.Collections.Generic;

namespace BookTruckWeb.Models;

public partial class Role
{
    public int RowId { get; set; }

    public string? RoleName { get; set; }

    public int? Status { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }
}
