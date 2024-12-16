using System;
using System.Collections.Generic;
using BookTruckWeb.Models;
using Microsoft.EntityFrameworkCore;

namespace BookTruckWeb.connect;

public partial class BookTruckContext : DbContext
{
    public BookTruckContext()
    {
    }

    public BookTruckContext(DbContextOptions<BookTruckContext> options)
        : base(options)
    {
    }

    public virtual DbSet<CountJob> CountJobs { get; set; }

    public virtual DbSet<Customer> Customers { get; set; }

    public virtual DbSet<Department> Departments { get; set; }

    public virtual DbSet<Log> Logs { get; set; }

    public virtual DbSet<Menu> Menus { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<RoleMenu> RoleMenus { get; set; }

    public virtual DbSet<Temp> Temps { get; set; }

    public virtual DbSet<Ticket> Tickets { get; set; }

    public virtual DbSet<TypeLoad> TypeLoads { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<Vehicle> Vehicles { get; set; }

    public virtual DbSet<VehiclesType> VehiclesTypes { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Name=DefaultConnection");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CountJob>(entity =>
        {
            entity.HasKey(e => e.RowId);

            entity.ToTable("count_job");

            entity.Property(e => e.RowId).HasColumnName("row_id");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("created_date");
            entity.Property(e => e.Job)
                .HasMaxLength(50)
                .HasColumnName("job");
            entity.Property(e => e.LastUpdate)
                .HasColumnType("datetime")
                .HasColumnName("last_update");
            entity.Property(e => e.Lastnumber).HasColumnName("lastnumber");
            entity.Property(e => e.Month)
                .HasMaxLength(2)
                .HasColumnName("month");
            entity.Property(e => e.Year)
                .HasMaxLength(4)
                .HasColumnName("year");
        });

        modelBuilder.Entity<Customer>(entity =>
        {
            entity.HasKey(e => e.RowId);

            entity.ToTable("customers");

            entity.Property(e => e.RowId).HasColumnName("row_id");
            entity.Property(e => e.Active).HasColumnName("active");
            entity.Property(e => e.Address1)
                .HasMaxLength(255)
                .HasColumnName("address1");
            entity.Property(e => e.Address2)
                .HasMaxLength(255)
                .HasColumnName("address2");
            entity.Property(e => e.Address3)
                .HasMaxLength(255)
                .HasColumnName("address3");
            entity.Property(e => e.City)
                .HasMaxLength(50)
                .HasColumnName("city");
            entity.Property(e => e.CompanyId)
                .HasMaxLength(50)
                .HasColumnName("company_id");
            entity.Property(e => e.Country)
                .HasMaxLength(50)
                .HasColumnName("country");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("created_date");
            entity.Property(e => e.CustomerId)
                .HasMaxLength(50)
                .HasColumnName("customer_id");
            entity.Property(e => e.CustomerName)
                .HasMaxLength(255)
                .HasColumnName("customer_name");
            entity.Property(e => e.PastalCode)
                .HasMaxLength(50)
                .HasColumnName("pastal_code");
            entity.Property(e => e.Remarks)
                .HasMaxLength(255)
                .HasColumnName("remarks");
            entity.Property(e => e.State)
                .HasMaxLength(50)
                .HasColumnName("state");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.UpdatedBy).HasColumnName("updated_by");
            entity.Property(e => e.UpdatedDate)
                .HasColumnType("datetime")
                .HasColumnName("updated_date");
        });

        modelBuilder.Entity<Department>(entity =>
        {
            entity.HasKey(e => e.RowId);

            entity.ToTable("departments");

            entity.Property(e => e.RowId).HasColumnName("row_id");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("created_date");
            entity.Property(e => e.DepartmentName)
                .HasMaxLength(100)
                .HasColumnName("departmentName");
            entity.Property(e => e.Dpn)
                .HasMaxLength(50)
                .HasColumnName("dpn");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.Status1).HasColumnName("status1");
            entity.Property(e => e.UpdatedBy).HasColumnName("updated_by");
            entity.Property(e => e.UpdatedDate)
                .HasColumnType("datetime")
                .HasColumnName("updated_date");
        });

        modelBuilder.Entity<Log>(entity =>
        {
            entity.HasKey(e => e.RowId);

            entity.ToTable("log");

            entity.Property(e => e.RowId).HasColumnName("row_id");
            entity.Property(e => e.Header)
                .HasMaxLength(50)
                .HasColumnName("header");
            entity.Property(e => e.LogDate)
                .HasColumnType("datetime")
                .HasColumnName("log_date");
            entity.Property(e => e.Mesages)
                .HasMaxLength(255)
                .HasColumnName("mesages");
            entity.Property(e => e.UserId).HasColumnName("user_id");
        });

