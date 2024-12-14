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
    [Route("Tamps")]
    public class TampsController : Controller
    {
        private readonly BookTruckContext _context;

        public TampsController(BookTruckContext context)
        {
            _context = context;
        }

        [HttpPost("GetTemps")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> GetTemps()
        {
            var temp = await (from temps in _context.Temps
                              where temps.Status == 1
                              select new
                              {
                                  temps.RowId,
                                  temps.TempName,
                                  temps.Status
                              }).ToListAsync();
            return Ok(temp);
        }

        [HttpPost("AddTemps")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AddTemps([FromBody] Temp temps)
        {
            if (temps == null)
            {
                return BadRequest("Invalid Data");
            }
            else
            {
                var newTemps = new Temp
                {
                    TempName = temps.TempName,
                    Status = 1,
                    CreatedBy = 1,
                    CreatedDate = DateTime.Now
                };
                try
                {
                    _context.Temps.Add(newTemps);
                    await _context.SaveChangesAsync();
                    var returnData = new
                    {
                        status = true,
                        code = 0,
                        message = "Temps inserted successfully.",
                        rowid = newTemps.RowId
                    };
                    return Ok(returnData);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal server error: {ex.Message}");
                }
            }
        }

        [HttpPost("EditTemps")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> EditTemps([FromBody] Temp temps)
        {
            if (temps == null)
            {
                return BadRequest("Invalid Data");
            }
            else
            {
                var existingTemps = await _context.Temps.FirstOrDefaultAsync(te => te.RowId == temps.RowId && te.Status == 1);

                if (existingTemps == null)
                {
                    return NotFound("Temps not found or status is not active");
                }
                else
                {
                    if (!string.IsNullOrEmpty(temps.TempName))
                    {
                        existingTemps.TempName = temps.TempName;
                    } 
                    if(temps.Status.HasValue)
                    {
                        existingTemps.Status = temps.Status.Value;
                    }
                    existingTemps.UpdatedBy = 1;
                    existingTemps.UpdatedDate = DateTime.Now;
                    try
                    {
                        await _context.SaveChangesAsync();
                        return Ok(new
                        {
                            status = true,
                            message = "Temps updated successfully.",
                            rowid = existingTemps.RowId
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
}
