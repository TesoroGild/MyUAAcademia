using MyUAAcademiaB.Dto;
using MyUAAcademiaB.Models;

namespace MyUAAcademiaB.Interfaces
{
    public interface IUserProgramService
    {
        UserProgramEnrollmentDto setEstimatedDates(UserProgramEnrollmentDto userProgramToRegister, string grade);
    }
}
