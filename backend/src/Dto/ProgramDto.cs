using MyUAAcademiaB.Models;

namespace MyUAAcademiaB.Dto
{
    public class ProgramDto
    {
        public string Title { get; set; }

        public string ProgramName { get; set; }

        public string Descriptions { get; set; }

        public string Grade { get; set; }

        public string Department { get; set; }

        public string Faculty { get; set; }

        public string EmployeeCode { get; set; }

        public bool IsEnrolled { get; set; }

        public bool HasFinished { get; set; }
    }
}
