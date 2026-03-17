using MyUAAcademiaB.Models;

namespace MyUAAcademiaB.Dto
{
    public class UserV2Dto
    {
        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string? PermanentCode { get; set; }

        public char Sexe { get; set; }

        public string Email { get; set; }

        public string UserRole { get; set; }

        public int? IsActivated { get; set; }

        public string? Department { get; set; }

        public string? Faculty { get; set; }

        public string? LvlDegree { get; set; }

        public string? PhoneNumber { get; set; }

        public DateTime BirthDay { get; set; }

        public int? Nas { get; set; }

        public string EmployeeCode { get; set; }
    }
}
