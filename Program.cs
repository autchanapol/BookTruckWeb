using BookTruckWeb.connect;
using BookTruckWeb.Middleware;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews(options =>
{
    options.Filters.Add(new AutoValidateAntiforgeryTokenAttribute());
});

// เชื่อมต่อกับฐานข้อมูลโดยใช้ Connection String
builder.Services.AddDbContext<BookTruckContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);

builder.Services.AddScoped<StoredProcedure>();

// Add Session
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30); // เวลาหมดอายุ Session
    options.Cookie.HttpOnly = true; // ป้องกันการเข้าถึง Cookie ผ่าน JavaScript
    options.Cookie.IsEssential = true; // ทำให้ Session คงอยู่เสมอ
});
builder.Services.AddHttpContextAccessor();
// Uncomment หากต้องการ Authentication/Authorization ในอนาคต
// builder.Services.AddAuthentication("CookieAuthentication")
//     .AddCookie("CookieAuthentication", options =>
//     {
//         options.LoginPath = "/Login/Index"; 
//         options.AccessDeniedPath = "/Login/AccessDenied";
//     });
// builder.Services.AddAuthorization();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseSession(); // เปิดใช้งาน Session Middleware
app.UseMiddleware<SessionCheckMiddleware>(); // ตรวจสอบ Session
app.UseHttpsRedirection();
app.UseStaticFiles(); // ใช้สำหรับให้บริการ Static Files
app.UseRouting(); // ใช้งานระบบ Routing

// Uncomment หากต้องการ Authentication/Authorization
//app.UseAuthentication();
//app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
     pattern: "{controller=Home}/{action=Index}/{id?}");
//pattern: "{controller=Login}/{action=Index}/{id?}");

app.Run();
