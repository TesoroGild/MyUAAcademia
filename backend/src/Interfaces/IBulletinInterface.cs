using MyUAAcademiaB.Dto;
using MyUAAcademiaB.Models;
using static System.Net.Mime.MediaTypeNames;

namespace MyUAAcademiaB.Interfaces
{
    public interface IBulletinInterface
    {
        bool BulletinExists(string permanentCode);
        bool CourseExists(string permanentCode, string courseId);

        /*CREATE*/
        int CreateBulletin(Bulletins bulletinToCreate);
        //Task<int> CreateBulletin(BulletinDto bulletinTocreate);

        /*READ*/
        ICollection<Bulletins> GetBulletins();
        ICollection<Bulletins> GetStudentBulletin(string permanentCode);
        ICollection<Bulletins> GetStudentsCourseBulletin(ICollection<string> test, ICollection<string> permanentCodes);
        string? GetCourseMention(SchoolReportKeysDto schoolReportKeys);

        /*UPDATE*/
        Task<int> UpdateBulletin(Bulletins bulletinToUpdate);

        /*DELETE*/
        Task<int> RemoveCourseTranscript(Bulletins courseToDrop);
    }
}
