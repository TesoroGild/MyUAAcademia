using Microsoft.EntityFrameworkCore;
using MyUAAcademiaB.Dto;
using MyUAAcademiaB.Models;

namespace MyUAAcademiaB.Interfaces
{
    public interface IEmployeeInterface
    {
        bool EmployeeExists(string code);

        /*CREATE*/
        Employees CreateEmployee(Employees employees);

        /*READ*/
        Employees GetEmployee(string code);
        ICollection<Employees> GetEmployees();
        //ICollection<EmployeeV2Dto> GetEmployeesV2();

        /*UPDATE*/
        Task<int> UpdatePasswordAsync(ResetPasswordCredentials resetPasswordCredentials);

        /*DELETE*/
    }
}
