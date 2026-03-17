using System.Globalization;

namespace MyUAAcademiaB.Models
{
    public class ActivationRequest
    {
        public string PermanentCode { get; set; }

        public required bool IsActivate { get; set; }
    }
}
