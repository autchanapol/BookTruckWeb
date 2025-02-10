using Microsoft.AspNetCore.Mvc;

namespace BookTruckWeb.Controllers
{
    public class ReportController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult VehicleStatusReport()
        {
            return View();
        }
    }
}
