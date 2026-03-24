using MyUAAcademiaB.Dto;
using MyUAAcademiaB.Models;

namespace MyUAAcademiaB.Interfaces
{
    public interface IBillService
    {
        double CalculateAmount(IEnumerable<Courses> courses);
        double CalculateAmount(IEnumerable<BillCoursePrice> coursesAPrices);
        Task<int> CreateBill(BillDto billToCreate);
    }
}
