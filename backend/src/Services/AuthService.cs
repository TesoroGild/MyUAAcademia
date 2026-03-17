using Microsoft.AspNetCore.Identity;
using MyUAAcademiaB.Interfaces;
using MyUAAcademiaB.Models;

namespace MyUAAcademiaB.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserInterface _userInterface;
        private readonly IEmployeeInterface _employeeInterface;
        private readonly PasswordHasher<string> _passwordHasher = new();

        public AuthService(IUserInterface userInterface, IEmployeeInterface employeeInterface)
        {
            _userInterface = userInterface;
            _employeeInterface = employeeInterface;
        }

        public string HashPassword(string usercode, string password)
        {
            // username peut être utilisé comme "salt unique"
            return _passwordHasher.HashPassword(usercode, password);
        }

        public bool VerifyPassword(string usercode, string hashedPassword, string providedPassword)
        {
            var result = _passwordHasher.VerifyHashedPassword(usercode, hashedPassword, providedPassword);
            return result == PasswordVerificationResult.Success;
        }

        public Users? AuthenticateUser(LoginCredentialsStudent credentials)
        {
            var user = _userInterface.GetUser(credentials.PermanentCode);

            if (user != null)
            {
                //var hashPass = HashPassword(credentials.PermanentCode, credentials.Pwd);
                var areCredentialsValid = VerifyPassword(user.PermanentCode, user.Pwd, credentials.Pwd);

                if (areCredentialsValid) 
                { 
                    return user;
                }
            }
                
            return null;
        }

        public Employees? AutenticateEmployee(LoginCredentials credentials)
        {
            var employee = _employeeInterface.GetEmployee(credentials.Code);

            if (employee != null)
            {
                var areCredentialsValid = VerifyPassword(employee.Code, employee.Pwd, credentials.Pwd);

                if (areCredentialsValid)
                {
                    return employee;
                }
            }
            return null;
        }

        //public async Task<int> UpdatePasswordAsync(ResetPasswordCredentials resetPasswordCredentials)
        //{

        //}
    }
}
