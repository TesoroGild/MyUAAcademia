using MyUAAcademiaB.Dto;
using MyUAAcademiaB.Models;

namespace MyUAAcademiaB.Interfaces
{
    public interface IUserInterface
    {
        bool StudentExists(string permanentCode);

        /*CREATE*/
        Users CreateStudent(Users student);

        /*READ*/
        ICollection<Users> GetProfessors();
        ICollection<Users> GetStudents();
        ICollection<Users> GetStudentsV2();
        ICollection<UserV3Dto> GetStudentsByCodes(ICollection<string> permanentCodes);
        Users GetUser(string permanentCode);
        //ICollection<StudentFiles> GetStudentFiles(string permanentCode);
        ICollection<Users> GetUsers();
        ICollection<Users> GetUsersByName(string userName);

        /*UPDATE*/
        bool ActivateStudentAccount(ActivationRequest activationRequest);
        Task<int> UpdatePasswordAsync(ResetPasswordCredentials resetPasswordCredentials);
        Users UpdateStudentProfile(SStudentEltToUpdate eltToUpdate);


        /*DELETE*/

    }
}
