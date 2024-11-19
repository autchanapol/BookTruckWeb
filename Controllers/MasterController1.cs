using Microsoft.AspNetCore.Mvc;

namespace BookTruckWeb.Controllers
{
    public class MasterController1 : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult Customers()
        {
            return View();
        }
    }  
}
