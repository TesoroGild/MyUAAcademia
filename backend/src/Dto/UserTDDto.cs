namespace MyUAAcademiaB.Dto
{
    public class UserTDDto
    {
        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string PersonalEmail { get; set; }

        public string PermanentCode { get; set; }

        public string ProfessionalEmail { get; set; }

        public string IsActivated { get; set; }
        public bool IsValidated { get; set; }

        public string Nationality { get; set; }

        public char Sexe { get; set; }

        public string UserRole { get; set; }

        public string? Department { get; set; }

        public string? Faculty { get; set; }

        public string? LvlDegree { get; set; }

        public string? PhoneNumber { get; set; }

        public string BirthDay { get; set; }

        public int? Nas { get; set; }

        public string StreetAddress { get; set; }

        public string? UserStatus { get; set; }
    }
}
