using MyUAAcademiaB.Models;

namespace MyUAAcademiaB.Interfaces
{
    public interface IAuthService
    {
        Users? AuthenticateUser(LoginCredentialsStudent credentials);
        Employees? AutenticateEmployee(LoginCredentials credentials);
        string HashPassword(string usercode, string password);
        //Task<int> UpdatePasswordAsync(ResetPasswordCredentials resetPasswordCredentials);
        bool VerifyPassword(string usercode, string hashedPassword, string providedPassword);
    }
}
