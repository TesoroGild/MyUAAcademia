namespace MyUAAcademiaB.Models
{
    public class LoginCredentials
    {
        public string Code { get; set; }
        public string Pwd { get; set; }
    }

    public class LoginCredentialsStudent
    {
        public string PermanentCode { get; set; }
        public string Pwd { get; set; }
    }
}
