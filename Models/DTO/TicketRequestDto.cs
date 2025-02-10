namespace BookTruckWeb.Models.DTO
{
    public class TicketRequestDto
    {
        public int? RowId { get; set; }
        public string? Title { get; set; }
        public string JobNo { get; set; }
        public int DepartmentId { get; set; }
        public int VehiclesTypeId { get; set; }
        public int? TempId { get; set; }
        public int? Backhual { get; set; }
        public DateTime Loading { get; set; }
        public DateTime Etatostore { get; set; }
        public int TypeloadId { get; set; }
        public int? DeliveryMan { get; set; }
        public int? Handjack { get; set; }
        public int? Cart { get; set; }
        public int? Cardboard { get; set; }
        public int? FoamBox { get; set; }
        public int? DryIce { get; set; }
        public string Comment { get; set; }
        public int StatusOperation { get; set; }
        public int? Assign { get; set; }
        public int? VehiclesId { get; set; }
        public string? Driver { get; set; }
        public string? Sub { get; set; }
        public string? Tel { get; set; }
        public decimal? TravelCosts { get; set; }
        public decimal? Distance { get; set; }
        public List<TicketsDetail> Data { get; set; } // รายการของ Model อื่น
    }
}
