using System;
using System.Collections.Generic;

namespace BookTruckWeb.Models;

public partial class Customer
{
    public int RowId { get; set; }

    public string? CustomerId { get; set; }

    public string? CompanyId { get; set; }

    public string? Name { get; set; }

    public string? Address1 { get; set; }

    public string? Address2 { get; set; }

    public string? Address3 { get; set; }

    public string? City { get; set; }

    public string? State { get; set; }

    public string? Country { get; set; }

    public string? PastalCode { get; set; }

    public int? Active { get; set; }

    public int? Status { get; set; }

    public string? Remarks { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }
}
