using MyUAAcademiaB.Dto;
using MyUAAcademiaB.Models;

namespace MyUAAcademiaB.Interfaces
{
    public interface IUserInterface
    {
        //bool
        bool StudentExists(string permanentCode);
        bool UserExistsV1(string permanentCode, string email);

        /*CREATE*/
        Users CreateStudent(Users student);

        /*READ*/
        ICollection<Users> GetProfessors();
        ICollection<Users> GetStudents();
        ICollection<UserV3Dto> GetStudentsByCodes(ICollection<string> permanentCodes);
        ICollection<Users> GetStudentsV2();
        Users GetUser(string permanentCode);
        Users GetUserForReset(ResetCredentialsDto resetCredentials);
        //ICollection<StudentFiles> GetStudentFiles(string permanentCode);
        ICollection<Users> GetUsers();
        ICollection<Users> GetUsersByName(string userName);

        /*UPDATE*/
        bool ActivateStudentAccount(ActivationRequest activationRequest);
        bool ValidateUserAccount(ValidationRequest validationRequest);
        Task<int> UpdatePasswordAsync(ResetPasswordCredentials resetPasswordCredentials);
        Users UpdateStudentProfile(SStudentEltToUpdate eltToUpdate);


        /*DELETE*/

    }
}
