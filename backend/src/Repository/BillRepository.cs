using Microsoft.EntityFrameworkCore;
using MyUAAcademiaB.Data;
using MyUAAcademiaB.Dto;
using MyUAAcademiaB.Interfaces;
using MyUAAcademiaB.Models;

namespace MyUAAcademiaB.Repository
{
    public class BillRepository : IBillInterface
    {
        private readonly DataContext _context;
        public BillRepository(DataContext context)
        {
            _context = context;
        }

        public bool BillExists(string sessionStudent, string yearStudy, string permanentCode)
        {
            return _context.Bills.Any(bi => bi.SessionStudy == sessionStudent 
            && bi.YearStudy == yearStudy && bi.PermanentCode == permanentCode);
        }

        public bool BillExists(string sessionStudent, string yearStudy, string permanentCode, string programTitle)
        {
            return _context.Bills.Any(bi => bi.SessionStudy == sessionStudent
            && bi.YearStudy == yearStudy && bi.PermanentCode == permanentCode && bi.ProgramTitle == programTitle);
        }

        /*CREATE*/
        public Bills CreateBill(Bills bill)
        {
            _context.Add(bill);
            _context.SaveChanges();
            return bill;
        }

        /*READ*/
        public ICollection<Bills> GetBills()
        {
            return _context.Bills.OrderByDescending(bi => bi.DeadLine)
                .ToList();
        }

        public ICollection<Bills> GetExpiredBills()
        {
            return _context.Bills.Where(bi => bi.DeadLine <  DateTime.Now)
                .OrderByDescending(bi => bi.DeadLine)
                .ToList();
        }

        public ICollection<Bills> GetBillsPaidLate()
        {
            return _context.Bills.Where(bi => bi.DeadLine < bi.DateOfPaiement)
                .OrderByDescending(bi => bi.DeadLine)
                .ToList();
        }

        public ICollection<Bills> GetExpiredBillsBefore(DateTime beforeDate)
        {
            return _context.Bills.Where(bi => bi.DeadLine < beforeDate)
                .OrderByDescending(bi => bi.DeadLine)
                .ToList();
        }

        public ICollection<Bills> GetExpiredBillsAfter(DateTime afterDate)
        {
            return _context.Bills.Where(bi => bi.DeadLine > afterDate)
                .OrderByDescending(bi => bi.DeadLine)
                .ToList();
        }

        public ICollection<BillCoursePrice> GetSessionBill(string permanentCode, string yearCourse, string sessionCourse)
        {
            var coursesId = _context.UserCourses.Where(sc => sc.PermanentCode == permanentCode)
                .Select(sc => sc.CCourseId)
                .ToList();

            var courses = _context.ClassesCourses
                .Where(cc => coursesId.Contains(cc.Id)
                    && cc.SessionCourse == sessionCourse
                    && cc.YearCourse == yearCourse)
                .Select(cc => new BillCoursePrice
                {
                    CourseName = cc.Course.FullName,
                    Price = cc.Course.Price
                })
                .ToList();

            return courses;
        }

        public ICollection<BillCoursePrice> GetCoursesToDropOnBill(string permanentCode, string yearCourse, string sessionCourse, ICollection<int> coursesToDrop)
        {
            var coursesId = _context.UserCourses.Where(uc => uc.PermanentCode == permanentCode)
                .Where(uc => coursesToDrop.Contains(uc.CCourseId))
                .Select(uc => uc.CCourseId)
                .ToList();

            var courses = _context.ClassesCourses
                .Where(cc => coursesId.Contains(cc.Id)
                    && cc.SessionCourse == sessionCourse
                    && cc.YearCourse == yearCourse)
                .Select(cc => new BillCoursePrice
                {
                    CourseName = cc.Course.FullName,
                    Price = cc.Course.Price
                })
                .ToList();

            return courses;
        }

        public ICollection<Bills> GetStudentBills(string permanentCode)
        {
            return _context.Bills.Where(bi => bi.PermanentCode == permanentCode.Trim())
                .OrderByDescending(bi => bi.DateOfIssue)
                .ToList();
        }

        public Bills GetStudentSessionYearProgramBill(string permanentCode, string yearCourse, string sessionCourse, string programTitle)
        {
            return _context.Bills.SingleOrDefault(bi => bi.PermanentCode == permanentCode
                && bi.YearStudy == yearCourse && bi.SessionStudy == sessionCourse && bi.ProgramTitle == programTitle);
        }


        /*UPDATE*/
        public int UpdateBill(Bills bill)
        {
            try
            {
                if (bill.Amount <= 0)
                {
                    _context.Bills.Remove(bill);
                    return 0;
                } else
                {
                    _context.Bills.Update(bill);
                    _context.SaveChanges();
                    return 1;
                }
            } catch (Exception ex)
            {
                Console.WriteLine($"An error occurred while updating the bill: {ex.Message}");
                return -1;
            }
        }

        public async Task<int> PayTheBill(BillToUpdateDto billToUpdate)
        {
            var bill = await _context.Bills
                .FirstOrDefaultAsync(b => b.PermanentCode == billToUpdate.PermanentCode 
                && b.SessionStudy == billToUpdate.SessionStudy && b.SessionStudy == billToUpdate.SessionStudy);

            if (bill == null)
                return 0;

            bill.AmountPaid = billToUpdate.AmountPaid;

            return await _context.SaveChangesAsync();
        }


        /*DELETE*/
    }
}
