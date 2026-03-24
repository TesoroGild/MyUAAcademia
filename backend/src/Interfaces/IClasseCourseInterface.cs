using MyUAAcademiaB.Dto;
using MyUAAcademiaB.Models;

namespace MyUAAcademiaB.Interfaces
{
    public interface IClasseCourseInterface
    {
        /*BOOL*/
        bool IsClasseExist(string classeCourseId);

        /*CREATE*/
        ClassesCourses ScheduleACourse(ClassesCourses classesCourses);

        /*READ*/
        ICollection<ClassesCourses> GetClasseCourse();
        ICollection<ClassesCourses> GetClasseCoursesByProgram(string title);
        ICollection<string> GetCoursesSigle(List<int> courseIds);
        ICollection<ClasseCourses1>GetClasseCourseById(ICollection<int> courseIds);
        ICollection<ClassesCourses> GetClasseCourseByProgramSession(ICollection<string> coursesSigle, string session);
        ICollection<ClassesCourses> GetClasseCourseBySessions(SessionsAvailables sessionsAvailables);
        Task<ICollection<ClasseCoursesProgramDto>> GetProfessorCourses(string profCode);
        ICollection<ClassesCourses> GetProgramsSessionCourses(ICollection<ClassesCourses> classesCourses, IEnumerable<string> titles);
        ICollection<Courses> GetSessionCourses(string sessionStudy, string yearStudy, IEnumerable<string> classeCourseId);
        ICollection<ClassesCourses> GetStudentSessionCourse(UserSessionInfos userSessionInfos);

        /*UPDATE*/
        ClassesCourses UpdateACourse(ClassesCourses classesCourses);
        Task<int> AddProfessor(ProfCCoursesIdDto profCourseIds);
    }
}
