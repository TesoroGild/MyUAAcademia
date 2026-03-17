namespace MyUAAcademiaB.Models
{
    public class UserCourse
    {
        public int Id { get; set; }

        public int CCourseId { get; set; }
        public ClassesCourses ClassesCourses { get; set; }

        public string PermanentCode { get; set; }
        public Users Student { get; set; }
    }
}