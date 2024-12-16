using System;
using System.Collections.Generic;

namespace BookTruckWeb.Models;

public partial class Vehicle
{
    public int RowId { get; set; }

    public string? VehicleLicense { get; set; }

    public string? VehicleName { get; set; }

    public int? VehicleType { get; set; }

    public decimal? WeightEmpty { get; set; }

    public decimal? WeightCapacity { get; set; }

    public decimal? CubeCapacity { get; set; }

    public int? Status { get; set; }

    public int? Active { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }
}
