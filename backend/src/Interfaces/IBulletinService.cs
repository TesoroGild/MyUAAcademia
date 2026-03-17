using MyUAAcademiaB.Dto;
using MyUAAcademiaB.Models;

namespace MyUAAcademiaB.Interfaces
{
    public interface IBulletinService
    {
        //decimal
        double CalculateAverage(IEnumerable<Bulletins> bullettins);
        string SetMention(double grade);
        Task<int> CreateBulletin(BulletinDto bulletinTocreate);
    }
}
