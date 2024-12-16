using Microsoft.AspNetCore.Mvc;

namespace BookTruckWeb.Models.DTO
{
    public class MenuViewModel
    {
        public string MenuGroup { get; set; }
        public string MenuName { get; set; }
        public string Controller { get; set; }
        public string Action { get; set; }
        public string Icon { get; set; } // เพิ่มไอคอนสำหรับเมนู
    }
}
