using Microsoft.EntityFrameworkCore;
using MyUAAcademiaB.Data;
using MyUAAcademiaB.Interfaces;
using MyUAAcademiaB.Models;

namespace MyUAAcademiaB.Repository
{
    public class BulletinRepository : IBulletinInterface
    {
        private readonly DataContext _context;
        public BulletinRepository(DataContext context)
        {
            _context = context;
        }

        /*BOOL*/
        public bool BulletinExists(string permanentCode)
        {
            return _context.Bulletins.Any(b => b.PermanentCode == permanentCode);
        }

        //public bool BullettinExists(string permanentCode)
        //{
        //    return _context.Bulletins.Any(b => b.PermanentCode == permanentCode);
        //}

        public bool CourseExists(string permanentCode, string courseId)
        {
            return _context.Bulletins.Any(b => b.PermanentCode == permanentCode && b.Sigle == courseId);
        }

        /*CREATE*/
        public Bulletins CreateBulletin(Bulletins bulletinToCreate)
        {
            _context.Add(bulletinToCreate);
            _context.SaveChanges();
            return bulletinToCreate;
        }

        /*READ*/
        public ICollection<Bulletins> GetBulletins()
        {
            return _context.Bulletins.ToList();
        }

        public ICollection<Bulletins> GetStudentBulletin(string permanentCode)
        {
            return _context.Bulletins.Where(bu => bu.PermanentCode == permanentCode).ToList();
        }

        public ICollection<Bulletins> GetStudentsCourseBulletin(ICollection<string> test, ICollection<string> permanentCodes)
        {
            var schoolReports = new List<Bulletins>();
            return _context.Bulletins.Where(b => permanentCodes.Contains(b.PermanentCode) && test.Contains(b.Sigle))
                .ToList();
        }


        /*UPDATE*/
        public async Task<int> UpdateBulletin(Bulletins bulletinToUpdate)
        {
            var report = await _context.Bulletins
                .FirstOrDefaultAsync(b => b.PermanentCode == bulletinToUpdate.PermanentCode && b.Sigle == bulletinToUpdate.Sigle);

            if (report == null)
                return 0;

            report.Grade = bulletinToUpdate.Grade;
            report.Mention = bulletinToUpdate.Mention;

            return await _context.SaveChangesAsync();
        }

        /*DELETE*/
    }
}
