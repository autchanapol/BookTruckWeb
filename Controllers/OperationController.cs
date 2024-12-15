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
            //if (string.IsNullOrEmpty(HttpContext.Session.GetString("RowId")))
            //{
            //    return RedirectToAction("Index", "Login"); // กลับไปหน้า Login
            //}
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
