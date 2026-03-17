using Microsoft.EntityFrameworkCore;
using MyUAAcademiaB.Data;
using MyUAAcademiaB.Interfaces;
using MyUAAcademiaB.Models;

namespace MyUAAcademiaB.Repository
{
    public class EmployeeRepository : IEmployeeInterface
    {
        private readonly DataContext _context;
        public EmployeeRepository(DataContext context)
        {
            _context = context;
        }

        public bool EmployeeExists(string code)
        {
            return _context.Employees.Any(e => e.Code == code);
        }

        /*CREATE*/
        public Employees CreateEmployee(Employees employees)
        {
            _context.Add(employees);
            _context.SaveChanges();
            return employees;
        }


        /*READ*/
        public Employees GetEmployee(string code) 
        {
            return _context.Employees.Where(e => e.Code.ToUpper() == code.ToUpper())
                .FirstOrDefault();
        }

        public ICollection<Employees> GetEmployees()
        {
            return _context.Employees
                .OrderBy(u => u.LastName)
                .ToList();
        }


        /*UPDATE*/
        public async Task<int> UpdatePasswordAsync(ResetPasswordCredentials resetPasswordCredentials)
        {
            var employee = await _context.Employees
                .FirstOrDefaultAsync(u => u.Code == resetPasswordCredentials.UserCode);

            if (employee == null)
                return 0; // utilisateur introuvable

            employee.Pwd = resetPasswordCredentials.NewPwd;
            //employee.UpdatedAt = DateTime.UtcNow;

            return await _context.SaveChangesAsync();
        }


        /*DELETE*/
    }
}
