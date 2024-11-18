using System;
using System.Collections.Generic;

namespace BookTruckWeb.Models;

public partial class RoleMenu
{
    public int RowId { get; set; }

    public int? RoleId { get; set; }

    public int? MenuId { get; set; }

    public int? Status { get; set; }
}
