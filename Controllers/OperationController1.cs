using Microsoft.AspNetCore.Mvc;

namespace BookTruckWeb.Controllers
{
    public class OperationController1 : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
