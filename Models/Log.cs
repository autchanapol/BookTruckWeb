using System;
using System.Collections.Generic;

namespace BookTruckWeb.Models;

public partial class Log
{
    public int RowId { get; set; }

    public string? Header { get; set; }

    public string? Mesages { get; set; }

    public int? UserId { get; set; }

    public DateTime? LogDate { get; set; }
}
