using System.ComponentModel.DataAnnotations.Schema;

namespace BookTruckWeb.Models.DTO
{
    public class JobResult
    {
        [Column("job_number")] // แมปกับชื่อคอลัมน์ในฐานข้อมูล
        public string JobNumber { get; set; }
    }
}
