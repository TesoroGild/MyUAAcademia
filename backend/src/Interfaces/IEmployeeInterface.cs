using Microsoft.EntityFrameworkCore;
using MyUAAcademiaB.Dto;
using MyUAAcademiaB.Models;

namespace MyUAAcademiaB.Interfaces
{
    public interface IEmployeeInterface
    {
        bool EmployeeExists(string code);
        bool EmployeeExistsV1(string code, string email);

        /*CREATE*/
        Employees CreateEmployee(Employees employees);
        EmployeesContracts CreateUserContract(EmployeesContracts employeeContract);

        /*READ*/
        Employees GetEmployee(string code);
        ICollection<Employees> GetEmployees();
        Employees GetUserForReset(ResetCredentialsDto resetCredentials);
        //ICollection<EmployeeV2Dto> GetEmployeesV2();

        /*UPDATE*/
        Task<int> UpdatePasswordAsync(ResetPasswordCredentials resetPasswordCredentials);
        bool ActivateEmployeeAccount(ActivationRequest activationRequest);
        bool ValidateEmployeeAccount(ValidationRequest validationRequest);
        Employees UpdateEmployee(EmployeeTU eltsToUpdate);

        /*DELETE*/
    }
}
