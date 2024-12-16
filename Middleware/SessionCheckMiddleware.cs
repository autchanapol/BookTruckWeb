
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace BookTruckWeb.Middleware
{
    public class SessionCheckMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<SessionCheckMiddleware> _logger;

        public SessionCheckMiddleware(RequestDelegate next, ILogger<SessionCheckMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var path = context.Request.Path.Value;

            // เส้นทางที่ต้องการยกเว้น
            var excludedPaths = new[] { "/Login", "/css", "/js", "/Users/Login", "/img", "/Customers/GetCustomers", "/Menu" };

            if (excludedPaths.Any(path.StartsWith) ||
                context.Request.Headers["Accept"].ToString().Contains("application/json") ||
                context.Request.Headers["X-Requested-With"] == "XMLHttpRequest")
            {
                await _next(context);
                return;
            }

            try
            {
                // ตรวจสอบ Session
                if (string.IsNullOrEmpty(context.Session.GetString("RowId")))
                {
                    _logger.LogWarning("Unauthorized access. Redirecting to login.");

                    if (context.Request.Headers["Accept"].ToString().Contains("application/json"))
                    {
                        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                        await context.Response.WriteAsync("Unauthorized");
                    }
                    else
                    {
                        context.Response.Redirect("/Login/Index");
                    }
                    return;
                }

                _logger.LogInformation($"Path: {path}, Session RowId: {context.Session.GetString("RowId")}");

                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in the SessionCheckMiddleware.");
                context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                await context.Response.WriteAsync("Internal Server Error");
            }
        }
    }
}


//using Microsoft.AspNetCore.Http;
//using System.Threading.Tasks;

//namespace BookTruckWeb.Middleware
//{
//    public class SessionCheckMiddleware
//    {
//        private readonly RequestDelegate _next;

//        public SessionCheckMiddleware(RequestDelegate next)
//        {
//            _next = next;
//        }

//        public async Task InvokeAsync(HttpContext context)
//        {
//            // เส้นทางที่ต้องการยกเว้น
//            var path = context.Request.Path.Value;

//            // อนุญาตให้ผ่านสำหรับเส้นทาง Login, Static Files, หรือ AJAX Requests
//            if (path.StartsWith("/Login") ||
//                path.StartsWith("/css") ||
//                path.StartsWith("/js") ||
//                path.StartsWith("/Users/Login") ||
//                path.StartsWith("/img") || // ยกเว้นเส้นทาง Static Files
//                path.StartsWith("/Customers/GetCustomers") ||
//                context.Request.Headers["X-Requested-With"] == "XMLHttpRequest")
//            {
//                await _next(context); // ให้ดำเนินการต่อ
//                return;
//            }

//            // ตรวจสอบ Session
//            if (string.IsNullOrEmpty(context.Session.GetString("RowId")))
//            {
//                if (context.Request.Headers["Accept"].ToString().Contains("application/json"))
//                {
//                    // สำหรับคำขอ JSON ให้ส่ง Status 401 Unauthorized
//                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
//                    await context.Response.WriteAsync("Unauthorized");
//                }
//                else
//                {
//                    // Redirect ไปหน้า Login
//                    context.Response.Redirect("/Login/Index");
//                }
//                return;
//            }

//            // ดำเนินการ Middleware ถัดไป
//            await _next(context);
//        }
//    }
//}
