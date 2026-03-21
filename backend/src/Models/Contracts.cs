namespace MyUAAcademiaB.Models
{
    public class Contracts
    {
        public string Availability {  get; set; } //Semaine
        public string BaseSalary { get; set; } //Annuel
        public string Code { get; set; }
        public string Department { get; set; }
        public string Description { get; set; }
        public DateOnly? EndingDate { get; set; }
        public string Faculty { get; set; }
        public string JobTitle { get; set; }
        public string MaximumWage { get; set; } //70000$
        public int MinimumWage { get; set; } //50000$
        public int NumberOfHours { get; set; } //40h
        public DateOnly StartingDate { get; set; }
        public string TypeOfEmployment { get; set; } //temps plein
        public string TypeOfOffer { get; set; } //cdi
        public string WorkShift {  get; set; } //jour
        public ICollection<EmployeesContracts> EmployeesContracts { get; set; }
    }
}









