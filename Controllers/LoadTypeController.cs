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
    [Route("LoadType")]
    public class LoadTypeController : Controller
    {
        private readonly BookTruckContext _context;
        public LoadTypeController(BookTruckContext context)
        {
            _context = context;
        }

        [HttpPost("GetLoadType")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> GetLoadType()
        {
            var load = await (from loadtpye in _context.TypeLoads
                              where loadtpye.Status == 1
                              select new
                              {
                                  loadtpye.RowId,
                                  loadtpye.LoadName,
                                  loadtpye.Status
                              }).ToListAsync();
            return Ok(load);
        }

        [HttpPost("InsertLoadType")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> InsertLoadType([FromBody] TypeLoad load)
        {
            if (load == null)
            {
                return BadRequest("Invalid Data.");
            }
            else
            {
                var newLoadType = new TypeLoad()
                {
                    LoadName = load.LoadName,
                    Status = 1,
                    CreatedBy = 1,
                    CreatedDate = DateTime.Now
                };
                try
                {
                    _context.TypeLoads.Add(newLoadType);
                    await _context.SaveChangesAsync();
                    var returnData = new
                    {
                        status = true,
                        code = 0,
                        message = "TypeLoads inserted successfully.",
                        typeloadId = newLoadType.RowId
                    };
                    return Ok(returnData);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal server error: {ex.Message}");
                }
            }
        }

        [HttpPost("UpdateLoadType")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateLoadType([FromBody] TypeLoad load)
        {
            if (load == null)
            {
                return BadRequest("Invalid Data");
            }
            else
            {
                var existingLoadType = await _context.TypeLoads.FirstOrDefaultAsync(loadType => loadType.RowId == load.RowId && loadType.Status == 1);
                if (existingLoadType == null)
                {
                    return NotFound("LoadType not found or status is not active");
                }
                if (!string.IsNullOrEmpty(load.LoadName))
                {
                    existingLoadType.LoadName = load.LoadName;
                }
                if (load.Status.HasValue) {
                    existingLoadType.Status = load.Status.Value;
                }
                existingLoadType.UpdatedDate = DateTime.Now;
                existingLoadType.UpdatedBy = 1;
                try
                {
                    await _context.SaveChangesAsync();
                    return Ok(new
                    {
                        status = true,
                        message = "LoadType updated successfully.",
                        UserId = existingLoadType.RowId
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
