using MyUAAcademiaB.Models;

namespace MyUAAcademiaB.Models
{
    public class UserProgramEnrollment
    {
        public string PermanentCode { get; set; }
        public Users Student { get; set; }

        public string Title { get; set; }
        public Programs Programs { get; set; }

        public DateTime? EnrollmentDate { get; set; }

        public DateTime? EndDateEstimate { get; set; }

        public DateTime? RealEndDate { get; set; }

        public bool IsEnrolled { get; set; } = false;
        public bool HasFinished { get; set; } = false;
    }
}