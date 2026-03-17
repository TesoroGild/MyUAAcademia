using MyUAAcademiaB.Dto;
using MyUAAcademiaB.Models;

namespace MyUAAcademiaB.Interfaces
{
    public interface ISchoolReportService
    {
        ICollection<SchoolReport>CreateSchoolReport(List<BulletinDto> studentBulletinMap, ICollection<ClasseCourses1> bulletinCourses, ICollection<Course1> courses);
    }
}
