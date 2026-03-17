using MyUAAcademiaB.Dto;
using MyUAAcademiaB.Interfaces;
using MyUAAcademiaB.Models;

namespace MyUAAcademiaB.Services
{
    public class UserProgramService : IUserProgramService
    {
        public UserProgramEnrollmentDto setEstimatedDates(UserProgramEnrollmentDto userProgramToRegister, string grade)
        {
            DateTime enrollmentDate = DateTime.Now;
            DateOnly enrollmentDateOnly = DateOnly.FromDateTime(enrollmentDate);
            userProgramToRegister.EnrollmentDate = enrollmentDateOnly;
            if (grade == "Doctorat")
                userProgramToRegister.EndDateEstimate = enrollmentDateOnly.AddYears(4);
            if (grade == "Baccalauréat")
                userProgramToRegister.EndDateEstimate = enrollmentDateOnly.AddYears(3);
            if (grade == "Master" || grade == "Certificat")
                userProgramToRegister.EndDateEstimate = enrollmentDateOnly.AddYears(2);

            return userProgramToRegister;
        }
    }
}
