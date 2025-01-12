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
    [Route("Vehicles")]
    public class VehiclesController : Controller
    {
        private readonly BookTruckContext _context;

        public VehiclesController(BookTruckContext context)
        {
            _context = context;
        }

        [HttpPost("GetVehiclesFrmTicket")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> GetVehiclesFrmTicket()
        {
            var vehicles = await (from ve in _context.Vehicles
                                  join tic in _context.Tickets on ve.RowId equals tic.VehiclesId
                                  where ve.Active == 1 && ve.Status == 1
                                  group tic by new { ve.RowId, ve.VehicleLicense, ve.VehicleName, tic.Driver } into g
                                  select new
                                  {
                                      g.Key.RowId,
                                      g.Key.Driver,
                                      g.Key.VehicleLicense,
                                      g.Key.VehicleName,
                                      Counnt_Job = g.Count()
                                  })
                                  //.Distinct()
                                  .ToListAsync();
            return Ok(vehicles);
        }


        [HttpPost("GetVehicles")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> GetVehicles()
        {
            var vehicles = await (from ve in _context.Vehicles
                                  join typeV in _context.VehiclesTypes on ve.VehicleType equals typeV.RowId
                                  where ve.Status == 1
                                  select new
                                  {
                                      ve.RowId,
                                      ve.VehicleName,
                                      ve.VehicleLicense,
                                      ve.VehicleType,
                                      typeV.VehicleTypeName,
                                      ve.Status,
                                      ve.WeightEmpty,
                                      ve.WeightCapacity,
                                      ve.CubeCapacity

                                  }
                                  ).ToListAsync();
            return Ok(vehicles);
        }

        [HttpPost("GetVehiclesActive")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> GetVehiclesActive([FromBody] Vehicle vehicle)
        {
            var vehicles = await (from ve in _context.Vehicles
                                  join typeV in _context.VehiclesTypes on ve.VehicleType equals typeV.RowId
                                  where ve.Status == 1 && ve.Active == 1 && ve.VehicleType == vehicle.VehicleType
                                  select new
                                  {
                                      ve.RowId,
                                      ve.VehicleName
                                  }
                                  ).ToListAsync();
            return Ok(vehicles);
        }

        [HttpPost("GetVehiclesRowId")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> GetVehiclesRowId([FromBody] Vehicle vehicle)
        {
            var vehicles = await (from ve in _context.Vehicles
                                  join typeV in _context.VehiclesTypes on ve.VehicleType equals typeV.RowId
                                  where ve.Status == 1 && ve.Active == 1 && ve.RowId == vehicle.RowId
                                  select new
                                  {
                                      ve.RowId,
                                      ve.VehicleLicense
                                  }
                                  ).FirstOrDefaultAsync();
            return Ok(vehicles);
        }

        [HttpPost("AddVehicles")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AddVehicles([FromBody] Vehicle vehicle)
        {
            if (vehicle == null)
            {
                return BadRequest("Invalid Data");
            }
            else
            {
                var vehicleType = await _context.VehiclesTypes.FirstOrDefaultAsync(vt => vt.RowId == vehicle.VehicleType && vt.Status == 1);
                if (vehicleType == null)
                {
                    var returnData = new
                    {
                        status = false,
                        code = -1,
                        message = "VehiclesTypes not found or status is not active."
                    };
                    return Ok(returnData);
                }

                var newvehicle = new Vehicle
                {
                    VehicleName = vehicle.VehicleName,
                    Status = vehicle.Status,
                    VehicleLicense = vehicle.VehicleLicense,
                    VehicleType = vehicle.VehicleType,
                    WeightCapacity = vehicle.WeightCapacity != null ? vehicle.WeightCapacity.Value : 0,
                    WeightEmpty = vehicle.WeightEmpty != null ? vehicle.WeightEmpty.Value : 0,
                    CubeCapacity = vehicle.CubeCapacity != null ? vehicle.CubeCapacity.Value : 0,
                    CreatedBy = 1,
                    Active = 1,
                    CreatedDate = DateTime.Now

                };
                try
                {
                    _context.Vehicles.Add(newvehicle);
                    await _context.SaveChangesAsync();
                    var returnData = new
                    {
                        status = true,
                        code = 0,
                        message = "Vehicles inserted successfully.",
                        typeloadId = newvehicle.RowId
                    };
                    return Ok(returnData);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal server error: {ex.Message}");
                }
            }
        }

        [HttpPost("EditVehicles")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> EditVehicles([FromBody] Vehicle vehicle)
        {
            if (vehicle == null)
            {
                return BadRequest("Invalid Data");
            }
            else
            {
                var existingVehicles = await _context.Vehicles.FirstOrDefaultAsync(vt => vt.RowId == vehicle.RowId && vt.Status == 1);
                if (existingVehicles == null)
                {
                    return NotFound("Vehicles not found or status is not active");
                }
                var vehicleType = await _context.VehiclesTypes.FirstOrDefaultAsync(vv => vv.RowId == vehicle.VehicleType && vv.Status == 1);
                if (existingVehicles == null)
                {
                    var returnData = new
                    {
                        status = false,
                        code = -1,
                        message = "Vehicles not found or status is not active."
                    };
                    return Ok(returnData);
                }
                if (vehicle.VehicleType.HasValue)
                {
                    existingVehicles.VehicleType = vehicle.VehicleType.Value;
                }
                if (!string.IsNullOrEmpty(vehicle.VehicleLicense))
                {
                    existingVehicles.VehicleLicense = vehicle.VehicleLicense;
                }
                if (!string.IsNullOrEmpty(vehicle.VehicleName))
                {
                    existingVehicles.VehicleName = vehicle.VehicleName;
                }
                if (vehicle.WeightEmpty.HasValue)
                {
                    existingVehicles.WeightEmpty = vehicle.WeightEmpty.Value;
                }
                if (vehicle.WeightCapacity.HasValue)
                {
                    existingVehicles.WeightCapacity = vehicle.WeightCapacity.Value;
                }
                if (vehicle.Status.HasValue)
                {
                    existingVehicles.Status = vehicle.Status.Value;
                }
                if (vehicle.CubeCapacity.HasValue)
                {
                    existingVehicles.CubeCapacity = vehicle.CubeCapacity.Value;
                }
                existingVehicles.UpdatedDate = DateTime.Now;
                existingVehicles.UpdatedBy = 1;
                try
                {
                    await _context.SaveChangesAsync();
                    return Ok(new
                    {
                        status = true,
                        message = "Vehicles updated successfully.",
                        UserId = existingVehicles.RowId
                    });
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal server error: {ex.Message}");
                }

            }
        }
    }
}
