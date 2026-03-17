namespace MyUAAcademiaB.Models
{
    public class Courses
    {
        public string Sigle { get; set; }

        public string FullName { get; set; }

        public int Credits { get; set; }

        public double Price { get; set; }

        public int? Summer { get; set; }

        public int? Autumn { get; set; }

        public int? Winter { get; set; }

        public string EmployeeCode { get; set; }
        public Employees Employee { get; set; }
        public ICollection<ClassesCourses>? ClassesCourses { get; set; }

        //public int BullettinId { get; set; }
        public ICollection<Bulletins>? Bulletin { get; set; }

        public string ProgramTitle { get; set; }
        public Programs Program { get; set; }
        //public ICollection<BullettinCourses> BullettinCourse { get; set; }
        //public ICollection<Classes> Classes { get; set; }

        //public ICollection<ReportCourses> ReportCourses { get; set; }

        //public ICollection<SessionCourses> SessionCourses { get; set; }
    }
}
