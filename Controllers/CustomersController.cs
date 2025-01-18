using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using BookTruckWeb.Models;
using BookTruckWeb.connect;
using Microsoft.IdentityModel.Tokens;

namespace BookTruckWeb.Controllers
{
    [Route("Customers")]
    public class CustomersController : Controller
    {
        private readonly BookTruckContext _context;

        public CustomersController(BookTruckContext context)
        {
            _context = context;
        }

        [HttpPost("GetCustomers")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> GetCustomers()
        {
            var customer = await (from customers in _context.Customers
                                  where customers.Status == 1
                                  select new
                                  {
                                      customers.RowId,
                                      customers.CustomerId,
                                      customers.CompanyId,
                                      customers.CustomerName,
                                      customers.Status,
                                      customers.Active
                                  }).ToListAsync();
            return Ok(customer);
        }

        [HttpPost("GetCustomersRowId")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> GetCustomersRowId([FromBody] Customer request)
        {
            // ตรวจสอบค่า RowId
            if (request.RowId <= 0)
            {
                return BadRequest(new { message = "Invalid RowId" });
            }
            // ดึงข้อมูลจากฐานข้อมูล
            var customer = await (from customers in _context.Customers
                                  where customers.Status == 1 && customers.RowId == request.RowId
                                  select new
                                  {
                                      customers.RowId,
                                      customers.CustomerId,
                                      customers.CustomerName,
                                      customers.Status,
                                      customers.Active,
                                      customers.CompanyId,
                                      customers.Address1,
                                      customers.Address2,
                                      customers.Address3,
                                      customers.City,
                                      customers.State,
                                      customers.Country,
                                      customers.PastalCode,
                                      customers.Remarks
                                  }).FirstOrDefaultAsync();

            // ตรวจสอบว่าพบข้อมูลหรือไม่
            if (customer == null)
            {
                return NotFound(new { message = "Customer not found." });
            }

            // ส่งข้อมูลกลับในรูปแบบ JSON
            return Ok(customer);
        }

        [HttpPost("GetCustomersWhereId")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> GetCustomersWhereId([FromBody] Customer request)
        {
            // ตรวจสอบค่า RowId
            if (string.IsNullOrEmpty(request.CustomerId))
            {
                return BadRequest(new { status = "error", message = "Invalid CustomerId" });
            }

            var customers = await (from customer in _context.Customers
                                   where  customer.CustomerId.Contains(request.CustomerId) 
                                   && customer.Status == 1
                                   select new
                                   {
                                       customer.RowId,
                                       customer.CustomerId,
                                       customer.CustomerName,
                                   }
                                   ).ToListAsync();
            // ตรวจสอบว่าพบข้อมูลหรือไม่
            if (customers == null)
            {
                return Ok(new { status = "error", message = "Customer not found." });
            }

            // ส่งข้อมูลกลับพร้อม status
            return Ok(new
            {
                status = "success",
                message = "Customer found.",
                data = customers
            });
        }

        [HttpPost("AddCustomers")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AddCustomers([FromBody] Customer customer)
        {
            if (customer == null)
            {
                return BadRequest("Invalid Data");
            }
            else
            {
                var newCustomers = new Customer
                {
                    CustomerId = customer.CustomerId,
                    CustomerName = customer.CustomerName,
                    CompanyId = customer.CompanyId,
                    Address1 = customer.Address1,
                    Address2 = customer.Address2,
                    Address3 = customer.Address3,
                    City = customer.City,
                    State = customer.State,
                    Country = customer.Country,
                    PastalCode = customer.PastalCode,
                    Remarks = customer.Remarks,
                    Active = customer.Active,
                    Status = 1,
                    CreatedBy = 1,
                    CreatedDate = DateTime.Now

                };
                try
                {
                    _context.Customers.Add(newCustomers);
                    await _context.SaveChangesAsync();
                    var returnData = new
                    {
                        status = true,
                        code = 0,
                        message = "Customers inserted successfully.",
                        typeloadId = newCustomers.RowId
                    };
                    return Ok(returnData);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal server error: {ex.Message}");
                }
            }
        }
        [HttpPost("EditCustomers")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> EditCustomers([FromBody] Customer customer)
        {
            if (customer == null)
            {
                return BadRequest("Invalid Data");
            }
            else
            {
                var existingCustomer = await _context.Customers.FirstOrDefaultAsync(cus => cus.RowId == customer.RowId && cus.Status == 1);
                if (existingCustomer == null)
                {
                    return NotFound("Customer not found or status is not active");
                }
                else
                {
                    if (!string.IsNullOrEmpty(customer.CustomerName))
                    {
                        existingCustomer.CustomerName = customer.CustomerName;
                    }
                    if (!string.IsNullOrEmpty(customer.CustomerId))
                    {
                        existingCustomer.CustomerId = customer.CustomerId;
                    }
                    if (!string.IsNullOrEmpty(customer.Country))
                    {
                        existingCustomer.Country = customer.Country;
                    }
                    if (!string.IsNullOrEmpty(customer.CompanyId))
                    {
                        existingCustomer.CompanyId = customer.CompanyId;
                    }
                    if (!string.IsNullOrEmpty(customer.Address1))
                    {
                        existingCustomer.Address1 = customer.Address1;
                    }
                    if (!string.IsNullOrEmpty(customer.Address2))
                    {
                        existingCustomer.Address2 = customer.Address2;
                    }
                    if (!string.IsNullOrEmpty(customer.Address3))
                    {
                        existingCustomer.Address3 = customer.Address3;
                    }
                    if (!string.IsNullOrEmpty(customer.City))
                    {
                        existingCustomer.City = customer.City;
                    }
                    if (!string.IsNullOrEmpty(customer.State))
                    {
                        existingCustomer.State = customer.State;
                    }
                    if (!string.IsNullOrEmpty(customer.PastalCode))
                    {
                        existingCustomer.PastalCode = customer.PastalCode;
                    }
                    if (customer.Active.HasValue)
                    {
                        existingCustomer.Active = customer.Active.Value;
                    }
                    if (customer.Status.HasValue)
                    {
                        existingCustomer.Status = customer.Status.Value;
                    }
                    existingCustomer.UpdatedBy = 1;
                    existingCustomer.UpdatedDate = DateTime.Now;

                    try
                    {
                        await _context.SaveChangesAsync();
                        return Ok(new
                        {
                            status = true,
                            message = "Customer updated successfully.",
                            UserId = existingCustomer.RowId
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
