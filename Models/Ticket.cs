using System;
using System.Collections.Generic;

namespace BookTruckWeb.Models;

public partial class Ticket
{
    public int RowId { get; set; }

    public string JobNo { get; set; } = null!;

    public int? DepartmentId { get; set; }

    public int? CustomerId { get; set; }

    public int? VehiclesTypeId { get; set; }

    public int? Backhual { get; set; }

    public string? Origin { get; set; }

    public DateTime? Loading { get; set; }

    public string? Destination { get; set; }

    public DateTime? Etatostore { get; set; }

    public int? TypeloadId { get; set; }

    public int? TempId { get; set; }

    public decimal? Qty { get; set; }

    public decimal? Weight { get; set; }

    public decimal? Cbm { get; set; }

    public int? DeliveryMan { get; set; }

    public int? Handjack { get; set; }

    public int? Cart { get; set; }

    public int? Cardboard { get; set; }

    public int? FoamBox { get; set; }

    public int? DryIce { get; set; }

    public int? Assign { get; set; }

    public string? Comment { get; set; }

    public int? VehiclesId { get; set; }

    public string? Driver { get; set; }

    public string? Sub { get; set; }

    public string? Tel { get; set; }

    public decimal? TravelCosts { get; set; }

    public decimal? Distance { get; set; }

    public int? StatusOperation { get; set; }

    public int? Status { get; set; }

    public int? ReqestedBy { get; set; }

    public int? ReceivedBy { get; set; }

    public DateTime? ReceivedDate { get; set; }

    public int? ActionBy { get; set; }

    public DateTime? ActionDate { get; set; }

    public int? ConfirmedBy { get; set; }

    public DateTime? ConfirmedDate { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? LastUpdated { get; set; }
}
