namespace MyUAAcademiaB.Models
{
    public class ClassesCourses
    {
        public int Id { get; set; }
        
        public string ClasseName { get; set; }
        public Classes Classe { get; set; }

        public string CourseSigle { get; set; }
        public Courses Course { get; set; }

        public string Jours {  get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public string SessionCourse {  get; set; }
        public string YearCourse { get; set; }

        public string EmployeeCode { get; set; }
        public Employees Employee { get; set; }

        public ICollection<UserCourse>? UserCourse { get; set; }
    }
}
