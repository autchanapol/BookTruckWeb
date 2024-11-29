using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using BookTruckWeb.Models;
using BookTruckWeb.connect;

namespace BookTruckWeb.Controllers
{
    public class DepartmentsController : Controller
    {
        private readonly BookTruckContext _context;

        public DepartmentsController(BookTruckContext context)
        {
            _context = context;
        }


        [HttpPost("GetDepartments")] // ใช้ POST เพื่อรองรับ Anti-Forgery Token
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> GetDepartments()
        {
            var dep = await _context.Departments.ToListAsync(); // ดึงข้อมูลทั้งหมด

            return Ok(dep);
        }

    }
}
