using MyUAAcademiaB.Data;
using MyUAAcademiaB.Interfaces;
using MyUAAcademiaB.Models;
using System.Linq;

namespace MyUAAcademiaB.Repository
{
    public class CourseRepository : ICourseInterface
    {
        private readonly DataContext _context;
        public CourseRepository(DataContext context)
        {
            _context = context;
        }

        /*CREATE*/
        public Courses CreateCourse(Courses course)
        {
            _context.Add(course);
            _context.SaveChanges();
            return course;
        }

        /*READ*/
        public bool CourseExists(string sigle)
        {
            return _context.Courses.Any(cl => cl.Sigle == sigle);
        }

        public ICollection<Courses> GetCourses()
        {
            return _context.Courses.OrderBy(co => co.Sigle).ToList();
        }

        public ICollection<Courses> GetCoursesBySessionYear(CourseRequest progSesYr)
        {
            IQueryable<Courses> query = _context.Courses;

            if (progSesYr.SessionCourse == "Été")
            {
                query = query.Where(c => c.Summer == 1);
            }
            else if (progSesYr.SessionCourse == "Automne")
            {
                query = query.Where(c => c.Autumn == 1);
            }
            else if (progSesYr.SessionCourse == "Hiver")
            {
                query = query.Where(c => c.Winter == 1);
            }

            return query.Where(c => c.ProgramTitle == progSesYr.ProgramTitle)
                .ToList();
        }

        public Courses GetCourse(string courseSigle)
        {
            return _context.Courses.Where(co => co.Sigle == courseSigle).FirstOrDefault();
        }

        public ICollection<Courses> GetProgramCourses(string programTitle)
        {
            return _context.Courses.Where(co => co.ProgramTitle == programTitle)
                .ToList();
        }

        public ICollection<Courses> GetProgramCoursesByProgram(List<string> programsTitles)
        {
            return _context.Courses
                .Where(co => programsTitles.Contains(co.ProgramTitle))
                .ToList();
        }

        public ICollection<Courses> GetProgramCoursesBySigle(List<string> coursesSigles)
        {
            return _context.Courses
                .Where(co => coursesSigles.Contains(co.Sigle))
                .ToList();
        }

        public ICollection<Courses> GetSessionCourses(SessionsAvailables sessionsAvailables)
        {
            int winterInt = sessionsAvailables.Winter ? 1 : 0;
            int summerInt = sessionsAvailables.Summer ? 1 : 0;
            int autumnInt = sessionsAvailables.Autumn ? 1 : 0;

            return _context.Courses
                .Where(co => 
                    (co.Winter == winterInt && co.Summer == summerInt && co.Autumn == autumnInt)
                        && (co.Winter == 1 || co.Summer == 1 || co.Autumn == 1)
                    )
                .ToList();
        }

        public ICollection<Course1> GetSigleName(ICollection<string> coursesIds)
        {
            return _context.Courses.Where(c => coursesIds.Contains(c.Sigle))
                .Select(c =>  new Course1
                {
                    Sigle = c.Sigle,
                    FullName = c.FullName,
                    Credits = c.Credits,
                    ProgramTitle = c.ProgramTitle
                })
                .ToList();
        }

        public Course1 GetSigleName1(string courseId)
        {
            return _context.Courses.Where(c => c.Sigle == courseId)
                .Select(c => new Course1
                {
                    Sigle = c.Sigle,
                    FullName = c.FullName,
                    Credits = c.Credits,
                    ProgramTitle = c.ProgramTitle
                })
                .FirstOrDefault();
        }

        public ICollection<Courses> GetSessionCoursePrice(UserSessionInfos userSessionInfos)
        {
            var test1 = _context.UserCourses
                .Where(uc => uc.PermanentCode == userSessionInfos.PermanentCode)
                .Select(uc => uc.CCourseId)
                .ToList();
            var test2 = _context.ClassesCourses
                .Where(cc => test1.Contains(cc.Id) && cc.SessionCourse == userSessionInfos.SessionCourse && cc.YearCourse == userSessionInfos.YearCourse)
                .Select(cc => cc.CourseSigle)
                .ToList();
            return _context.Courses
                .Where(c => test2.Contains(c.Sigle))
                .ToList();
        }

        /*UPDATE*/

        /*DELETE*/
    }
}
