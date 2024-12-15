using Microsoft.AspNetCore.Mvc;

namespace BookTruckWeb.Controllers
{
    public class LoginController : Controller
    {
        public IActionResult Index()
        {

            // ตรวจสอบว่ามีการ Login อยู่หรือไม่
            if (!string.IsNullOrEmpty(HttpContext.Session.GetString("RowId")))
            {
                // Redirect ผู้ใช้ไปยังหน้าหลักหากยัง Login อยู่
                return RedirectToAction("Index", "Home"); // หรือเปลี่ยนเป็นหน้าที่เหมาะสม
            }

            // หากยังไม่ได้ Login ให้แสดงหน้า Login
            return View();
        }
    }
}
