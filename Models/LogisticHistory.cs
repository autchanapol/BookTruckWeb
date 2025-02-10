using System;
using System.Collections.Generic;

namespace BookTruckWeb.Models;

public partial class LogisticHistory
{
    public int RowId { get; set; }

    public int? VehicleId { get; set; }

    public string? Remarks { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }
}
