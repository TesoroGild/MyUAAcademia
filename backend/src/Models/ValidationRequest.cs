using System.Globalization;

namespace MyUAAcademiaB.Models
{
    public class ValidationRequest
    {
        public string Code { get; set; }

        public required bool IsValidated { get; set; }
    }
}
