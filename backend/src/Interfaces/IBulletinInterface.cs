using MyUAAcademiaB.Models;
using static System.Net.Mime.MediaTypeNames;

namespace MyUAAcademiaB.Interfaces
{
    public interface IBulletinInterface
    {
        bool BulletinExists(string permanentCode);
        bool CourseExists(string permanentCode, string courseId);

        /*CREATE*/
        Bulletins CreateBulletin(Bulletins bulletinToCreate);

        /*READ*/
        ICollection<Bulletins> GetBulletins();
        ICollection<Bulletins> GetStudentBulletin(string permanentCode);
        ICollection<Bulletins> GetStudentsCourseBulletin(ICollection<string> test, ICollection<string> permanentCodes);

        /*UPDATE*/
        Task<int> UpdateBulletin(Bulletins bulletinToUpdate);

        /*DELETE*/
    }
}
