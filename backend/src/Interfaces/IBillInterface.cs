using MyUAAcademiaB.Dto;
using MyUAAcademiaB.Models;
using System.Globalization;

namespace MyUAAcademiaB.Interfaces
{
    public interface IBillInterface
    {
        bool BillExists(string sessionStudent, string yearStudy, string permanentCode);
        bool BillExists(string sessionStudent, string yearStudy, string permanentCode, string programTitle);

        /*CREATE*/
        Bills CreateBill(Bills bill);

        /*READ*/
        ICollection<Bills> GetBills();
        ICollection<Bills> GetExpiredBills();
        ICollection<Bills> GetBillsPaidLate();
        ICollection<Bills> GetExpiredBillsBefore(DateTime beforeDate);
        ICollection<Bills> GetExpiredBillsAfter(DateTime afterDate);
        ICollection<BillCoursePrice> GetSessionBill(string permanentCode, string yearCourse, string sessionCourse);
        ICollection<BillCoursePrice> GetCoursesToDropOnBill(string permanentCode, string yearCourse, string sessionCourse, ICollection<int> coursesToDrop);
        ICollection<Bills> GetStudentBills(string permanentCode);
        Bills GetStudentSessionYearProgramBill(string permanentCode, string yearCourse, string sessionCourse, string programTitle);

        /*UPDATE*/
        int UpdateBill(Bills bill);
        Task<int> PayTheBill(BillToUpdateDto billToUpdate);

        /*DELETE*/
    }
}
