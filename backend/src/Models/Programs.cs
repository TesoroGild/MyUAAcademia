using System.Globalization;

namespace MyUAAcademiaB.Models
{
    public class Programs
    {
        public string Title { get; set; }

        public string ProgramName { get; set; }

        public string Descriptions { get; set; }

        public string Grade { get; set; }

        public string Department { get; set; }

        public string Faculty { get; set; }

        //public string NumberOfCredits { get; set; }

        public string EmployeeCode { get; set; }
        public Employees Employee { get; set; }

        public ICollection<UserProgramEnrollment>? UserProgramEnrollments { get; set; }
        public ICollection<Courses>? Courses { get; set; }
    }
}
