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
    [Route("Roles")]
    public class RolesController : Controller
    {
        private readonly BookTruckContext _context;

        public RolesController(BookTruckContext context)
        {
            _context = context;
        }

        [HttpPost("GetRoles")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> GetRoles()
        {
            try
            {
                Console.WriteLine("GetRoles function called"); // ตรวจสอบว่าเข้ามาในฟังก์ชันหรือไม่
                var roles = await (from role in _context.Roles
                                   where role.Status == 1
                                   select new { role.RowId, role.RoleName }).ToArrayAsync();

                if (!roles.Any())
                {
                    return NotFound("No roles found.");
                }

                return Ok(roles);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetRoles: {ex.Message}");
                return StatusCode(500, "Internal server error.");
            }
        }




    }
}
