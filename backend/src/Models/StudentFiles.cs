namespace MyUAAcademiaB.Models
{
    public class StudentFiles
    {
        public string? FileCode { get; set; }
        public string StudentCode { get; set; }
        public string FileName { get; set; }
        public string ContentType { get; set; }
        public string FileType { get; set; }
        public DateTime UploadedAt { get; set; }

    }
}
