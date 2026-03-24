namespace MyUAAcademiaB.Models
{
    public class UsersCoursesList
    {
        public int? Id { get; set; }

        public List<int>? CCourseIdsToAdd { get; set; }

        public List<int>? CCourseIdsToDrop { get; set; }

        public List<string> PermanentCodes { get; set; }

        public string ProgramTitle { get; set; }
    }
}
