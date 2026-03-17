using MyUAAcademiaB.Models;

namespace MyUAAcademiaB.Dto
{
    public class ClasseCourseDto
    {
        public int? Id { get; set; }

        public string ClasseName { get; set; }

        public string CourseSigle { get; set; }

        public string Jours { get; set; }

        public string StartTime { get; set; }
        
        public string EndTime { get; set; }

        public string SessionCourse { get; set; }
        
        public string YearCourse { get; set; }
    }
}
