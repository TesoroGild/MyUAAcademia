namespace MyUAAcademiaB.Models
{
    public class Classes
    {
        public string ClasseName { get; set; }

        public int? Capacity { get; set; }

        public string TypeOfClasse { get; set; }

        public string EmployeeCode { get; set; }
        public Employees Employee { get; set; }

        public ICollection<ClassesCourses> ClassesCourses { get; set; }
    }
}
