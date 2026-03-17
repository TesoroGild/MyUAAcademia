using MyUAAcademiaB.Models;

namespace MyUAAcademiaB.Dto
{
    public class UserProgramEnrollmentDto
    {
        public string PermanentCode { get; set; }

        public string Title { get; set; }

        public DateOnly? EnrollmentDate { get; set; }

        public DateOnly? EndDateEstimate { get; set; }

        public DateOnly? RealEndDate { get; set; }
    }
}
