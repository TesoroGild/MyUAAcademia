namespace MyUAAcademiaB.Models
{
    public class Employees : Person
    {
        public ICollection<Classes>? Classes { get; set; }
        public ICollection<ClassesCourses>? ClassesCourses { get; set; }
        public string? Code { get; set; }
        public ICollection<Courses>? Courses { get; set; }
        public string EmpStatus { get; set; }
        public ICollection<Programs>? Programs { get; set; }
        public ICollection<Users>? Users { get; set; }
        public ICollection<EmployeesContracts> EmployeesContracts { get; set; }

        //Auto reference
        public virtual Employees? CreatedBy { get; set; }
        public string? CreatedByCode { get; set; }
        public virtual ICollection<Employees>? CreatedEmployees { get; set; }
    }
}
