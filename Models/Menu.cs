using System;
using System.Collections.Generic;

namespace BookTruckWeb.Models;

public partial class Menu
{
    public int RowId { get; set; }

    public string? MenuName { get; set; }

    public string? MenuGroup { get; set; }

    public int? Status { get; set; }
}
