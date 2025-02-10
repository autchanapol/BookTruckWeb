using System;
using System.Collections.Generic;

namespace BookTruckWeb.Models;

public partial class TicketsDetail
{
    public int RowId { get; set; }

    public string? JobNo { get; set; }

    public int? CustomerId { get; set; }

    public string? Origin { get; set; }

    public string? Destination { get; set; }

    public decimal? Qty { get; set; }

    public decimal? Weight { get; set; }

    public decimal? Cbm { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? LastUpdated { get; set; }
}
