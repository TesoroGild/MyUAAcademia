using AutoMapper;
using MyUAAcademiaB.Dto;
using MyUAAcademiaB.Interfaces;
using MyUAAcademiaB.Models;

namespace MyUAAcademiaB.Services
{
    public class BulletinService : IBulletinService
    {
        private readonly IBulletinInterface _bulletinInterface;
        private readonly IMapper _mapper;
        private readonly IUserCourseInterface _userCourseInterface;
        private readonly IClasseCourseInterface _classeCourseInterface;
        private readonly ICourseInterface _courseInterface;
        private readonly ISchoolReportService _schoolReportService;
        //private readonly _;

        public BulletinService(IBulletinInterface bulletinInterface, IMapper mapper, IUserCourseInterface userCourseInterface,
            IClasseCourseInterface classeCourseInterface, ICourseInterface courseInterface, ISchoolReportService schoolReportService) 
        {
            _bulletinInterface = bulletinInterface;
            _mapper = mapper;
            _userCourseInterface = userCourseInterface;
            _classeCourseInterface = classeCourseInterface;
            _courseInterface = courseInterface;
            _schoolReportService = schoolReportService;
        }

        public double CalculateAverage(IEnumerable<Bulletins> bullettins)
        {
            if (bullettins == null || !bullettins.Any())
            {
                return 0.0;
            }

            var grades = bullettins.Select(b => b.Grade).Where(b => b.HasValue);
            return (double)(grades.Any() ? grades.Average() : 0.0);

        }

        public string SetMention(double grade)
        {
            if (grade >= 95) return "A+";
            if (grade >= 90) return "A";
            if (grade >= 85) return "A-";
            if (grade >= 82) return "B+";
            if (grade >= 78) return "B";
            if (grade >= 75) return "B-";
            if (grade >= 72) return "C+";
            if (grade >= 68) return "C";
            if (grade >= 65) return "C-";
            if (grade >= 62) return "D+";
            if (grade >= 60) return "D";
            if (grade >= 50) return "D-";
            return "E";
        }

        public async Task<int> CreateBulletin(BulletinDto bulletinTocreate)
        {
            var bulletinMap = _mapper.Map<Bulletins>(bulletinTocreate);
            var bulletinCreated = _bulletinInterface.CreateBulletin(bulletinMap);

            if (bulletinCreated == null)
            {
                return 500;
            }

            return 200;
        }
    }
}
