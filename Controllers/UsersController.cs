using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using BookTruckWeb.Models;
using BookTruckWeb.connect;
using BookTruckWeb.fuc;

namespace BookTruckWeb.Controllers
{
    [Route("Users")]
    public class UsersController : Controller
    {
        private readonly BookTruckContext _context;

        public UsersController(BookTruckContext context)
        {
            _context = context;
        }

        // GET: Users
        public async Task<IActionResult> Index()
        {
            return _context.Users != null ?
                        View(await _context.Users.ToListAsync()) :
                        Problem("Entity set 'BookTruckContext.Users'  is null.");
        }


        [HttpPost("GetUsers")] // ใช้ POST เพื่อรองรับ Anti-Forgery Token
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> GetUsers()
        {
            Function function = new Function();
            var userData = await (from users in _context.Users
                                  join dep in _context.Departments on users.DepartmentId equals dep.RowId
                                  join role in _context.Roles on users.RoleId equals role.RowId
                                  where users.Status == 1
                                  select new
                                  {
                                      users.IdEmployee,
                                      users.RowId,
                                      users.Username,
                                      users.FirstName,
                                      users.LastName,
                                      users.Email,
                                      users.Phone,
                                      users.Status,
                                      users.DepartmentId,
                                      Password = Function.Decrypt(users.Password),
                                      users.RoleId,
                                      dep.DepartmentName,
                                      role.RoleName
                                  }).ToListAsync();

            return Ok(userData);
        }

        [HttpPost("InsertUsers")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> InsertUsers([FromBody] User user)
        {
            if (user != null)
            {
                var userExists = await _context.Users.AnyAsync(us => us.Username == user.Username);
                if (userExists)
                {
                    var returnData = new
                    {
                        status = false,
                        code = -2,
                        message = "Duplicate name, cannot be added."
                    };
                    return Ok(returnData);
                }
                var newUser = new User()
                {
                    Username = user.Username,
                    Password = Function.Encrypt(user.Password),
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Status = 1,
                    Email = user.Email,
                    Phone = user.Phone,
                    CreatedDate = DateTime.Now,
                    CreatedBy = 1,
                    RoleId = user.RoleId,
                    DepartmentId = user.DepartmentId,
                    IdEmployee = user.IdEmployee
                };
                try
                {
                    _context.Users.Add(newUser);
                    await _context.SaveChangesAsync();
                    var returnData = new
                    {
                        status = true,
                        code = 0,
                        message = "User inserted successfully.",
                        userId = newUser.RowId
                    };
                    return Ok(returnData);

                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal server error: {ex.Message}");
                }
            }
            else
            {
                var returnData = new
                {
                    status = false,
                    code = -1,
                    message = "No Data Input"
                };
                return Ok(returnData);

            }
        }

        [HttpPost("UpdateUsers")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateUsers([FromBody] User user)
        {
            if (user == null)
            {
                return BadRequest("Invalid Data.");
            }
            else if (user.RowId == 0)
            {
                return BadRequest("Invalid Row Id.");
            }
            else
            {
                var existingUser = await _context.Users.FirstOrDefaultAsync(users => users.RowId == user.RowId && users.Status == 1);
                if (existingUser == null)
                {
                    return NotFound("User not found or status is not active");
                }
                if (!string.IsNullOrEmpty(user.IdEmployee))
                {
                    existingUser.IdEmployee = user.IdEmployee;
                }
                // do not update username !!
                //if (!string.IsNullOrEmpty(user.Username)) 
                //{
                //    existingUser.Username = user.Username;
                //}
                if (!string.IsNullOrEmpty(user.Password))
                {
                    existingUser.Password = Function.Encrypt(user.Password);
                }
                if (!string.IsNullOrEmpty(user.Email))
                {
                    existingUser.Email = user.Email;
                }
                if (!string.IsNullOrEmpty(user.FirstName))
                {
                    existingUser.FirstName = user.FirstName;
                }
                if (!string.IsNullOrEmpty(user.LastName))
                {
                    existingUser.LastName = user.LastName;
                }
                if (!string.IsNullOrEmpty(user.Phone))
                {
                    existingUser.Phone = user.Phone;
                }
                if (user.DepartmentId.HasValue)
                {
                    existingUser.DepartmentId = user.DepartmentId.Value;
                }
                if (user.RoleId.HasValue)
                {
                    existingUser.RoleId = user.RoleId.Value;
                }
                if (user.Status.HasValue)
                {
                    existingUser.Status = user.Status.Value;
                }
                existingUser.UpdatedDate = DateTime.Now;
                existingUser.UpdatedBy = 1;
                try
                {
                    await _context.SaveChangesAsync();
                    return Ok(new
                    {
                        status = true,
                        message = "Bed updated successfully.",
                        UserId = existingUser.RowId
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
