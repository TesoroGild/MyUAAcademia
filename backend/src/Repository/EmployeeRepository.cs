using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MyUAAcademiaB.Data;
using MyUAAcademiaB.Dto;
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

        public bool EmployeeExistsV1(string code, string email) 
        {
            return _context.Employees.Any(e => e.Code == code && e.PersonalEmail == email);
        }

        /*CREATE*/
        public Employees CreateEmployee(Employees employees)
        {
            _context.Add(employees);
            _context.SaveChanges();
            return employees;
        }

        public EmployeesContracts CreateUserContract(EmployeesContracts employeeContract)
        {
            _context.EmployeesContracts.Add(employeeContract);
            _context.SaveChanges();
            return employeeContract;
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

        public Employees GetUserForReset(ResetCredentialsDto resetCredentials)
        {
            return _context.Employees.SingleOrDefault(e => e.Code == resetCredentials.Code && e.PersonalEmail == resetCredentials.Email);
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

        public bool ActivateEmployeeAccount(ActivationRequest activationRequest)
        {
            var employee = GetEmployee(activationRequest.Code);
            var activeAccount = 0;

            if (activationRequest.IsActivate) activeAccount = 1;
            else activeAccount = 0;

            if (employee != null)
            {
                employee.IsActivated = activeAccount;
                _context.Employees.Update(employee);
                _context.SaveChanges();
                return true;
            }
            return false;
        }

        public bool ValidateEmployeeAccount(ValidationRequest validationRequest)
        {
            var employee = GetEmployee(validationRequest.Code);
            int validateAccount;
            if (validationRequest.IsValidated) validateAccount = 1;
            else validateAccount = 0;

            if (employee != null)
            {
                employee.UserStatus = validateAccount+"";
                _context.Employees.Update(employee);
                _context.SaveChanges();
                return true;
            }
            return false;
        }

        public Employees UpdateEmployee(EmployeeTU eltsToUpdate)
        {
            var employee = GetEmployee(eltsToUpdate.Code);

            if (employee != null)
            {
                if (!string.IsNullOrWhiteSpace(eltsToUpdate.PhoneNumber))
                {
                    employee.PhoneNumber = eltsToUpdate.PhoneNumber;
                }
                if (!string.IsNullOrWhiteSpace(eltsToUpdate.Pwd))
                {
                    employee.Pwd = eltsToUpdate.Pwd;
                }
                if (!string.IsNullOrWhiteSpace(eltsToUpdate.FirstName))
                {
                    employee.FirstName = eltsToUpdate.FirstName;
                }
                if (!string.IsNullOrWhiteSpace(eltsToUpdate.LastName))
                {
                    employee.LastName = eltsToUpdate.LastName;
                }

                _context.Employees.Update(employee);
                _context.SaveChanges();
            }
            return employee;
        }

        /*DELETE*/
    }
}
