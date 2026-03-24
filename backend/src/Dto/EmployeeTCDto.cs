namespace MyUAAcademiaB.Dto
{
    public class EmployeeTCDto
    {
        public string BirthDay { get; set; }
        public string CreatedByCode { get; set; }
        public string Email { get; set; }
        public string EmpStatus { get; set; }
        public string? EndDateOfFunction { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int Nas { get; set; }
        public string PhoneNumber { get; set; }
        public char Sexe { get; set; }
        public string StreetAddress { get; set; }
        public string Nationality { get; set; }

        //Contracts
        public string ContractCode { get; set; }
        public string JobTitle { get; set; }
        public DateOnly RealEndDate { get; set; }
        public string RealSalary { get; set; }
        public DateOnly RealStartingDate { get; set; }
    }
}