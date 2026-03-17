using MyUAAcademiaB.Models;

namespace MyUAAcademiaB.Interfaces
{
    public interface IClasseCourseService
    {
        ICollection<ClasseCoursesName> ClasseCoursesWithNames(ICollection<ClassesCourses> classesCourses, ICollection<Course1> courses);
    }
}
