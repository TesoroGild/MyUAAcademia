namespace MyUAAcademiaB.Models
{
    public class EmployeesContracts
    {
        public string EmpCode { get; set; }
        public Employees Employee { get; set; }
        public string ContractCode { get; set; }
        public Contracts Contract { get; set; }
        public DateOnly RealStartingDate { get; set; }
        public DateOnly RealEndDate { get; set; }
        public bool IsContractOver { get; set; }
        public string RealSalary { get; set; }
    }
}
