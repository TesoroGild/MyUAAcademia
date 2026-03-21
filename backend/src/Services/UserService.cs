using MyUAAcademiaB.Interfaces;
using MyUAAcademiaB.Models;
using System.Text;

namespace MyUAAcademiaB.Services
{
    public class UserService : IUserService
    { 
        public string GenerateEmail(string firstName, string lastName)
        {
            var email = new StringBuilder();
            var fistNameNoSpace = firstName.Replace(" ", "_");

            email.Append(fistNameNoSpace.ToLower());
            email.Append(".");
            email.Append(lastName.ToLower());
            email.Append("@myua.ca");

            return email.ToString();
        }

        public string GeneratePermanentCode(string lastName, string firstName, DateOnly birthDay, char sexe)
        {
            var codePermanent = new StringBuilder();
            codePermanent.Append(lastName.Substring(0, 3).ToUpper());
            codePermanent.Append(firstName.Substring(0, 1).ToUpper());

            int day = birthDay.Day;
            int month = birthDay.Month;
            int year = birthDay.Year;

            if (year >= 2000) day += 62;

            if (sexe.Equals('F')) month += 50;
            else if (sexe.Equals('M')) month += 25;
            else if (sexe.Equals('O')) month += 10;
            else if (sexe.Equals('-')) month += 75;

            codePermanent.Append(day.ToString("D2"));
            codePermanent.Append(month.ToString("D2"));
            codePermanent.Append(year.ToString("D4"));

            Random rnd = new Random();
            codePermanent.Append(rnd.Next(10, 99));

            return codePermanent.ToString();
        }

        public string SetFirstPasssword(string lastName, string firstName)
        {
            var firstPwd = new StringBuilder();
            firstPwd.Append(lastName.Substring(0, 3).ToUpper());
            firstPwd.Append("helloyou");
            firstPwd.Append(firstName.Substring(0, 2).ToUpper());
            return firstPwd.ToString();
        }
    }
}
