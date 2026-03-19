using Microsoft.EntityFrameworkCore;
using MyUAAcademiaB.Data;
using MyUAAcademiaB.Interfaces;
using MyUAAcademiaB.Models;

namespace MyUAAcademiaB.Repository
{
    public class ClasseCourseRepository : IClasseCourseInterface
    {
        private readonly DataContext _context;
        public ClasseCourseRepository(DataContext context)
        {
            _context = context;
        }

        /*BOOL*/
        public bool IsClasseExist(string classeCourseId)
        {
            return _context.ClassesCourses.Any(cc => cc.Id.ToString().Equals(classeCourseId));
        }

        /*CREATE*/
        public ClassesCourses ScheduleACourse(ClassesCourses classesCourses)
        {
                _context.Add(classesCourses);
                _context.SaveChanges();
                return classesCourses;
        }

        /*READ*/
        public ICollection<ClassesCourses> GetClasseCourse()
        {
            return _context.ClassesCourses.OrderBy(cc => cc.YearCourse).ToList();
        }

        public ICollection<ClassesCourses> GetClasseCoursesByProgram(string title)
        {
            return _context.ClassesCourses
                .Include(cc => cc.Course) // On charge les données de la table Course
                .Where(cc => cc.Course.ProgramTitle == title) // On filtre sur la propriété du cours
                .OrderBy(cc => cc.YearCourse)
                .ToList();
        }

        public ICollection<ClasseCourses1> GetClasseCourseById(ICollection<int> courseIds)
        {
            return _context.ClassesCourses.Where(cc => courseIds.Contains(cc.Id))
                .Select(cc => new ClasseCourses1
                {
                    CourseId = cc.CourseSigle,
                    SessionCourse = cc.SessionCourse,
                    YearCourse = cc.YearCourse
                })
                .OrderBy(cc => cc.CourseId)
                .ToList();
        }

        public ICollection<ClassesCourses> GetClasseCourseByProgramSession(ICollection<string> coursesSigle, string session)
        {
            return _context.ClassesCourses.Where(cc => coursesSigle.Contains(cc.CourseSigle) && cc.SessionCourse == session)
                .OrderBy(cc => cc.CourseSigle).ToList();
        }

        public ICollection<ClassesCourses> GetClasseCourseBySessions(SessionsAvailables sessionsAvailables)
        {
            var query = _context.ClassesCourses.AsQueryable();

            if (!sessionsAvailables.Winter)
                query = query.Where(cc => cc.SessionCourse != "Hiver");
            if (!sessionsAvailables.Summer)
                query = query.Where(cc => cc.SessionCourse != "Été");
            if (!sessionsAvailables.Autumn)
                query = query.Where(cc => cc.SessionCourse != "Automne");

            return query.OrderBy(cc => cc.SessionCourse).ToList();
        }

        public ICollection<ClassesCourses> GetProgramsSessionCourses(ICollection<ClassesCourses> classesCourses, IEnumerable<string> titles)
        {
            return classesCourses
                .Where(cc => _context.Courses
                    .Any(c => c.Sigle == cc.CourseSigle && titles.Contains(c.ProgramTitle))
                )
                .ToList();
        }

        public ICollection<Courses> GetSessionCourses(string sessionStudy, string yearStudy, IEnumerable<string> classeCourseId)
        {
            return _context.ClassesCourses
                .Where(cc => cc.SessionCourse == sessionStudy
                    && cc.YearCourse == yearStudy
                    && classeCourseId.Contains(cc.Course.FullName))
                .Select(cc => cc.Course)
                .ToList();
        }

        public ICollection<ClassesCourses> GetStudentSessionCourse(UserSessionInfos userSessionInfos)
        {
            var userCoursesIds = _context.UserCourses
                .Where(uc => uc.PermanentCode == userSessionInfos.PermanentCode)
                .Select(uc => uc.CCourseId)
                .ToList();
            return _context.ClassesCourses
                .Where(cc => userCoursesIds.Contains(cc.Id) && cc.SessionCourse == userSessionInfos.SessionCourse && cc.YearCourse == userSessionInfos.YearCourse)
                .ToList(); 
        }

        public ICollection<string> GetCoursesSigle(List<int> courseIds)
        {
            return _context.ClassesCourses.Where(cc => courseIds.Contains(cc.Id))
                .Select(cc => cc.CourseSigle)
                .ToList();
        }

        /*UPDATE*/
        public ClassesCourses UpdateACourse(ClassesCourses classesCourses)
        {
            _context.Update(classesCourses);
            _context.SaveChanges();
            return classesCourses;
        }
    }
}
