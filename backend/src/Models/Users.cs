namespace MyUAAcademiaB.Models
{
    public class Users : Person
    {
        public string? PermanentCode { get; set; }

        //public ReportCard ReportCard { get; set; }

        //public ICollection<Classes> Classes { get; set; }

        //public ICollection<UserClasseCourse>? UserClasseCourse { get; set; }

        public string? EmployeeCode { get; set; }
        public Employees? Employee { get; set; }

        public ICollection<Bills>? Bills { get; set; }

        public ICollection<UserCourse>? UserCourses { get; set; }
        
        public ICollection<UserProgramEnrollment>? UserProgramEnrollments { get; set; }

        public ICollection<Bulletins>? Bulletins { get; set; }
        
    }
}
