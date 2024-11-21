using Microsoft.AspNetCore.Mvc;

namespace BookTruckWeb.Controllers
{
    public class AdminController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult Departments()
        {
            return View();
        }
        public IActionResult Roles()
        {
            return View();
        }
        public IActionResult Users()
        {
            return View();
        }
    }
}
