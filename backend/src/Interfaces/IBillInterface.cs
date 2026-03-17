using MyUAAcademiaB.Dto;
using MyUAAcademiaB.Models;
using System.Globalization;

namespace MyUAAcademiaB.Interfaces
{
    public interface IBillInterface
    {
        bool BillExists(string sessionStudent, string yearStudy, string permanentCode);

        /*CREATE*/
        Bills CreateBill(Bills bill);

        /*READ*/
        ICollection<Bills> GetBills();
        ICollection<Bills> GetExpiredBills();
        ICollection<Bills> GetBillsPaidLate();
        ICollection<Bills> GetExpiredBillsBefore(DateTime beforeDate);
        ICollection<Bills> GetExpiredBillsAfter(DateTime afterDate);
        ICollection<BillCoursePrice> GetSessionBill(string permanentCode, string yearCourse, string sessionCourse);
        ICollection<Bills> GetStudentBills(string permanentCode);

        /*UPDATE*/
        Bills UpdateBill(Bills bill);
        Task<int> PayTheBill(BillToUpdateDto billToUpdate);

        /*DELETE*/
    }
}
