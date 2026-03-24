using Microsoft.EntityFrameworkCore;
using MyUAAcademiaB.Models;

namespace MyUAAcademiaB.Interfaces
{
    public interface IUserCourseInterface
    {
        /*BOOL*/
        bool IsStudentRegister(int studentId);

        /*CREATE*/
        UserCourse RegisterStudentToCourse(UserCourse userClasse);
        Task<int> RegisterStudentsToCoursesAsync(List<UserCourse> usersClasses);
        ICollection<string> GetPermanentCodes(string classeCourse);

        /*READ*/
        ICollection<int> GetStudentClasseCourse(string permanentCode);
        UserCourse ModifyUserCourse(UserCourse userClasses);

        /*UPDATE*/
        Task<int> DropCourses(List<UserCourse> usersClasses);
    }
}
