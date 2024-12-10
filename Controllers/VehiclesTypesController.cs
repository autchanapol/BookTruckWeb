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
    [Route("VehiclesTypes")]
    public class VehiclesTypesController : Controller
    {
        private readonly BookTruckContext _context;

        public VehiclesTypesController(BookTruckContext context)
        {
            _context = context;
        }

        [HttpPost("GetVehiclesTypes")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> GetVehiclesTypes()
        {
            var vehiclesType = await (from vt in _context.VehiclesTypes
                                      where vt.Status == 1
                                      select new
                                      {
                                          vt.RowId,
                                          vt.VehicleTypeName,
                                          vt.Status
                                      }).ToListAsync();
            return Ok(vehiclesType);
        }

        [HttpPost("AddVehiclesTypes")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AddVehiclesTypes([FromBody] VehiclesType vehiclesType)
        {
            if (vehiclesType == null)
            {
                return BadRequest("Invalid Data");
            }
            else
            {
                var newVehiclesType = new VehiclesType()
                {
                    VehicleTypeName = vehiclesType.VehicleTypeName,
                    Status = 1,
                    CreatedBy = 1,
                    CreatedDate = DateTime.Now
                };
                try
                {
                    _context.VehiclesTypes.Add(newVehiclesType);
                    await _context.SaveChangesAsync();
                    var returnData = new
                    {
                        success = true,
                        code = 0,
                        message = "VehiclesType inserted successfully.",
                        typeloadId = newVehiclesType.RowId
                    };
                    return Ok(returnData);

                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal server error: {ex.Message}");
                }
            }
        }

        [HttpPost("EditVehiclesTypes")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> EditVehiclesTypes([FromBody] VehiclesType vehiclesType)
        {
            if (vehiclesType == null)
            {
                return BadRequest("Invalid Data");
            }
            else
            {
                var existingVehiclesType = await _context.VehiclesTypes.FirstOrDefaultAsync(vt => vt.RowId == vehiclesType.RowId && vt.Status == 1);
                if (existingVehiclesType == null)
                {
                    return NotFound("VehiclesTypes not found or status is not active");
                }
                if (!string.IsNullOrEmpty(vehiclesType.VehicleTypeName))
                {
                    existingVehiclesType.VehicleTypeName = vehiclesType.VehicleTypeName;
                }
                if (vehiclesType.Status.HasValue)
                {
                    existingVehiclesType.Status = vehiclesType.Status.Value;
                }
                existingVehiclesType.UpdatedDate = DateTime.Now;
                existingVehiclesType.UpdatedBy = 1;
                try
                {
                    await _context.SaveChangesAsync();
                    return Ok(new
                    {
                        success = true,
                        message = "VehiclesType updated successfully.",
                        typeloadId = existingVehiclesType.RowId
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
