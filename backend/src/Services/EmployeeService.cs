using MyUAAcademiaB.Interfaces;
using System.Text;

namespace MyUAAcademiaB.Services
{
    public class EmployeeService : IEmployeeService
    {
        public string GenerateCode(string lastName, string firstName, DateOnly birthDay, char sexe, string job, DateOnly startingDate)
        {
            //Diamond DM, Gold GD, Silver SV, Copper CP.
            var code = new StringBuilder();
            code.Append(lastName.Substring(0, 3).ToUpper());
            code.Append(firstName.Substring(0, 1).ToUpper());

            int day = birthDay.Day;
            int month = birthDay.Month;
            int year = birthDay.Year;

            if (year >= 2000) day += 62;

            if (sexe.Equals('F')) month += 33;
            else if (sexe.Equals('M')) month += 12;
            else if (sexe.Equals('O')) month += 5;
            else if (sexe.Equals('-')) month += 71;

            code.Append(day.ToString("D2"));
            code.Append(month.ToString("D2"));
            code.Append(year.ToString("D4"));

            if (job.ToLower().Equals("directeur")) code.Append("DM");
            else if (job.ToLower().Equals("chef")) code.Append("GD");
            else if (job.ToLower().Equals("ressources humaines")) code.Append("SV");
            else if (job.ToLower().Equals("caissier")) code.Append("CP");
            else code.Append("RN");

            code.Append(DateTime.Today.Year - startingDate.Year);

            return code.ToString();
        }
    }
}
