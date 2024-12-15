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
                                    StatusName = tickets.StatusOperation == 1 ? "Watting" :
                                    tickets.StatusOperation == 2 ? "Received" :
                                    tickets.StatusOperation == 3 ? "Approved" :
                                    tickets.StatusOperation == 4 ? "Rejected" :
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


        [HttpPost("GetTicketsAll")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> GetTicketsAll([FromBody] DateRangeDto dateRange)
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
                                    StatusName = tickets.StatusOperation == 1 ? "Watting" :
                                    tickets.StatusOperation == 2 ? "Received" :
                                    tickets.StatusOperation == 3 ? "Approved" :
                                    tickets.StatusOperation == 4 ? "Rejected" :
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
