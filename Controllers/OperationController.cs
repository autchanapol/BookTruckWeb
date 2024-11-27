using Microsoft.AspNetCore.Mvc;

namespace BookTruckWeb.Controllers
{
    public class OperationController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult BookingRequest()
        {
            return View();
        }
        public IActionResult RequestForm()
        {
            return View();
        }
        public IActionResult ReceivingBooking()
        {
            return View();
        }
        public IActionResult ReceivingBookingForm()
        {
            return View();
        }
    }
}
