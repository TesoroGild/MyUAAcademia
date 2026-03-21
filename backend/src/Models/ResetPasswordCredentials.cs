namespace MyUAAcademiaB.Models
{
    public class ResetPasswordCredentials
    {
        public string UserCode {  get; set; }
        public string CurrentPwd { get; set; }
        public string NewPwd { get; set; }
    }
}
