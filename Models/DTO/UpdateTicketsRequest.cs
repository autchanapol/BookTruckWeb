namespace BookTruckWeb.Models.DTO
{
    public class UpdateTicketsRequest
    {
        public string VehiclesId { get; set; }
        public string Driver { get; set; }
        public string Sub { get; set; }
        public string Tel { get; set; }
        public int StatusOperation { get; set; }
        public List<Ticket> Data { get; set; } // ใช้ List<Ticket> สำหรับข้อมูลใน "data"
    }
}
