using MyUAAcademiaB.Models;

namespace MyUAAcademiaB.Dto
{
    public class ClasseCoursesProgramDto
    {
        public int Id { get; set; }
        public string ClasseName { get; set; }
        public string CourseSigle { get; set; }
        public string Jours { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public string SessionCourse { get; set; }
        public string YearCourse { get; set; }
        public string EmployeeCode { get; set; }
        public string? TaughtBy { get; set; }
        public string ProgramTitle { get; set; }
        public string Grade { get; set; }
    }
}