        modelBuilder.Entity<Menu>(entity =>
        {
            entity.HasKey(e => e.RowId);

            entity.ToTable("menus");

            entity.Property(e => e.RowId).HasColumnName("row_id");
            entity.Property(e => e.MenuGroup)
                .HasMaxLength(50)
                .HasColumnName("menu_group");
            entity.Property(e => e.MenuName)
                .HasMaxLength(100)
                .HasColumnName("menu_name");
            entity.Property(e => e.Status).HasColumnName("status");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RowId);

            entity.ToTable("roles");

            entity.Property(e => e.RowId).HasColumnName("row_id");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("created_date");
            entity.Property(e => e.RoleName)
                .HasMaxLength(50)
                .HasColumnName("role_name");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.UpdatedBy).HasColumnName("updated_by");
            entity.Property(e => e.UpdatedDate)
                .HasColumnType("datetime")
                .HasColumnName("updated_date");
        });

        modelBuilder.Entity<RoleMenu>(entity =>
        {
            entity.HasKey(e => e.RowId);

            entity.ToTable("role_menu");

            entity.Property(e => e.RowId).HasColumnName("row_id");
            entity.Property(e => e.MenuId).HasColumnName("menu_id");
            entity.Property(e => e.RoleId).HasColumnName("role_id");
            entity.Property(e => e.Status).HasColumnName("status");
        });

        modelBuilder.Entity<Temp>(entity =>
        {
            entity.HasKey(e => e.RowId).HasName("PK_tamps");

            entity.ToTable("temps");

            entity.Property(e => e.RowId).HasColumnName("row_id");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("created_date");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.TempName)
                .HasMaxLength(50)
                .HasColumnName("temp_name");
            entity.Property(e => e.UpdatedBy).HasColumnName("updated_by");
            entity.Property(e => e.UpdatedDate)
                .HasColumnType("datetime")
                .HasColumnName("updated_date");
        });

        modelBuilder.Entity<Ticket>(entity =>
        {
            entity.HasKey(e => e.RowId);

            entity.ToTable("tickets");

            entity.Property(e => e.RowId).HasColumnName("row_id");
            entity.Property(e => e.ActionBy).HasColumnName("action_by");
            entity.Property(e => e.ActionDate)
                .HasColumnType("datetime")
                .HasColumnName("action_date");
            entity.Property(e => e.Assign).HasColumnName("assign");
            entity.Property(e => e.Backhual).HasColumnName("backhual");
            entity.Property(e => e.Cardboard).HasColumnName("cardboard");
            entity.Property(e => e.Cart).HasColumnName("cart");
            entity.Property(e => e.Cbm)
                .HasColumnType("numeric(18, 2)")
                .HasColumnName("cbm");
            entity.Property(e => e.Comment)
                .HasMaxLength(255)
                .HasColumnName("comment");
            entity.Property(e => e.ConfirmedBy).HasColumnName("confirmed_by");
            entity.Property(e => e.ConfirmedDate)
                .HasColumnType("datetime")
                .HasColumnName("confirmed_date");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("created_date");
            entity.Property(e => e.CustomerId).HasColumnName("customer_id");
            entity.Property(e => e.DeliveryMan).HasColumnName("delivery_man");
            entity.Property(e => e.DepartmentId).HasColumnName("department_id");
            entity.Property(e => e.Destination)
                .HasMaxLength(255)
                .HasColumnName("destination");
            entity.Property(e => e.Distance)
                .HasColumnType("numeric(18, 2)")
                .HasColumnName("distance");
            entity.Property(e => e.Driver)
                .HasMaxLength(100)
                .HasColumnName("driver");
            entity.Property(e => e.DryIce).HasColumnName("dry_ice");
            entity.Property(e => e.Etatostore)
                .HasColumnType("datetime")
                .HasColumnName("etatostore");
            entity.Property(e => e.FoamBox).HasColumnName("foam_box");
            entity.Property(e => e.Handjack).HasColumnName("handjack");
            entity.Property(e => e.JobNo)
                .HasMaxLength(50)
                .HasColumnName("job_no");
            entity.Property(e => e.LastUpdated)
                .HasColumnType("datetime")
                .HasColumnName("last_updated");
            entity.Property(e => e.Loading)
                .HasColumnType("datetime")
                .HasColumnName("loading");
            entity.Property(e => e.Origin)
                .HasMaxLength(255)
                .HasColumnName("origin");
            entity.Property(e => e.Qty)
                .HasColumnType("numeric(18, 2)")
                .HasColumnName("qty");
            entity.Property(e => e.ReceivedBy).HasColumnName("received_by");
            entity.Property(e => e.ReceivedDate)
                .HasColumnType("datetime")
                .HasColumnName("received_date");
            entity.Property(e => e.ReqestedBy).HasColumnName("reqested_by");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.StatusOperation).HasColumnName("status_operation");
            entity.Property(e => e.Sub)
                .HasMaxLength(50)
                .HasColumnName("sub");
            entity.Property(e => e.Tel)
                .HasMaxLength(50)
                .HasColumnName("tel");
            entity.Property(e => e.TempId).HasColumnName("temp_id");
            entity.Property(e => e.TravelCosts)
                .HasColumnType("numeric(18, 2)")
                .HasColumnName("travel_costs");
            entity.Property(e => e.TypeloadId).HasColumnName("typeload_id");
            entity.Property(e => e.UpdatedBy).HasColumnName("updated_by");
            entity.Property(e => e.VehiclesId).HasColumnName("vehicles_id");
            entity.Property(e => e.VehiclesTypeId).HasColumnName("vehicles_type_id");
            entity.Property(e => e.Weight)
                .HasColumnType("numeric(18, 2)")
                .HasColumnName("weight");
        });

        modelBuilder.Entity<TypeLoad>(entity =>
        {
            entity.HasKey(e => e.RowId);

            entity.ToTable("typeLoad");

            entity.Property(e => e.RowId).HasColumnName("row_id");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("created_date");
            entity.Property(e => e.LoadName)
                .HasMaxLength(50)
                .HasColumnName("load_name");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.UpdatedBy).HasColumnName("updated_by");
            entity.Property(e => e.UpdatedDate)
                .HasColumnType("datetime")
                .HasColumnName("updated_date");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.RowId);

            entity.ToTable("users");

            entity.Property(e => e.RowId).HasColumnName("row_id");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("created_date");
            entity.Property(e => e.DepartmentId).HasColumnName("department_id");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .HasColumnName("email");
            entity.Property(e => e.FirstName)
                .HasMaxLength(50)
                .HasColumnName("firstName");
            entity.Property(e => e.IdEmployee)
                .HasMaxLength(50)
                .HasColumnName("id_employee");
            entity.Property(e => e.Image).HasMaxLength(255);
            entity.Property(e => e.LastName)
                .HasMaxLength(50)
                .HasColumnName("lastName");
            entity.Property(e => e.Password)
                .HasMaxLength(100)
                .HasColumnName("password");
            entity.Property(e => e.Phone)
                .HasMaxLength(10)
                .HasColumnName("phone");
            entity.Property(e => e.RoleId).HasColumnName("role_id");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.UpdatedBy).HasColumnName("updated_by");
            entity.Property(e => e.UpdatedDate)
                .HasColumnType("datetime")
                .HasColumnName("updated_date");
            entity.Property(e => e.Username)
                .HasMaxLength(50)
                .HasColumnName("username");
        });

        modelBuilder.Entity<Vehicle>(entity =>
        {
            entity.HasKey(e => e.RowId);

            entity.ToTable("vehicles");

            entity.Property(e => e.RowId).HasColumnName("row_id");
            entity.Property(e => e.Active).HasColumnName("active");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("created_date");
            entity.Property(e => e.CubeCapacity)
                .HasColumnType("numeric(18, 2)")
                .HasColumnName("cube_capacity");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.UpdatedBy).HasColumnName("updated_by");
            entity.Property(e => e.UpdatedDate)
                .HasColumnType("datetime")
                .HasColumnName("updated_date");
            entity.Property(e => e.VehicleLicense)
                .HasMaxLength(50)
                .HasColumnName("vehicle_license");
            entity.Property(e => e.VehicleName)
                .HasMaxLength(50)
                .HasColumnName("vehicle_name");
            entity.Property(e => e.VehicleType).HasColumnName("vehicle_type");
            entity.Property(e => e.WeightCapacity)
                .HasColumnType("numeric(18, 2)")
                .HasColumnName("weight_capacity");
            entity.Property(e => e.WeightEmpty)
                .HasColumnType("numeric(18, 2)")
                .HasColumnName("weight_empty");
        });

        modelBuilder.Entity<VehiclesType>(entity =>
        {
            entity.HasKey(e => e.RowId);

            entity.ToTable("vehicles_type");

            entity.Property(e => e.RowId).HasColumnName("row_id");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("created_date");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.UpdatedBy).HasColumnName("updated_by");
            entity.Property(e => e.UpdatedDate)
                .HasColumnType("datetime")
                .HasColumnName("updated_date");
            entity.Property(e => e.VehicleTypeName)
                .HasMaxLength(50)
                .HasColumnName("vehicleType_name");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
