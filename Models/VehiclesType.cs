using System;
using System.Collections.Generic;

namespace BookTruckWeb.Models;

public partial class VehiclesType
{
    public int RowId { get; set; }

    public string? VehicleTypeName { get; set; }

    public int? Status { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }
}
