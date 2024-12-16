using Microsoft.AspNetCore.Mvc;
using BookTruckWeb.Models.DTO;

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
        public IActionResult RequestFormShow(string jobNo)
        {
            var viewModel = new ReceivingBookingViewModel
            {
                JobNo = jobNo,
            };

            return View(viewModel);
        }
        public IActionResult ReceivingBooking()
        {

            return View();
        }
        public IActionResult ReceivingBookingForm(string jobNo)
        {
            // ตัวอย่างการดึงข้อมูล (เช่นจากฐานข้อมูล)
            //var bookingName = "Sample Booking"; // จำลองข้อมูล
            var viewModel = new ReceivingBookingViewModel
            {
                JobNo = jobNo,
            };

            return View(viewModel);
        }
    }
}
