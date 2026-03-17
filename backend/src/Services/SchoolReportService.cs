using MyUAAcademiaB.Dto;
using MyUAAcademiaB.Interfaces;
using MyUAAcademiaB.Models;

namespace MyUAAcademiaB.Services
{
    public class SchoolReportService : ISchoolReportService
    {
        public ICollection<SchoolReport> CreateSchoolReport(List<BulletinDto> studentBulletinMap, ICollection<ClasseCourses1> bulletinCourses, ICollection<Course1> courses)
        {
            var schoolReport = studentBulletinMap
                .Join(bulletinCourses, sb => sb.Sigle, bc => bc.CourseId,
                    (sb, bc) => new SchoolReport
                    {
                        Sigle = sb.Sigle,
                        PermanentCode = sb.PermanentCode,
                        Grade = sb.Grade,
                        Mention = sb.Mention,
                        SessionCourse = bc.SessionCourse,
                        YearCourse = bc.YearCourse
                        //ProgramTitle = sb.
                    })
                .Join(courses, sb => sb.Sigle, c => c.Sigle,
                    (sb, c) => new SchoolReport
                    {
                        Starting = sb.Starting,
                        DateOfEnd = sb.DateOfEnd,
                        PermanentCode = sb.PermanentCode,
                        Grade = sb.Grade,
                        Mention = sb.Mention,
                        SessionCourse = sb.SessionCourse,
                        YearCourse = sb.YearCourse,
                        Sigle = c.Sigle,
                        FullName = c.FullName,
                        Credits = c.Credits,
                        //ProgramTitle = c.ProgramTitle
                    })
                .ToList();
            return schoolReport;
        }
    }
}
