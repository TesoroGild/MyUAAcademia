namespace MyUAAcademiaB.Models
{
    public class UsersCoursesList
    {
        public int? Id { get; set; }

        public List<int> CCourseIds { get; set; }

        public List<string> PermanentCodes { get; set; }
    }
}
