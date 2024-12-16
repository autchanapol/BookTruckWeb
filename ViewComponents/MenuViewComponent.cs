using Microsoft.AspNetCore.Mvc;
using BookTruckWeb.Models.DTO;
using System.Linq;
using System.Threading.Tasks;
using BookTruckWeb.connect;
using Microsoft.EntityFrameworkCore;

namespace BookTruckWeb.ViewComponents
{
    public class MenuViewComponent : ViewComponent
    {
        private readonly BookTruckContext _context;

        public MenuViewComponent(BookTruckContext context)
        {
            _context = context;
        }
        public async Task<IViewComponentResult> InvokeAsync()
        {
            var rowId = HttpContext.Session.GetString("RowId");
            if (string.IsNullOrEmpty(rowId))
            {
                return View(Enumerable.Empty<MenuViewModel>()); // ส่งค่าเมนูว่างกลับไป
            }

            var menus = await (from role in _context.Roles
                               join uss in _context.Users on role.RowId equals uss.RoleId
                               join role_menu in _context.RoleMenus on role.RowId equals role_menu.RoleId
                               join menu in _context.Menus on role_menu.MenuId equals menu.RowId
                               where uss.RowId.ToString() == rowId
                               select new MenuViewModel
                               {
                                   MenuGroup = menu.MenuGroup,
                                   MenuName = menu.MenuName,
                                   Controller = GetController(menu.MenuName), // เรียก static method
                                   Action = GetAction(menu.MenuName),         // เรียก static method
                                   Icon = GetIcon(menu.MenuName) // เรียกใช้ไอคอนจากฟังก์ชัน
                               }).ToListAsync();

            return View(menus);
        }

        // ฟังก์ชันตัวอย่างเพื่อ Mapping เมนูชื่อไปยัง Controller/Action
        private static string GetController(string menuName)
        {
            return menuName switch
            {
                "Deahboard" => "Home",
                "Vehicle booking request" => "Operation",
                "Receiveing Booking" => "Operation",
                "Customers" => "Master",
                "Truck Type" => "Master",
                "Temp" => "Master",
                "Load Type" => "Master",
                "Vehicles" => "Master",
                "Departmens" => "Admin",
                "Roles" => "Admin",
                "Users" => "Admin",
                _ => "Home",
            };
        }

        private static string GetIcon(string menuName)
        {
            return menuName switch
            {
                "Dashboard" => "fas fa-home",
                "Vehicle booking request" => "icon-note",
                "Receiving booking" => "icon-book-open",
                "Customers" => "icon-people",
                "Truck Type" => "icon-grid",
                "Temp" => "icon-grid",
                "Load Type" => "bi bi-car-front",
                "Vehicles" => "bi bi-car-front",
                "Departments" => "icon-social-dropbox",
                "Roles" => "icon-layers",
                "Users" => "icon-user",
                _ => "fas fa-circle"
            };
        }

        private static string GetAction(string menuName)
        {
            return menuName switch
            {
                "Deahboard" => "Index",
                "Vehicle booking request" => "BookingRequest",
                "Receiveing Booking" => "ReceivingBooking",
                "Customers" => "Customers",
                "Truck Type" => "TruckType",
                "Temp" => "Temp",
                "Load Type" => "LoadType",
                "Vehicles" => "Vehicles",
                "Departmens" => "Departments",
                "Roles" => "Roles",
                "Users" => "Users",
                _ => "Index",
            };
        }

    }
}
