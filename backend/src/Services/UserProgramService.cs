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
            userProgramToRegister.EndDateEstimate = grade switch
            {
                "Doctorat" => enrollmentDateOnly.AddYears(4),
                "Baccalauréat" => enrollmentDateOnly.AddYears(3),
                "Master" or "Certificat" => enrollmentDateOnly.AddYears(2),
                _ => throw new ArgumentException($"Grade non reconnu : {grade}")
            };

            return userProgramToRegister;
        }
    }
}
