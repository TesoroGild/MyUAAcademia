namespace MyUAAcademiaB.Models
{
    public class AuthResponse
    {
        public Employees? Employee { get; set; }
        public Users? User { get; set; }
        public string? ErrorMessage { get; set; }
        public int StatusCode { get; set; }
    }
}
