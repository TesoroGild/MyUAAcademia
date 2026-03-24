using Microsoft.EntityFrameworkCore;
using MyUAAcademiaB.Data;
using MyUAAcademiaB.Dto;
using MyUAAcademiaB.Interfaces;
using MyUAAcademiaB.Models;
using System.Reflection.Metadata.Ecma335;

namespace MyUAAcademiaB.Repository
{
    public class UserCourseRepository : IUserCourseInterface
    {
        private readonly DataContext _context;
        public UserCourseRepository(DataContext context)
        {
            _context = context;
        }

        /*BOOL*/
        public bool IsStudentRegister(int studentId)
        {
            return _context.UserCourses.Any(uc => uc.Id == studentId);
        }


        /*CREATE*/
        public UserCourse RegisterStudentToCourse(UserCourse userClasse)
        {
            _context.Add(userClasse);
            _context.SaveChanges();
            return userClasse;
        }

        public async Task<int> RegisterStudentsToCoursesAsync(List<UserCourse> usersClasses)
        {
            _context.AddRange(usersClasses);
            var result = await _context.SaveChangesAsync();
            return result;
        }


        /*READ*/
        public ICollection<int> GetStudentClasseCourse(string permanentCode)
        {
            return _context.UserCourses.Where(cci => cci.PermanentCode == permanentCode)
                .Select(cci => cci.CCourseId)
                .ToList();
        }

        public ICollection<string> GetPermanentCodes(string classeCourse)
        {
            return _context.UserCourses.Where(cc => cc.CCourseId.ToString().Equals(classeCourse))
                .Select(cc => cc.PermanentCode)
                .ToList();
        }


        /*UPDATE*/
        public UserCourse ModifyUserCourse(UserCourse userClasses)
        {
            _context.UserCourses.Update(userClasses);
            _context.SaveChanges();
            return userClasses;
        }

        public async Task<int> DropCourses(List<UserCourse> usersClasses)
        {
            var keys = usersClasses.Select(u => $"{u.PermanentCode}|{u.CCourseId}").ToList();

            var toDelete = await _context.UserCourses
                .Where(db => keys.Contains(db.PermanentCode + "|" + db.CCourseId))
                .ToListAsync();

            _context.UserCourses.RemoveRange(toDelete);
            return await _context.SaveChangesAsync();
        }
    }
}
