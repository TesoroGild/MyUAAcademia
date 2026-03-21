namespace MyUAAcademiaB.Dto
{
    public class ContractTCDto
    {
        public string Availability { get; set; }
        public string BaseSalary { get; set; }
        public string? Code { get; set; }
        public string Department { get; set; }
        public string Description { get; set; }
        public DateOnly? EndingDate { get; set; }
        public string Faculty { get; set; }
        public string JobTitle { get; set; }
        public string MaximumWage { get; set; }
        public int MinimumWage { get; set; }
        public int NumberOfHours { get; set; }
        public DateOnly StartingDate { get; set; }
        public string TypeOfEmployment { get; set; }
        public string TypeOfOffer { get; set; }
        public string WorkShift { get; set; }
    }
}