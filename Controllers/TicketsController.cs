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
            var userId = int.Parse(HttpContext.Session.GetString("RowId") ?? "0");
            var ticket = await (from tickets in _context.Tickets
                                join vechicle in _context.Vehicles on tickets.VehiclesId equals vechicle.RowId into vehicleGroup
                                from vechicle in vehicleGroup.DefaultIfEmpty()
                                join vechicleType in _context.VehiclesTypes on vechicle.VehicleType equals vechicleType.RowId into vehicleTypeGroup
                                from vehicleType in vehicleTypeGroup.DefaultIfEmpty()
                                join loadType in _context.TypeLoads on tickets.TypeloadId equals loadType.RowId into loadTypeGroup
                                from loadType in loadTypeGroup.DefaultIfEmpty()
                                join department in _context.Departments on tickets.DepartmentId equals department.RowId
                                //join customers in _context.Customers on tickets.CustomerId equals customers.RowId
                                where tickets.Status == 1 && tickets.CreatedDate.Value.Date >= dateRange.StartData && tickets.CreatedDate.Value.Date <= dateRange.EndData
                                && tickets.CreatedBy == userId
                                select new
                                {
                                    tickets.RowId,
                                    tickets.JobNo,
                                    tickets.Title,
                                    tickets.DepartmentId,
                                    DepartmentName = department.DepartmentName,
                                    tickets.CustomerId,
                                    CustomerName = "",
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
        public async Task<IActionResult> UpdateTicketsFrmJobNo([FromBody] TicketRequestDto ticket)
        {

            if (ticket.RowId == 0)
            {
                return BadRequest("Invalid Row Id.");
            }
            else
            {
                var userId = int.Parse(HttpContext.Session.GetString("RowId") ?? "0");
                var existingTicket = await _context.Tickets.FindAsync(ticket.RowId);
                if (existingTicket == null)
                {
                    return NotFound("Ticket not found");
                }

                existingTicket.DepartmentId = ticket.DepartmentId;
                existingTicket.VehiclesTypeId = ticket.VehiclesTypeId;
                existingTicket.Loading = ticket.Loading;
                existingTicket.Etatostore = ticket.Etatostore;
                existingTicket.Backhual = ticket.Backhual;
                existingTicket.TypeloadId = ticket.TypeloadId;
                existingTicket.TempId = ticket.TempId;
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
                existingTicket.ActionBy = userId;

                existingTicket.ActionDate = DateTime.Now;
                existingTicket.ReceivedDate = DateTime.Now;
                existingTicket.LastUpdated = DateTime.Now;
                existingTicket.UpdatedBy = userId;
                existingTicket.StatusOperation = ticket.StatusOperation;

                if (ticket.Data != null && ticket.Data.Any())
                {
                    List<TicketsDetail> ticketsDetails = new List<TicketsDetail>();
                    foreach (var ticket_ in ticket.Data)
                    {
                        var existingTicketDetails = await _context.TicketsDetails.FindAsync(ticket_.RowId);
                        if (existingTicketDetails == null)
                        {
                            return NotFound("Departments not found");
                        }
                        existingTicketDetails.Qty = ticket_.Qty;
                        existingTicketDetails.Weight = ticket_.Weight;
                        existingTicketDetails.Cbm = ticket_.Cbm;
                        existingTicketDetails.LastUpdated = DateTime.Now;
                        existingTicketDetails.UpdatedBy = userId;

                        _context.TicketsDetails.Update(existingTicketDetails);
                    }
                    await _context.SaveChangesAsync();
                }

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
                                     //join customer in _context.Customers on tickets.CustomerId equals customer.RowId
                                 where tickets.JobNo == ticket.JobNo
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
                                     tickets.Title

                                 }).FirstOrDefaultAsync();

            if (ticket_ == null)
            {
                return NotFound("No Ticket Found");
            }

            var ticketDetails = await (from details in _context.TicketsDetails
                                       join customer in _context.Customers on details.CustomerId equals customer.RowId
                                       where details.JobNo == ticket_.JobNo
                                       select new
                                       {
                                           details.RowId,
                                           details.CustomerId,
                                           customer.CustomerName,
                                           CustomerCode = customer.CustomerId,
                                           details.JobNo,
                                           details.Origin,
                                           details.Destination,
                                           details.Qty,
                                           details.Weight,
                                           details.Cbm

                                       }).ToArrayAsync();

            var response = new
            {
                ticket_.RowId,
                ticket_.JobNo,
                ticket_.DepartmentId,
                ticket_.CustomerId,
                ticket_.VehiclesTypeId,
                ticket_.Backhual,
                ticket_.Origin,
                ticket_.Status,
                ticket_.Loading,
                ticket_.Destination,
                ticket_.Etatostore,
                ticket_.TypeloadId,
                ticket_.TempId,
                ticket_.Qty,
                ticket_.Weight,
                ticket_.Cbm,
                ticket_.DeliveryMan,
                ticket_.Handjack,
                ticket_.Cart,
                ticket_.Cardboard,
                ticket_.FoamBox,
                ticket_.DryIce,
                ticket_.Assign,
                ticket_.Comment,
                ticket_.VehiclesId,
                ticket_.Driver,
                ticket_.Sub,
                ticket_.Tel,
                ticket_.TravelCosts,
                ticket_.Distance,
                ticket_.StatusOperation,
                ticket_.Title,
                data = ticketDetails
            };

            return Ok(response);
        }

        [HttpPost("GetTicketsViewJobNo")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> GetTicketsViewJobNo([FromBody] Ticket ticket)
        {
            var userid = int.Parse(HttpContext.Session.GetString("RowId") ?? "0");
            var ticket_ = await (from tickets in _context.Tickets
                                 join dep in _context.Departments on tickets.DepartmentId equals dep.RowId
                                 //join customer in _context.Customers on tickets.CustomerId equals customer.RowId
                                 join vechicle in _context.Vehicles on tickets.VehiclesId equals vechicle.RowId into vehicleGroup
                                 from vechicle in vehicleGroup.DefaultIfEmpty()
                                 join temp in _context.Temps on tickets.TempId equals temp.RowId
                                 join vechicletype in _context.VehiclesTypes on tickets.VehiclesTypeId equals vechicletype.RowId
                                 join typeload in _context.TypeLoads on tickets.TypeloadId equals typeload.RowId
                                 join user in _context.Users on tickets.Assign equals user.RowId
                                 where tickets.JobNo == ticket.JobNo
                                 select new
                                 {
                                     tickets.RowId,
                                     tickets.JobNo,
                                     tickets.Title,
                                     tickets.DepartmentId,
                                     tickets.VehiclesTypeId,
                                     tickets.Backhual,
                                     tickets.Status,
                                     tickets.Loading,
                                     tickets.Etatostore,
                                     tickets.TypeloadId,
                                     tickets.TempId,
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
                                     vechicle.VehicleName,
                                     vechicle.VehicleLicense,
                                     typeload.LoadName,
                                     AssignName = user.FirstName + " " + user.LastName,
                                     vechicletype.VehicleTypeName,
                                     temp.TempName

                                 }).FirstOrDefaultAsync();

            if (ticket_ == null)
            {
                return NotFound("No Ticket Found");
            }

            var ticketDetails = await (from details in _context.TicketsDetails
                                       join customer in _context.Customers on details.CustomerId equals customer.RowId
                                       where details.JobNo == ticket_.JobNo
                                       select new
                                       {
                                           details.RowId,
                                           details.CustomerId,
                                           customer.CustomerName,
                                           CustomerCode = customer.CustomerId,
                                           details.JobNo,
                                           details.Origin,
                                           details.Destination,
                                           details.Qty,
                                           details.Weight,
                                           details.Cbm

                                       }).ToArrayAsync();

            var response = new
            {
                ticket_.RowId,
                ticket_.JobNo,
                ticket_.Title,
                ticket_.DepartmentId,
                ticket_.VehiclesTypeId,
                ticket_.Backhual,
                ticket_.Status,
                ticket_.Loading,
                ticket_.Etatostore,
                ticket_.TypeloadId,
                ticket_.TempId,
                ticket_.DeliveryMan,
                ticket_.Handjack,
                ticket_.Cart,
                ticket_.Cardboard,
                ticket_.FoamBox,
                ticket_.DryIce,
                ticket_.Assign,
                ticket_.Comment,
                ticket_.VehiclesId,
                ticket_.Driver,
                ticket_.Sub,
                ticket_.Tel,
                ticket_.TravelCosts,
                ticket_.Distance,
                ticket_.StatusOperation,
                ticket_.DepartmentName,
                ticket_.VehicleName,
                ticket_.VehicleLicense,
                ticket_.LoadName,
                ticket_.AssignName,
                ticket_.VehicleTypeName,
                ticket_.TempName,
                data = ticketDetails // ใส่ข้อมูล TicketsDetails เข้าไปใน JSON response
            };

            return Ok(response);
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
                                //join customers in _context.Customers on tickets.CustomerId equals customers.RowId
                                where tickets.Status == 1
                                && tickets.StatusOperation != 0
                                && tickets.CreatedDate.Value.Date >= dateRange.StartData
                                && tickets.CreatedDate.Value.Date <= dateRange.EndData
                                //&& tickets.Assign == userid
                                select new
                                {
                                    tickets.RowId,
                                    tickets.JobNo,
                                    tickets.Title,
                                    tickets.DepartmentId,
                                    DepartmentName = department.DepartmentName,
                                    tickets.CustomerId,
                                    CustomerName = "",
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
                                //join customers in _context.Customers on tickets.CustomerId equals customers.RowId
                                where tickets.Status == 1
                                && tickets.CreatedDate.Value.Date >= dateRange.StartData && tickets.CreatedDate.Value.Date <= dateRange.EndData
                                && tickets.StatusOperation == 0
                                select new
                                {
                                    tickets.RowId,
                                    tickets.Title,
                                    tickets.JobNo,
                                    tickets.DepartmentId,
                                    DepartmentName = department.DepartmentName,
                                    tickets.CustomerId,
                                    CustomerName = "",
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
        public async Task<IActionResult> AddTicketsFrmRequester([FromBody] TicketRequestDto request)
        {
            if (request == null)
            {
                return BadRequest("Invalid Data");
            }
            else
            {
                var userId = int.Parse(HttpContext.Session.GetString("RowId") ?? "0");
                if (string.IsNullOrWhiteSpace(request.JobNo))
                {
                    return BadRequest("JobNo cannot be null or empty.");
                }
                // เรียก Stored Procedure


                string jobNumber = _storedProcedureService.CallGenerateNumberJob(request.JobNo);

                if (string.IsNullOrWhiteSpace(jobNumber))
                {
                    return NotFound("Failed to generate JobNumber.");
                }

                // 🎯 ใช้ Transaction เพื่อป้องกันปัญหาข้อมูลไม่สมบูรณ์
                using var transaction = await _context.Database.BeginTransactionAsync();
                try
                {
                    var newTicket = new Ticket
                    {
                        JobNo = jobNumber,
                        Title = request.Title,
                        DepartmentId = request.DepartmentId,
                        VehiclesTypeId = request.VehiclesTypeId,
                        TempId = request.TempId,
                        Backhual = request.Backhual,
                        Loading = request.Loading,
                        Etatostore = request.Etatostore,
                        TypeloadId = request.TypeloadId,
                        DeliveryMan = request.DeliveryMan,
                        Handjack = request.Handjack,
                        Cart = request.Cart,
                        Cardboard = request.Cardboard,
                        FoamBox = request.FoamBox,
                        DryIce = request.DryIce,
                        Assign = request.Assign,
                        Comment = request.Comment,
                        Status = 1,
                        StatusOperation = request.StatusOperation,
                        CreatedDate = DateTime.Now,
                        CreatedBy = userId
                    };
                    try
                    {
                        _context.Tickets.Add(newTicket);
                        await _context.SaveChangesAsync();
                    }
                    catch (Exception ex)
                    {
                        return StatusCode(500, $"Internal server error: {ex.Message}");
                    }

                    // 2️⃣ ตรวจสอบ request.Data ก่อนสร้าง TicketsDetails
                    if (request.Data != null && request.Data.Any())
                    {
                        List<TicketsDetail> ticketsDetails = new List<TicketsDetail>();
                        foreach (var ticket in request.Data)
                        {
                            ticketsDetails.Add(new TicketsDetail
                            {
                                JobNo = jobNumber,
                                CustomerId = ticket.CustomerId,
                                Origin = ticket.Origin,
                                Destination = ticket.Destination,
                                Qty = ticket.Qty,
                                Weight = ticket.Weight,
                                Cbm = ticket.Cbm,
                                CreatedDate = DateTime.Now,
                                CreatedBy = userId,
                            }
                            );
                        }
                        _context.TicketsDetails.AddRange(ticketsDetails);
                        await _context.SaveChangesAsync();
                    }


                    try
                    {
                        // 🎯 ยืนยัน Transaction
                        await transaction.CommitAsync();


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
                catch (Exception ex)
                {
                    await transaction.RollbackAsync(); // ❌ Rollback ถ้ามีข้อผิดพลาด
                    return StatusCode(500, $"Internal server error: {ex.Message}");
                }
            }

        }


        [HttpPost("ChangeTruckTicket")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ChangeTruckTicket([FromBody] Ticket request)
        {
            if (request == null)
            {
                return BadRequest("Invalid Data");
            }
            var userId = int.Parse(HttpContext.Session.GetString("RowId") ?? "0");
            if (string.IsNullOrWhiteSpace(request.JobNo))
            {
                return BadRequest("JobNo cannot be null or empty.");
            }

            var existingTicket = await _context.Tickets
                .FirstOrDefaultAsync(t => t.JobNo == request.JobNo);

            if (existingTicket == null)
            {
                return NotFound("Ticket not found");
            }
            // เก็บค่า VehiclesId เดิมไว้
            int OldVehiclesId = existingTicket.VehiclesId ?? 0;

            existingTicket.Driver = request.Driver;
            existingTicket.VehiclesId = request.VehiclesId;
            existingTicket.Sub = request.Sub;
            existingTicket.Tel = request.Tel;
            existingTicket.LastUpdated = DateTime.Now;
            existingTicket.UpdatedBy = userId;
            try
            {
                //var vehiclesToUpdate = new List<Vehicle>();

                if (OldVehiclesId != request.VehiclesId)
                {
                    if (request.VehiclesId.HasValue && request.VehiclesId != 0)
                    {
                        // update vichicle
                        var vichicleNew = await _context.Vehicles.FindAsync(request.VehiclesId);
                        if (vichicleNew != null)
                        {
                            vichicleNew.Active = 1;
                        }
                    }

                    if (OldVehiclesId != 0)
                    {
                        var vichicleOld = await _context.Vehicles.FindAsync(OldVehiclesId);
                        if (vichicleOld != null)
                        {
                            vichicleOld.Active = 0;
                        }
                    }
                }

                // บันทึกการเปลี่ยนแปลงลงฐานข้อมูล
                await _context.SaveChangesAsync();

                // คืนค่าสำเร็จ (หรือคืนค่า OldVehiclesId หากต้องการ)
                var returnData = new
                {
                    status = true,
                    message = "Tickets update successfully."
                };
                return Ok(returnData);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred during the update.");
            }

        }


        //[HttpPost("AddTicketsFrmRequester")]
        //[ValidateAntiForgeryToken]
        //public async Task<IActionResult> AddTicketsFrmRequester([FromBody] Ticket ticket)
        //{
        //    if (ticket == null)
        //    {
        //        return BadRequest("Invalid Data");
        //    }
        //    else
        //    {
        //        if (string.IsNullOrWhiteSpace(ticket.JobNo))
        //        {
        //            return BadRequest("JobNo cannot be null or empty.");
        //        }
        //        // เรียก Stored Procedure


        //        string jobNumber = _storedProcedureService.CallGenerateNumberJob(ticket.JobNo);

        //        if (string.IsNullOrWhiteSpace(jobNumber))
        //        {
        //            return NotFound("Failed to generate JobNumber.");
        //        }

        //        var newTicket = new Ticket
        //        {
        //            JobNo = jobNumber,
        //            DepartmentId = ticket.DepartmentId,
        //            CustomerId = ticket.CustomerId,
        //            VehiclesTypeId = ticket.VehiclesTypeId,
        //            TempId = ticket.TempId,
        //            Backhual = ticket.Backhual,
        //            Origin = ticket.Origin,
        //            Loading = ticket.Loading,
        //            Destination = ticket.Destination,
        //            Etatostore = ticket.Etatostore,
        //            TypeloadId = ticket.TypeloadId,
        //            Qty = ticket.Qty,
        //            Weight = ticket.Weight,
        //            Cbm = ticket.Cbm,
        //            DeliveryMan = ticket.DeliveryMan,
        //            Handjack = ticket.Handjack,
        //            Cart = ticket.Cart,
        //            Cardboard = ticket.Cardboard,
        //            FoamBox = ticket.FoamBox,
        //            DryIce = ticket.DryIce,
        //            Assign = ticket.Assign,
        //            Comment = ticket.Comment,
        //            Status = 1,
        //            StatusOperation = ticket.StatusOperation,
        //            CreatedDate = DateTime.Now,
        //            CreatedBy = 1
        //        };
        //        try
        //        {
        //            _context.Tickets.Add(newTicket);
        //            await _context.SaveChangesAsync();
        //            var returnData = new
        //            {
        //                status = true,
        //                code = 0,
        //                message = "Tickets inserted successfully.",
        //                RowId = newTicket.RowId,
        //                JobNo = newTicket.JobNo
        //            };
        //            return Ok(returnData);
        //        }
        //        catch (Exception ex)
        //        {
        //            return StatusCode(500, $"Internal server error: {ex.Message}");
        //        }
        //    }
        //}
    }
}
