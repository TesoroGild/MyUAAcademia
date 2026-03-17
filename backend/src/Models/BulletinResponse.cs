using MyUAAcademiaB.Dto;

namespace MyUAAcademiaB.Models
{
    public class BulletinResponse
    {
        public IEnumerable<SchoolReport> Bulletins { get; set; }
        public double Average { get; set; }
    }
}
