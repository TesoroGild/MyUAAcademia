using MyUAAcademiaB.Dto;
using MyUAAcademiaB.Models;

namespace MyUAAcademiaB.Interfaces
{
    public interface IUserProgramInterface
    {
        /*CREATE*/
        UserProgramEnrollment RegisterAStudentToAProgram(UserProgramEnrollment userProgramToRegister);


        /*READ*/
        ICollection<UserProgramEnrollment> GetStudentsRegistered();
        ICollection<string> GetStudentsInTheProgram(string progTitle);
        List<ProgEnrFinDto> GetStudentPrograms(string permanentcode);


        /*UPDATE*/
        int ActiveAndDelete(StudentProgramDecisionDto studentProgramDecisionDto);


        /*DELETE*/
    }
}
