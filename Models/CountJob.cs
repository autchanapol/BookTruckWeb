using System;
using System.Collections.Generic;

namespace BookTruckWeb.Models;

public partial class CountJob
{
    public int RowId { get; set; }

    public string? Job { get; set; }

    public string Year { get; set; } = null!;

    public string Month { get; set; } = null!;

    public int? Lastnumber { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? LastUpdate { get; set; }
}
