using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace BookTruckWeb.Controllers
{
    public class MasterController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult Customers()
        {
            return View();
        }

        public IActionResult TruckType()
        {
            return View();
        }

        public IActionResult LoadType()
        {
            return View();
        }
        public IActionResult Vehicles()
        {
            return View();
        }

    }  
}
