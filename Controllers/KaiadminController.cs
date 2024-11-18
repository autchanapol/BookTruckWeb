using Microsoft.AspNetCore.Mvc;

namespace BookTruckWeb.Controllers
{
    public class KaiadminController : Controller
    {
        public IActionResult Index()
        {
            return View(); // ส่ง View แบบปกติ
            //return PartialView(); // ส่ง Partial View แทน
        }
    }
}
