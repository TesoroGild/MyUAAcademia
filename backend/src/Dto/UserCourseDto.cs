using MyUAAcademiaB.Models;

namespace MyUAAcademiaB.Dto
{
    public class UserCourseDto
    {
        public int Id { get; set; }

        public required int CCourseId { get; set; }

        public string PermanentCode { get; set; }
    }
}
