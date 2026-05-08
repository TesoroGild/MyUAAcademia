using MyUAAcademiaB.Models;

namespace MyUAAcademiaB.Interfaces
{
    public interface IUserService
    {
        string GenerateEmail(string firstName, string lastName);
        string GeneratePermanentCode(string lastName, string firstName, DateOnly birthDay, char sexe, Random? rnd = null);
        string SetFirstPasssword(string lastName, string firstName);
    }
}
