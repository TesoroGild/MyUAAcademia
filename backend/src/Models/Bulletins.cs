namespace MyUAAcademiaB.Models
{
    public class Bulletins
    {
        public string PermanentCode { get; set; }
        public Users Student { get; set; }

        public double? Grade { get; set; }
        public string? Mention { get; set; }

        //public ICollection<Courses> Courses { get; set; }
        public string Sigle { get; set; }
        public Courses Course { get; set; }
    }
}
