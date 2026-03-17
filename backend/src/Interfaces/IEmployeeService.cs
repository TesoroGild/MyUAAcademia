namespace MyUAAcademiaB.Interfaces
{
    public interface IEmployeeService
    {
        string GenerateCode(string lastName, string firstName, DateOnly birthDay, char sexe, string? job, DateOnly startingDate);
    }
}
