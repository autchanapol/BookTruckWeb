using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using BookTruckWeb.Models;
using BookTruckWeb.connect;
using System.Text.Json;

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

        [HttpPost("InsertDepartments")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> InsertDepartments([FromBody] Department dep)
        {
          
            if (dep != null)
            {
                var newDepartments = new Department
                {
                    DepartmentName = dep.DepartmentName,
                    Dpn = dep.Dpn,
                    Status = 1,
                    Status1 = 1,
                    CreatedDate = DateTime.Now,
                    CreatedBy = 1
                };

                try
                {
                    _context.Departments.Add(newDepartments);
                    await _context.SaveChangesAsync();
                    return Ok(new
                    {
                        success = true,
                        message = "Departments  inserted successfully.",
                        DepartmentID = newDepartments.RowId
                    });
                }
                catch (Exception ex) {
                    return StatusCode(500, $"Internal server error: {ex.Message}");
                }
            }
            else
            {
                var returnJson = new
                {
                    status = false,
                    code = -1,
                    message = "No Data Input"
                };
                return Ok(returnJson);
            }

         
        }

    }
}
