using Microsoft.EntityFrameworkCore;
using MyUAAcademiaB.Models;

namespace MyUAAcademiaB.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }
        
        public DbSet<Bills> Bills { get; set; }
        public DbSet<Bulletins> Bulletins { get; set; }
        public DbSet<Classes> Classes { get; set; }
        public DbSet<ClassesCourses> ClassesCourses { get; set; }
        public DbSet<Contracts> Contracts {  get; set; }
        public DbSet<Courses> Courses { get; set; }
        public DbSet<Employees> Employees { get; set; }
        public DbSet<EmployeesContracts> EmployeesContracts { get; set; }
        public DbSet<Programs> Programs { get; set; }
        public DbSet<StudentFiles> StudentFiles { get; set; }
        public DbSet<Users> Users { get; set; }
        public DbSet<UserCourse> UserCourses { get; set; }
        public DbSet<UserProgramEnrollment> UserProgramEnrollments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            var isDevEnv = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development";
            if (!isDevEnv)
            {
                modelBuilder.HasDefaultSchema("myuaacademia");
            }
            /*BILLS*/
            modelBuilder.Entity<Bills>()
                .HasKey(bi => new { bi.SessionStudy, bi.YearStudy, bi.PermanentCode });//, bi.ProgramTitle
            modelBuilder.Entity<Bills>()
                .HasOne(b => b.Student)
                .WithMany(s => s.Bills)
                .HasForeignKey(b => b.PermanentCode)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Bills>()
                .HasOne(b => b.Program)
                .WithMany(p => p.Bills)
                .HasForeignKey(b => b.ProgramTitle)
                .OnDelete(DeleteBehavior.Restrict);

            /*BULLETINS*/
            modelBuilder.Entity<Bulletins>()
                .HasKey(bu => new { bu.Sigle, bu.PermanentCode });
            modelBuilder.Entity<Bulletins>()
                .HasOne(b => b.Student)
                .WithMany(s => s.Bulletins)
                .HasForeignKey(b => b.PermanentCode)
                .OnDelete(DeleteBehavior.Restrict);

            /*CLASSES*/
            modelBuilder.Entity<Classes>()
                .HasKey(cl => cl.ClasseName);
            if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development")
            {
                modelBuilder.Entity<Classes>()
                    .Property(cl => cl.EmployeeCode)
                    .UseCollation("SQL_Latin1_General_CP1_CS_AS");
            }
            else
            {
                modelBuilder.Entity<Classes>()
                    .Property(cl => cl.EmployeeCode);
            }

            /*CONTRACTS*/
            modelBuilder.Entity<Contracts>()
                .HasKey(ctr => ctr.Code);

            /*COURSES*/
            modelBuilder.Entity<Courses>()
                .HasKey(co => co.Sigle);
            modelBuilder.Entity<Courses>()
                .HasOne(c => c.Program)
                .WithMany(p => p.Courses)
                .HasForeignKey(c => c.ProgramTitle)
                .OnDelete(DeleteBehavior.Restrict);
            if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development")
            {
                modelBuilder.Entity<Courses>()
                    .Property(c => c.EmployeeCode)
                    .UseCollation("SQL_Latin1_General_CP1_CS_AS");
            }
            else
            {
                modelBuilder.Entity<Courses>()
                    .Property(c => c.EmployeeCode);
            }

            /*CLASSES-COURSES*/
            modelBuilder.Entity<ClassesCourses>()
                .HasKey(cc => cc.Id);
            modelBuilder.Entity<ClassesCourses>()
                .HasOne(cc => cc.Classe)
                .WithMany(cl => cl.ClassesCourses)
                .HasForeignKey(cc => cc.ClasseName)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<ClassesCourses>()
                .HasOne(cc => cc.Course)
                .WithMany(co => co.ClassesCourses)
                .HasForeignKey(cc => cc.CourseSigle)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<ClassesCourses>()
                .HasIndex(cc => new { cc.ClasseName, cc.StartTime, cc.Jours, cc.SessionCourse, cc.YearCourse })
                .IsUnique();
            modelBuilder.Entity<ClassesCourses>()
                .HasOne(cc => cc.Employee)
                .WithMany(e => e.ClassesCourses)
                .HasForeignKey(cc => cc.EmployeeCode)
                .OnDelete(DeleteBehavior.Restrict);
            if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development")
            {
                modelBuilder.Entity<ClassesCourses>()
                    .Property(cc => cc.EmployeeCode)
                    .UseCollation("SQL_Latin1_General_CP1_CS_AS");
            }
            else
            {
                modelBuilder.Entity<ClassesCourses>()
                    .Property(cc => cc.EmployeeCode);
            }
            //Ajout de prof
            modelBuilder.Entity<ClassesCourses>()
                .HasOne(cc => cc.TaughtByProfessor)
                .WithMany(e => e.TaughtCourses)
                .HasForeignKey(cc => cc.TaughtBy)
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired(false);
            if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development")
            {
                modelBuilder.Entity<ClassesCourses>()
                    .Property(cc => cc.TaughtBy)
                    .UseCollation("SQL_Latin1_General_CP1_CS_AS");
            }
            else
            {
                modelBuilder.Entity<ClassesCourses>()
                    .Property(cc => cc.TaughtBy);
            }
            // Contrainte salle : jamais 2 cours en même temps dans la même salle
            modelBuilder.Entity<ClassesCourses>()
                .HasIndex(cc => new { cc.ClasseName, cc.StartTime, cc.Jours, cc.SessionCourse, cc.YearCourse })
                .IsUnique();
            // Contrainte prof : un prof ne peut pas être à 2 endroits en même temps
            modelBuilder.Entity<ClassesCourses>()
                .HasIndex(cc => new { cc.TaughtBy, cc.StartTime, cc.Jours, cc.SessionCourse, cc.YearCourse })
                .IsUnique();

            /*EMPLOYEES*/
            modelBuilder.Entity<Employees>()
                .HasKey(e => e.Code);
            modelBuilder.Entity<Employees>()
                .HasOne(u => u.CreatedBy)
                .WithMany(u => u.CreatedEmployees)
                .HasForeignKey(u => u.CreatedByCode);
            if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development")
            {
                modelBuilder.Entity<Employees>()
                    .Property(e => e.Code)
                    .UseCollation("SQL_Latin1_General_CP1_CS_AS");
                modelBuilder.Entity<Employees>()
                    .Property(e => e.CreatedByCode)
                    .UseCollation("SQL_Latin1_General_CP1_CS_AS");
            }
            else
            {
                modelBuilder.Entity<Employees>()
                    .Property(e => e.Code);
                modelBuilder.Entity<Employees>()
                    .Property(e => e.CreatedByCode);
            }

            /*EMPLOYEES-CONTRACTS*/
            modelBuilder.Entity<EmployeesContracts>()
                .HasKey(ec => new { ec.EmpCode, ec.ContractCode });
            modelBuilder.Entity<EmployeesContracts>()
                .HasOne(ec => ec.Employee)
                .WithMany(e => e.EmployeesContracts)
                .HasForeignKey(ec => ec.EmpCode)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<EmployeesContracts>()
                .HasOne(ec => ec.Contract)
                .WithMany(c => c.EmployeesContracts)
                .HasForeignKey(ec => ec.ContractCode);
            if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development")
            {
                modelBuilder.Entity<EmployeesContracts>()
                    .Property(ec => ec.EmpCode)
                    .UseCollation("SQL_Latin1_General_CP1_CS_AS");
            }
            else
            {
                modelBuilder.Entity<EmployeesContracts>()
                    .Property(ec => ec.EmpCode);
            }
            modelBuilder.Entity<EmployeesContracts>()
                .HasIndex(ec => new  { ec.EmpCode })
                .IsUnique()
                .HasFilter(isDevEnv
                    ? "[IsContractOver] = 0"
                    : "\"is_contract_over\" = false");

            /*PROGRAMS*/
            modelBuilder.Entity<Programs>()
                .HasKey(p => p.Title);
            if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development")
            {
                modelBuilder.Entity<Programs>()
                    .Property(p => p.EmployeeCode)
                    .UseCollation("SQL_Latin1_General_CP1_CS_AS");
            }
            else
            {
                modelBuilder.Entity<Programs>()
                    .Property(p => p.EmployeeCode);
            }

            /*STUDENT-FILES*/
            modelBuilder.Entity<StudentFiles>()
                .HasKey(sf => sf.FileCode);

            /*USER-COURSES*/
            modelBuilder.Entity<UserCourse>()
                .HasKey(uc => uc.Id);
            modelBuilder.Entity<UserCourse>()
                .HasOne(uc => uc.Student)
                .WithMany(s => s.UserCourses)
                .HasForeignKey(uc => uc.PermanentCode);
            modelBuilder.Entity<UserCourse>()
                .HasOne(uc => uc.ClassesCourses)
                .WithMany(cc => cc.UserCourse)
                .HasForeignKey(uc => uc.CCourseId);

            /*USER-PROGRAM-ENROLLMENT*/
            modelBuilder.Entity<UserProgramEnrollment>()
                .HasKey(up => new {up.PermanentCode, up.Title});
            modelBuilder.Entity<UserProgramEnrollment>()
                .HasOne(up => up.Student)
                .WithMany(u => u.UserProgramEnrollments)
                .HasForeignKey(up => up.PermanentCode)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<UserProgramEnrollment>()
                .HasOne(up => up.Programs)
                .WithMany(p => p.UserProgramEnrollments)
                .HasForeignKey(up => up.Title);

            /*USERS*/
            modelBuilder.Entity<Users>()
                .HasKey(cl => cl.PermanentCode);
            if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development")
            {
                modelBuilder.Entity<Users>()
                    .Property(cl => cl.EmployeeCode)
                    .UseCollation("SQL_Latin1_General_CP1_CS_AS");
            }
            else
            {
                modelBuilder.Entity<Users>()
                    .Property(cl => cl.EmployeeCode);
            }
        }
    }
}
