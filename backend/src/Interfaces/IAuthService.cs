using MyUAAcademiaB.Models;

namespace MyUAAcademiaB.Interfaces
{
    public interface IAuthService
    {
        AuthResponse AuthenticateUser(LoginCredentialsStudent credentials);
        AuthResponse AuthenticateEmployee(LoginCredentials credentials);
        string HashPassword(string usercode, string password);
        //Task<int> UpdatePasswordAsync(ResetPasswordCredentials resetPasswordCredentials);
        //bool VerifyPassword(string usercode, string hashedPassword, string providedPassword);
    }
}
