using Microsoft.EntityFrameworkCore;
using MyUAAcademiaB.Data;
using MyUAAcademiaB.Dto;
using MyUAAcademiaB.Interfaces;
using MyUAAcademiaB.Models;

namespace MyUAAcademiaB.Repository
{
    public class UserProgramRepository : IUserProgramInterface
    {
        private readonly DataContext _context;
        public UserProgramRepository(DataContext context)
        {
            _context = context;
        }

        /*CREATE*/
        public UserProgramEnrollment RegisterAStudentToAProgram(UserProgramEnrollment userProgramToRegister)
        {
            _context.Add(userProgramToRegister);
            _context.SaveChanges();
            return userProgramToRegister;
        }
        
        /*READ*/
        public ICollection<string> GetStudentsInTheProgram(string progTitle)
        {
            return _context.UserProgramEnrollments.Where(up => up.Title == progTitle)
                .Select(up => up.PermanentCode)
                .ToList();
        }

        public ICollection<UserProgramEnrollment> GetStudentsRegistered()
        {
            return _context.UserProgramEnrollments.OrderBy(upe => upe.EnrollmentDate)
                .ToList();
        }

        public List<ProgEnrFinDto> GetStudentPrograms(string permanentcode)
        {
            return _context.UserProgramEnrollments.Where(up => up.PermanentCode == permanentcode)
                .Select(up => new ProgEnrFinDto
                {
                    Title = up.Title,
                    IsEnrolled = up.IsEnrolled,
                    HasFinished = up.HasFinished
                })
                .ToList();
        }


        /*UPDATE*/
        public int ActiveAndDelete(StudentProgramDecisionDto studentProgramDecisionDto)
        {
            foreach (var entry in studentProgramDecisionDto.FinalDecisions)
            {
                string title = entry.Title;
                bool val = entry.IsAccepted;
                string code = studentProgramDecisionDto.PermanentCode;

                var program = _context.UserProgramEnrollments
                    .FirstOrDefault(p => p.Title == title && p.PermanentCode == code);

                if (program != null)
                {
                    if (val)
                    {
                        program.IsEnrolled = true;
                        _context.UserProgramEnrollments.Update(program);
                    }
                    else
                    {
                        _context.UserProgramEnrollments.Remove(program);
                    }
                }
            }

            return _context.SaveChanges();
        }
        

        /*DELETE*/
    }
}
