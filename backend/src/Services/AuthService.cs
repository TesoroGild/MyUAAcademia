using Microsoft.AspNetCore.Identity;
using MyUAAcademiaB.Enums;
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

        //public PasswordCheckResult VerifyPassword(string usercode, string hashedPassword, string providedPassword)
        //{
        //    try
        //    {
        //        var result = _passwordHasher.VerifyHashedPassword(usercode, hashedPassword, providedPassword);

        //        if (result == PasswordVerificationResult.Success)
        //            return PasswordCheckResult.Success;

        //        return PasswordCheckResult.InvalidCredentials;
        //    }
        //    catch (Exception ex)
        //    {
        //        // On log l'erreur ici pour le debug à Montréal
        //        Console.WriteLine($"Erreur hashage : {ex.Message}");
        //        return PasswordCheckResult.ServerError;
        //    }
        //}

        public AuthResponse AuthenticateUser(LoginCredentialsStudent credentials)
        {
            try
            {
                var user = _userInterface.GetUser(credentials.PermanentCode);

                // Sécurité : On ne dit pas si c'est le code ou le mdp qui est faux
                if (user == null)
                {
                    return new AuthResponse { StatusCode = 400, ErrorMessage = "Identifiants invalides." };
                }

                var result = _passwordHasher.VerifyHashedPassword(user.PermanentCode, user.Pwd, credentials.Pwd);

                if (result == PasswordVerificationResult.Success)
                {
                    return new AuthResponse { User = user, StatusCode = 200 };
                }

                return new AuthResponse { StatusCode = 400, ErrorMessage = "Identifiants invalides." };
            }
            catch (Exception ex)
            {
                // Ici, quelque chose a vraiment mal tourné (BD offline, erreur de hashage, etc.)
                Console.WriteLine($"[CRITICAL] Auth Error: {ex.Message}");
                return new AuthResponse { StatusCode = 500, ErrorMessage = "Une erreur technique est survenue sur le serveur." };
            }
        }

        public AuthResponse AuthenticateEmployee(LoginCredentials credentials)
        {
            try
            {
                var employee = _employeeInterface.GetEmployee(credentials.Code);

                // Sécurité : On ne dit pas si c'est le code ou le mdp qui est faux
                if (employee == null)
                {
                    return new AuthResponse { StatusCode = 400, ErrorMessage = "Identifiants invalides." };
                }

                var result = _passwordHasher.VerifyHashedPassword(employee.Code, employee.Pwd, credentials.Pwd);

                if (result == PasswordVerificationResult.Success)
                {
                    return new AuthResponse { Employee = employee, StatusCode = 200 };
                }

                return new AuthResponse { StatusCode = 400, ErrorMessage = "Identifiants invalides." };
            }
            catch (Exception ex)
            {
                // Ici, quelque chose a vraiment mal tourné (BD offline, erreur de hashage, etc.)
                Console.WriteLine($"[CRITICAL] Auth Error: {ex.Message}");
                return new AuthResponse { StatusCode = 500, ErrorMessage = "Une erreur technique est survenue sur le serveur." };
            }
        }

        //public async Task<int> UpdatePasswordAsync(ResetPasswordCredentials resetPasswordCredentials)
        //{

        //}
    }
}
