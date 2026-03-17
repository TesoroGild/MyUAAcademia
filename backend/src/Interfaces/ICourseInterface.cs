using Microsoft.AspNetCore.Http.HttpResults;
using MyUAAcademiaB.Models;

namespace MyUAAcademiaB.Interfaces
{
    public interface ICourseInterface
    {
        bool CourseExists(string sigle);

        /*CREATE*/
        Courses CreateCourse(Courses course);

        /*READ*/
        Courses GetCourse(string courseSigle);
        ICollection<Courses> GetCourses();
        ICollection<Courses> GetCoursesBySessionYear(CourseRequest progSesYr);
        ICollection<Courses> GetProgramCourses(string programTitle);
        ICollection<Courses> GetProgramCoursesByProgram(List<string> programsTitles);
        ICollection<Courses> GetProgramCoursesBySigle(List<string> coursesSigles); 
        ICollection<Courses> GetSessionCourses(SessionsAvailables sessionsAvailables);
        ICollection<Course1> GetSigleName(ICollection<string> coursesIds);
        ICollection<Courses> GetSessionCoursePrice(UserSessionInfos userSessionInfos);
        Course1 GetSigleName1(string courseId);

        /*UPDATE*/

        /*DELETE*/
    }
}
