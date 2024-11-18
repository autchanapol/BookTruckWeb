using System;
using System.Collections.Generic;

namespace BookTruckWeb.Models;

public partial class User
{
    public int RowId { get; set; }

    public string? IdEmployee { get; set; }

    public string? Username { get; set; }

    public string? Password { get; set; }

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public string? Email { get; set; }

    public int? DepartmentId { get; set; }

    public string? Phone { get; set; }

    public string? Image { get; set; }

    public int? RoleId { get; set; }

    public int? Status { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }
}
