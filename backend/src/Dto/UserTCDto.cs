namespace MyUAAcademiaB.Dto
{
    public class UserTCDto
    {
        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string PersonalEmail { get; set; }

        public string? PermanentCode { get; set; }

        public string Nationality { get; set; }

        public required char Sexe { get; set; }

        public string UserRole { get; set; }

        public string[] ProgramTitle { get; set; }

        public string? PhoneNumber { get; set; }

        public string BirthDay { get; set; }

        public int? Nas { get; set; }

        public string? EmployeeCode { get; set; }

        public string StreetAddress { get; set; }

        public string? UserStatus { get; set; }

        public IFormFile? SchoolTranscript { get; set; }
        public IFormFile? Picture { get; set; }
        public IFormFile? IdentityProof { get; set; }        

        //public ICollection<Bills>? Bills { get; set; }

        //public ICollection<ClassesCourses>? ClassesCourses { get; set; }
    }
}