using BookTruckWeb.connect;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews(options =>
{
    // เปิดการตรวจสอบ Anti-Forgery Token อัตโนมัติ
    //options.Filters.Add(new AutoValidateAntiforgeryTokenAttribute());
});



// เชื่อมต่อกับฐานข้อมูลโดยใช้ Connection String
builder.Services.AddDbContext<BookTruckContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);


var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles(); // ใช้สำหรับให้บริการ Static Files เช่น HTML, CSS, JS

app.UseRouting(); // ใช้งานระบบ Routing

// ใช้ Authentication/Authorization (ถ้ามี)
app.UseAuthentication();
app.UseAuthorization();


app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
