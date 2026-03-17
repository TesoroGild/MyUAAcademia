using AutoMapper;
using Microsoft.AspNetCore.Identity;
using MyUAAcademiaB.Dto;
using MyUAAcademiaB.Interfaces;
using MyUAAcademiaB.Models;

namespace MyUAAcademiaB.Services
{
    public class BillService : IBillService
    {
        private readonly IUserInterface _userInterface;
        private readonly IBillInterface _billInterface;
        private readonly IClasseCourseInterface _classeCourseInterface;
        private readonly IMapper _mapper;

        public BillService(IUserInterface userInterface, IBillInterface billInterface, IClasseCourseInterface classeCourseInterface,
            IMapper mapper)
        {
            _userInterface = userInterface;
            _billInterface = billInterface;
            _classeCourseInterface = classeCourseInterface;
            _mapper = mapper;
        }
        public double CalculateAmount(IEnumerable<Courses> courses)
        {
            if (courses == null || !courses.Any())
            {
                return 0;
            }

            return courses.Sum(c => c.Price);
        }

        public async Task<int> CreateBill(BillDto billToCreate)
        {
            if (!_userInterface.StudentExists(billToCreate.PermanentCode))
            {
                return 404;
            }

            if (_billInterface.BillExists(billToCreate.SessionStudy, billToCreate.YearStudy, billToCreate.PermanentCode))
            {
                return 409;
            }

            var allUserCourses = _billInterface.GetSessionBill(billToCreate.PermanentCode, billToCreate.YearStudy, billToCreate.SessionStudy);
            var courseName = allUserCourses.Select(auc => auc.CourseName).ToList();
            var courses = _classeCourseInterface.GetSessionCourses(billToCreate.SessionStudy, billToCreate.YearStudy, courseName);

            if (courses.Count == 0)
            {
                return 409;
            }

            var amount = CalculateAmount(courses);
            billToCreate.Amount = amount;
            var billMap = _mapper.Map<Bills>(billToCreate);
            var billCreated = _billInterface.CreateBill(billMap);

            if (billCreated == null)
            {
                return 500;
            }

            return 200;
        }
    }
}
