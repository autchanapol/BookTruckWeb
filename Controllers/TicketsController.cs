using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using BookTruckWeb.Models;
using BookTruckWeb.Models.DTO;
using BookTruckWeb.connect;
using static System.Runtime.InteropServices.JavaScript.JSType;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Runtime.Intrinsics.Arm;

namespace BookTruckWeb.Controllers
{
    [Route("Tickets")]
    public class TicketsController : Controller
    {
        private readonly BookTruckContext _context;
        private readonly StoredProcedure _storedProcedureService;
        public TicketsController(BookTruckContext context, StoredProcedure storedProcedureService)
        {
            _context = context;
            _storedProcedureService = storedProcedureService;
        }


        //[HttpPost("ClosingTicketsFrmTruck")]

        [HttpPost("GetTicketsFrmRequester")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> GetTicketsFrmRequester([FromBody] DateRangeDto dateRange)
        {
            var rowId = int.Parse(HttpContext.Session.GetString("RowId") ?? "0");
            var ticket = await (from tickets in _context.Tickets
                                join vechicle in _context.Vehicles on tickets.VehiclesId equals vechicle.RowId into vehicleGroup
                                from vechicle in vehicleGroup.DefaultIfEmpty()
                                join vechicleType in _context.VehiclesTypes on vechicle.VehicleType equals vechicleType.RowId into vehicleTypeGroup
                                from vehicleType in vehicleTypeGroup.DefaultIfEmpty()
                                join loadType in _context.TypeLoads on tickets.TypeloadId equals loadType.RowId into loadTypeGroup
                                from loadType in loadTypeGroup.DefaultIfEmpty()
                                join department in _context.Departments on tickets.DepartmentId equals department.RowId
                                join customers in _context.Customers on tickets.CustomerId equals customers.RowId
                                where tickets.Status == 1 && tickets.CreatedDate.Value.Date >= dateRange.StartData && tickets.CreatedDate.Value.Date <= dateRange.EndData
                                && tickets.CreatedBy == rowId
                                select new
                                {
                                    tickets.RowId,
                                    tickets.JobNo,
                                    tickets.DepartmentId,
                                    DepartmentName = department.DepartmentName,
                                    tickets.CustomerId,
                                    CustomerName = customers.CustomerName,
                                    tickets.Loading,
                                    tickets.StatusOperation,
                                    StatusName = tickets.StatusOperation == 0 ? "New Request" :
                                    tickets.StatusOperation == 1 ? "Waiting" :
                                    tickets.StatusOperation == 2 ? "Approved" :
                                    tickets.StatusOperation == 3 ? "Rejected" :
                                    tickets.StatusOperation == 4 ? "Closed" :
                                    tickets.StatusOperation == 5 ? "Canceled" :
                                    "Draft",
                                    tickets.Assign,
                                    AssignName = (from assing in _context.Users
                                                  where assing.RowId == tickets.Assign
                                                  select assing.FirstName + " " + assing.LastName).FirstOrDefault(),
                                    tickets.CreatedDate
                                }
                                ).ToListAsync();

            return Ok(ticket);

        }

        [HttpPost("MutiUpdateTicketsStatus")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> MutiUpdateTicketsStatus([FromBody] UpdateTicketsRequest request)
        {
            if (request == null || request.Data == null || !request.Data.Any())
            {
                return BadRequest("Invalid request data.");
            }
            var userId = int.Parse(HttpContext.Session.GetString("RowId") ?? "0");
            // ดำเนินการอัปเดต StatusOperation ของ Tickets
            foreach (var ticket in request.Data)
            {
                var existingTicket = await _context.Tickets.FindAsync(ticket.RowId);
                if (existingTicket == null)
                {
                    return Ok(new
                    {
                        success = false,
                        message = "Not found this Ticket"
                    });
                }

                existingTicket.StatusOperation = request.StatusOperation;
                existingTicket.Driver = request.Driver;
                existingTicket.VehiclesId = int.Parse(request.VehiclesId ?? "0");
                existingTicket.TravelCosts = ticket.TravelCosts;
                existingTicket.Distance = ticket.Distance;
                existingTicket.Sub = request.Sub;
                existingTicket.Tel = request.Tel;
                existingTicket.LastUpdated = DateTime.Now;
                existingTicket.ActionDate = DateTime.Now;
                existingTicket.ActionBy = userId;
                existingTicket.UpdatedBy = userId;
            }

            try
            {
                int vehiclesId;
                if (!int.TryParse(request.VehiclesId, out vehiclesId))
                {
                    return BadRequest("Invalid VehiclesId.");
                }

                var existingVehicles = await (from vehicle in _context.Vehicles
                                              where vehicle.RowId == vehiclesId && vehicle.Active == 0
                                              select vehicle).FirstOrDefaultAsync();

                if (existingVehicles == null)
                {
                    return Ok(new
                    {
                        success = false,
                        message = "Not found this Vehicles"
                    });
                }

                existingVehicles.Active = 1;

                await _context.SaveChangesAsync();
                return Ok(new
                {
                    success = true,
                    message = "Ticket updated successfully."
                });

            }
            catch (DbUpdateConcurrencyException)
            {
                return StatusCode(500, "An error occurred during the update.");
            }

        }

        [HttpPost("UpdateTicketsStatus")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateTicketsStatus([FromBody] Ticket ticket)
        {
            if (ticket.RowId == 0)
            {
                return BadRequest("Invalid Row Id.");
            }
            else
            {
                var rowId = int.Parse(HttpContext.Session.GetString("RowId") ?? "0");
                var existingTicket = await _context.Tickets.FindAsync(ticket.RowId);
                if (existingTicket == null)
                {
                    return Ok(new
                    {
                        success = false,
                        message = "Not found this Ticket"
                    });
                }
                existingTicket.StatusOperation = ticket.StatusOperation;
                existingTicket.LastUpdated = DateTime.Now;
                existingTicket.ReceivedDate = DateTime.Now;
                existingTicket.ReceivedBy = rowId;
                existingTicket.UpdatedBy = rowId;


                //var existingVehicles = await (from vehicle in _context.Vehicles
                //                              where vehicle.RowId == ticket.VehiclesId && vehicle.Active == 0
                //                              select vehicle).FirstOrDefaultAsync();

                //if (existingVehicles == null)
                //{
                //    return Ok(new
                //    {
                //        success = false,
                //        message = "Not found this Vehicles"
                //    });
                //}

                //existingVehicles.Active = 1;

                try
                {
                    await _context.SaveChangesAsync();
                    return Ok(new
                    {
                        success = true,
                        message = "Ticket updated successfully."
                    });

                }
                catch (DbUpdateConcurrencyException)
                {
                    return StatusCode(500, "An error occurred during the update.");
                }
            }
        }

        [HttpPost("UpdateTicketsFrmJobNo")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateTicketsFrmJobNo([FromBody] Ticket ticket)
        {

            if (ticket.RowId == 0)
            {
                return BadRequest("Invalid Row Id.");
            }
            else
            {
                var rowId = int.Parse(HttpContext.Session.GetString("RowId") ?? "0");
                var existingTicket = await _context.Tickets.FindAsync(ticket.RowId);
                if (existingTicket == null)
                {
                    return NotFound("Departments not found");
                }

                existingTicket.DepartmentId = ticket.DepartmentId;
                existingTicket.CustomerId = ticket.CustomerId;
                existingTicket.VehiclesTypeId = ticket.VehiclesTypeId;
                existingTicket.Origin = ticket.Origin;
                existingTicket.Loading = ticket.Loading;
                existingTicket.Destination = ticket.Destination;
                existingTicket.Etatostore = ticket.Etatostore;
                existingTicket.Backhual = ticket.Backhual;
                existingTicket.TypeloadId = ticket.TypeloadId;
                existingTicket.TempId = ticket.TempId;
                existingTicket.Qty = ticket.Qty;
                existingTicket.Weight = ticket.Weight;
                existingTicket.Cbm = ticket.Cbm;
                existingTicket.DeliveryMan = ticket.DeliveryMan;
                existingTicket.Handjack = ticket.Handjack;
                existingTicket.Cart = ticket.Cart;
                existingTicket.Cardboard = ticket.Cardboard;
                existingTicket.FoamBox = ticket.FoamBox;
                existingTicket.DryIce = ticket.DryIce;
                if (ticket.VehiclesId.HasValue && ticket.VehiclesId != 0)
                    existingTicket.VehiclesId = ticket.VehiclesId;
                if (!string.IsNullOrEmpty(ticket.Driver))
                    existingTicket.Driver = ticket.Driver;
                if (!string.IsNullOrEmpty(ticket.Sub))
                    existingTicket.Sub = ticket.Sub;
                if (!string.IsNullOrEmpty(ticket.Tel))
                    existingTicket.Tel = ticket.Tel;
                if (ticket.TravelCosts.HasValue)
                    existingTicket.TravelCosts = ticket.TravelCosts;
                if (ticket.Distance.HasValue)
                    existingTicket.Distance = ticket.Distance;
                existingTicket.ActionBy = rowId;
                
                existingTicket.ActionDate = DateTime.Now;
                existingTicket.ReceivedDate = DateTime.Now;
                existingTicket.LastUpdated = DateTime.Now;
                existingTicket.StatusOperation = ticket.StatusOperation;

                try
                {
                    if (ticket.VehiclesId.HasValue && ticket.VehiclesId != 0)
                    {
                        // update vichicle
                        var vichicle = await _context.Vehicles.FindAsync(ticket.VehiclesId);
                        if (vichicle != null)
                        {
                            vichicle.Active = 1;
                        }
                    }

                    await _context.SaveChangesAsync();
                    return Ok(new
                    {
                        success = true,
                        message = "Ticket updated successfully."
                    });

                }
                catch (DbUpdateConcurrencyException)
                {
                    return StatusCode(500, "An error occurred during the update.");
                }
            }
        }

        [HttpPost("GetTicketsFrmJobNo")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> GetTicketsFrmJobNo([FromBody] Ticket ticket)
        {
            var ticket_ = await (from tickets in _context.Tickets
                                 join customer in _context.Customers on tickets.CustomerId equals customer.RowId
                                 where tickets.JobNo == ticket.JobNo
                                 select new
                                 {
                                     tickets.RowId,
                                     tickets.JobNo,
                                     tickets.DepartmentId,
                                     tickets.CustomerId,
                                     customer.CustomerName,
                                     CustomerCode = customer.CustomerId,
                                     tickets.VehiclesTypeId,
                                     tickets.Backhual,
                                     tickets.Origin,
                                     tickets.Status,
                                     tickets.Loading,
                                     tickets.Destination,
                                     tickets.Etatostore,
                                     tickets.TypeloadId,
                                     tickets.TempId,
                                     tickets.Qty,
                                     tickets.Weight,
                                     tickets.Cbm,
                                     tickets.DeliveryMan,
                                     tickets.Handjack,
                                     tickets.Cart,
                                     tickets.Cardboard,
                                     tickets.FoamBox,
                                     tickets.DryIce,
                                     tickets.Assign,
                                     tickets.Comment,
                                     tickets.VehiclesId,
                                     tickets.Driver,
                                     tickets.Sub,
                                     tickets.Tel,
                                     tickets.TravelCosts,
                                     tickets.Distance,
                                     tickets.StatusOperation

                                 }).FirstOrDefaultAsync();

            return Ok(ticket_);
        }

        [HttpPost("GetTicketsViewJobNo")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> GetTicketsViewJobNo([FromBody] Ticket ticket)
        {
            var userid = int.Parse(HttpContext.Session.GetString("RowId") ?? "0");
            var ticket_ = await (from tickets in _context.Tickets
                                 join dep in _context.Departments on tickets.DepartmentId equals dep.RowId
                                 join customer in _context.Customers on tickets.CustomerId equals customer.RowId
                                 join vechicle in _context.Vehicles on tickets.VehiclesId equals vechicle.RowId into vehicleGroup
                                 from vechicle in vehicleGroup.DefaultIfEmpty()
                                 join temp in _context.Temps on tickets.TempId equals temp.RowId
                                 join vechicletype in _context.VehiclesTypes on tickets.VehiclesTypeId equals vechicletype.RowId
                                 join typeload in _context.TypeLoads on tickets.TypeloadId equals typeload.RowId
                                 join user in _context.Users on tickets.Assign equals user.RowId
                                 where tickets.JobNo == ticket.JobNo
                                 //where tickets.JobNo == ticket.JobNo && tickets.Assign == userid
                                 select new
                                 {
                                     tickets.RowId,
                                     tickets.JobNo,
                                     tickets.DepartmentId,
                                     tickets.CustomerId,
                                     tickets.VehiclesTypeId,
                                     tickets.Backhual,
                                     tickets.Origin,
                                     tickets.Status,
                                     tickets.Loading,
                                     tickets.Destination,
                                     tickets.Etatostore,
                                     tickets.TypeloadId,
                                     tickets.TempId,
                                     tickets.Qty,
                                     tickets.Weight,
                                     tickets.Cbm,
                                     tickets.DeliveryMan,
                                     tickets.Handjack,
                                     tickets.Cart,
                                     tickets.Cardboard,
                                     tickets.FoamBox,
                                     tickets.DryIce,
                                     tickets.Assign,
                                     tickets.Comment,
                                     tickets.VehiclesId,
                                     tickets.Driver,
                                     tickets.Sub,
                                     tickets.Tel,
                                     tickets.TravelCosts,
                                     tickets.Distance,
                                     tickets.StatusOperation,
                                     dep.DepartmentName,
                                     CustomerCode = customer.CustomerId,
                                     customer.CustomerName,
                                     vechicle.VehicleName,
                                     vechicle.VehicleLicense,
                                     typeload.LoadName,
                                     AssignName =  user.FirstName + " " + user.LastName,
                                     vechicletype.VehicleTypeName,
                                     temp.TempName



                                 }).FirstOrDefaultAsync();

            return Ok(ticket_);
        }


        [HttpPost("GetTicketsJson")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> GetTicketsJson([FromBody] List<JobRequest> jobRequests)
        {
            if (jobRequests == null || !jobRequests.Any())
            {
                return BadRequest("No data received");
            }

            //// ตัวอย่างการประมวลผลข้อมูล
            //foreach (var job in jobRequests)
            //{
            //    Console.WriteLine($"RowId: {job.RowId}, JobNo: {job.JobNo}");
            //}

            // ดึง RowId จาก jobRequests
            //var rowIds = jobRequests.Select(job => job.RowId).ToList();
            var rowIds = jobRequests.Select(job => int.Parse(job.RowId)).ToList();

            var ticket = await (from tickets in _context.Tickets
                                join customers in _context.Customers on tickets.CustomerId equals customers.RowId
                                where tickets.Status == 1
                                && rowIds.Contains(tickets.RowId) // ใช้ IN ใน LINQ
                                //&& tickets.Assign == userid
                                select new
                                {
                                    tickets.RowId,
                                    tickets.JobNo,
                                    tickets.DepartmentId,
                                    tickets.CustomerId,
                                    customers.CustomerName,
                                    tickets.Loading,
                                }
                                ).ToListAsync();

            return Ok(ticket);

            //return Ok(new { message = "Data processed successfully", count = jobRequests.Count });
        }

        [HttpPost("GetTicketsAll")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> GetTicketsAll([FromBody] DateRangeDto dateRange)
        {
            var userid = int.Parse(HttpContext.Session.GetString("RowId") ?? "0");
            var ticket = await (from tickets in _context.Tickets
                                join vechicle in _context.Vehicles on tickets.VehiclesId equals vechicle.RowId into vehicleGroup
                                from vechicle in vehicleGroup.DefaultIfEmpty()
                                join vechicleType in _context.VehiclesTypes on vechicle.VehicleType equals vechicleType.RowId into vehicleTypeGroup
                                from vehicleType in vehicleTypeGroup.DefaultIfEmpty()
                                join loadType in _context.TypeLoads on tickets.TypeloadId equals loadType.RowId into loadTypeGroup
                                from loadType in loadTypeGroup.DefaultIfEmpty()
                                join department in _context.Departments on tickets.DepartmentId equals department.RowId
                                join customers in _context.Customers on tickets.CustomerId equals customers.RowId
                                where tickets.Status == 1 
                                && tickets.StatusOperation != 0
                                && tickets.CreatedDate.Value.Date >= dateRange.StartData 
                                && tickets.CreatedDate.Value.Date <= dateRange.EndData
                                //&& tickets.Assign == userid
                                select new
                                {
                                    tickets.RowId,
                                    tickets.JobNo,
                                    tickets.DepartmentId,
                                    DepartmentName = department.DepartmentName,
                                    tickets.CustomerId,
                                    CustomerName = customers.CustomerName,
                                    tickets.Loading,
                                    tickets.StatusOperation,
                                    StatusName = tickets.StatusOperation == 0 ? "New Request" :
                                    tickets.StatusOperation == 1 ? "Waiting" :
                                    tickets.StatusOperation == 2 ? "Approved" :
                                    tickets.StatusOperation == 3 ? "Rejected" :
                                    tickets.StatusOperation == 4 ? "Closed" :
                                    tickets.StatusOperation == 5 ? "Canceled" :
                                    "Draft",
                                    tickets.Assign,
                                    AssignName = (from assing in _context.Users
                                                  where assing.RowId == tickets.Assign
                                                  select assing.FirstName + " " + assing.LastName).FirstOrDefault(),
                                    RequestFrom = (from requester in _context.Users
                                                   where requester.RowId == tickets.CreatedBy
                                                   select requester.FirstName + " " + requester.LastName).FirstOrDefault(),
                                    tickets.CreatedDate
                                }
                                ).ToListAsync();

            return Ok(ticket);

        }


        [HttpPost("GetTicketsWaitting")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> GetTicketsWaitting([FromBody] DateRangeDto dateRange)
        {
            var rowId = int.Parse(HttpContext.Session.GetString("RowId") ?? "0");
            var ticket = await (from tickets in _context.Tickets
                                join vechicle in _context.Vehicles on tickets.VehiclesId equals vechicle.RowId into vehicleGroup
                                from vechicle in vehicleGroup.DefaultIfEmpty()
                                join vechicleType in _context.VehiclesTypes on vechicle.VehicleType equals vechicleType.RowId into vehicleTypeGroup
                                from vehicleType in vehicleTypeGroup.DefaultIfEmpty()
                                join loadType in _context.TypeLoads on tickets.TypeloadId equals loadType.RowId into loadTypeGroup
                                from loadType in loadTypeGroup.DefaultIfEmpty()
                                join department in _context.Departments on tickets.DepartmentId equals department.RowId
                                join customers in _context.Customers on tickets.CustomerId equals customers.RowId
                                where tickets.Status == 1 
                                && tickets.CreatedDate.Value.Date >= dateRange.StartData && tickets.CreatedDate.Value.Date <= dateRange.EndData
                                && tickets.StatusOperation == 0
                                select new
                                {
                                    tickets.RowId,
                                    tickets.JobNo,
                                    tickets.DepartmentId,
                                    DepartmentName = department.DepartmentName,
                                    tickets.CustomerId,
                                    CustomerName = customers.CustomerName,
                                    tickets.Loading,
                                    tickets.StatusOperation,
                                    StatusName = tickets.StatusOperation == 0 ? "New Request" :
                                    tickets.StatusOperation == 1 ? "Waiting" :
                                    tickets.StatusOperation == 2 ? "Approved" :
                                    tickets.StatusOperation == 3 ? "Rejected" :
                                    tickets.StatusOperation == 4 ? "Closed" :
                                    tickets.StatusOperation == 5 ? "Canceled" :
                                    "Draft",
                                    tickets.Assign,
                                    AssignName = (from assing in _context.Users
                                                  where assing.RowId == tickets.Assign
                                                  select assing.FirstName + " " + assing.LastName).FirstOrDefault(),
                                    RequestFrom = (from requester in _context.Users
                                                   where requester.RowId == tickets.CreatedBy
                                                   select requester.FirstName + " " + requester.LastName).FirstOrDefault(),
                                    tickets.CreatedDate
                                }
                                ).ToListAsync();

            return Ok(ticket);

        }

        [HttpPost("AddTicketsFrmRequester")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AddTicketsFrmRequester([FromBody] Ticket ticket)
        {
            if (ticket == null)
            {
                return BadRequest("Invalid Data");
            }
            else
            {
                if (string.IsNullOrWhiteSpace(ticket.JobNo))
                {
                    return BadRequest("JobNo cannot be null or empty.");
                }
                // เรียก Stored Procedure


                string jobNumber = _storedProcedureService.CallGenerateNumberJob(ticket.JobNo);

                if (string.IsNullOrWhiteSpace(jobNumber))
                {
                    return NotFound("Failed to generate JobNumber.");
                }

                var newTicket = new Ticket
                {
                    JobNo = jobNumber,
                    DepartmentId = ticket.DepartmentId,
                    CustomerId = ticket.CustomerId,
                    VehiclesTypeId = ticket.VehiclesTypeId,
                    TempId = ticket.TempId,
                    Backhual = ticket.Backhual,
                    Origin = ticket.Origin,
                    Loading = ticket.Loading,
                    Destination = ticket.Destination,
                    Etatostore = ticket.Etatostore,
                    TypeloadId = ticket.TypeloadId,
                    Qty = ticket.Qty,
                    Weight = ticket.Weight,
                    Cbm = ticket.Cbm,
                    DeliveryMan = ticket.DeliveryMan,
                    Handjack = ticket.Handjack,
                    Cart = ticket.Cart,
                    Cardboard = ticket.Cardboard,
                    FoamBox = ticket.FoamBox,
                    DryIce = ticket.DryIce,
                    Assign = ticket.Assign,
                    Comment = ticket.Comment,
                    Status = 1,
                    StatusOperation = ticket.StatusOperation,
                    CreatedDate = DateTime.Now,
                    CreatedBy = 1
                };
                try
                {
                    _context.Tickets.Add(newTicket);
                    await _context.SaveChangesAsync();
                    var returnData = new
                    {
                        status = true,
                        code = 0,
                        message = "Tickets inserted successfully.",
                        RowId = newTicket.RowId,
                        JobNo = newTicket.JobNo
                    };
                    return Ok(returnData);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal server error: {ex.Message}");
                }
            }
        }
    }
}
