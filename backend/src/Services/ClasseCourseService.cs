using MyUAAcademiaB.Interfaces;
using MyUAAcademiaB.Models;

namespace MyUAAcademiaB.Services
{
    public class ClasseCourseService : IClasseCourseService
    {
        public ICollection<ClasseCoursesName> ClasseCoursesWithNames(ICollection<ClassesCourses> classesCourses, ICollection<Course1> courses)
        {
            var combinedList = new List<ClasseCoursesName>();

            var firstList = new List<ClassesCourses>(classesCourses);
            var secondList = new List<Course1>(courses);

            for (int i = 0; i < firstList.Count; i++)
            {
                var combinedObject = new ClasseCoursesName
                {
                    Id = firstList[i].Id,
                    Sigle = secondList[i].Sigle,
                    FullName = secondList[i].FullName,
                    Credits = secondList[i].Credits,
                    ClasseName = firstList[i].ClasseName,
                    ProgramTitle = secondList[i].ProgramTitle,
                    Jours = firstList[i].Jours,
                    StartTime = firstList[i].StartTime,
                    EndTime = firstList[i].EndTime,
                    SessionCourse = firstList[i].SessionCourse,
                    YearCourse = firstList[i].YearCourse
                };

                combinedList.Add(combinedObject);
            }
            return combinedList;
        }
    }
}
