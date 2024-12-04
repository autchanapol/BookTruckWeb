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
    [Route("Departments")]
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
            //var dep = await _context.Departments.ToListAsync(); // ดึงข้อมูลทั้งหมด
            var dep = await _context.Departments
                .Where(deps => deps.Status == 1)
                .Select(deps => new { deps.RowId, deps.DepartmentName, deps.Dpn, deps.Status }).ToListAsync();
            return Ok(dep);
        }

        [HttpPost("GetRoles")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> GetRole()
        {
            var roles = await (from role in _context.Roles
                               where role.Status == 1
                               select new { role.RowId, role.RoleName }).ToArrayAsync();
            return Ok(roles);
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
                        message = "Departments inserted successfully.",
                        DepartmentID = newDepartments.RowId
                    });
                }
                catch (Exception ex)
                {
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
        [HttpPost("UpdateDepartments")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateDepartments([FromBody] Department dep)
        {
            if (dep.RowId == 0)
            {
                return BadRequest("Invalid Row Id.");
            }
            else
            {
                var existingDep = await _context.Departments.FindAsync(dep.RowId);
                if (existingDep == null)
                {
                    return NotFound("Departments not found");
                }

                if (!string.IsNullOrEmpty(dep.DepartmentName))
                {
                    existingDep.DepartmentName = dep.DepartmentName;
                }
                if (!string.IsNullOrEmpty(dep.Dpn))
                {
                    existingDep.Dpn = dep.Dpn;
                }
                if (dep.Status.HasValue)
                {
                    existingDep.Status = dep.Status;
                }

                existingDep.UpdatedDate = DateTime.Now;
                existingDep.UpdatedBy = 1;

                try
                {
                    await _context.SaveChangesAsync();
                    return Ok(new
                    {
                        success = true,
                        message = "Dep updated successfully.",
                        DepartmentID = existingDep.RowId
                    });

                }
                catch (DbUpdateConcurrencyException)
                {
                    return StatusCode(500, "An error occurred during the update.");
                }

            }
        }

    }
}
