namespace MyUAAcademiaB.Dto
{
    public class CourseDto
    {
        public string Sigle { get; set; }

        public string FullName { get; set; }

        public required double Price { get; set; }

        public required int Credits { get; set; }

        public int? Summer { get; set; }

        public int? Autumn { get; set; }

        public int? Winter { get; set; }

        public string EmployeeCode { get; set; }

        public string ProgramTitle { get; set; }
    }
}
