using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MyUAAcademiaB.Data;
using MyUAAcademiaB.Dto;
using MyUAAcademiaB.Interfaces;
using MyUAAcademiaB.Models;

namespace MyUAAcademiaB.Repository
{
    public class UserRepository : IUserInterface
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public UserRepository(DataContext context, IMapper mapper) 
        {
            _context = context;
            _mapper = mapper;
        }

        public bool StudentExists(string permanentCode)
        {
            return _context.Users.Any(u => u.PermanentCode.Substring(0, u.PermanentCode.Length - 2) == permanentCode.Substring(0, permanentCode.Length - 2));
        }

        /*CREATE*/
        public Users CreateStudent(Users student)
        {
            _context.Add(student);
            _context.SaveChanges();
            return student;
        }

        /*READ*/
        public bool UserExistsV1(string permanentCode, string email)
        {
            return _context.Users.Any(e => e.PermanentCode == permanentCode && e.PersonalEmail == email);
        }

        public ICollection<Users> GetProfessors()
        {
            return _context.Users
                .Where(u => u.UserRole == "professor")
                .OrderBy(u => u.LastName)
                .ToList();
        }

        public ICollection<Users> GetStudents()
        {
            return _context.Users
                .Where(u => u.UserRole == "student")
                .OrderBy(u => u.LastName)
                .ToList();
        }

        public ICollection<Users> GetStudentsV2()
        {
            return _context.Users
                .Where(u => u.UserRole == "student")
                .OrderBy(u => u.LastName)
                .ToList();
        }

        public ICollection<UserV3Dto> GetStudentsByCodes(ICollection<string> permanentCodes)
        {
            var students = _context.Users.Where(u => permanentCodes.Contains(u.PermanentCode))
                .ToList();
            return _mapper.Map<List<UserV3Dto>>(students);
        }

        public ICollection<Users> GetUsers()
        {
            return _context.Users
                .OrderBy(u => u.PermanentCode)
                .ToList();
        }

        public ICollection<Users> GetUsersByName(string userName)
        {
            return _context.Users.Where(u => u.LastName == userName || u.FirstName == userName)
                .OrderBy(u => u.PermanentCode)
                .ToList();
        }

        public Users GetUser(string permanentCode)
        {
            return _context.Users.Where(u => u.PermanentCode.ToUpper() == permanentCode.ToUpper())
                .FirstOrDefault();
        }

        //async
        //public ICollection<StudentFiles> GetStudentFiles(string permanentCode)
        //{
        //    //await
        //    return _context.StudentFiles
        //        .Where(f => f.StudentCode == permanentCode)
        //        .ToList ();
        //        //.ToListAsync();
        //}



        /*UPDATE*/
        public bool ActivateStudentAccount(ActivationRequest activationRequest)
        {
            var student = GetUser(activationRequest.Code);
            var activeAccount = 0;

            if (activationRequest.IsActivate) activeAccount = 1;
            else activeAccount = 0;

            if (student != null) 
            {
                student.IsActivated = activeAccount;
                _context.Users.Update(student);
                _context.SaveChanges();
                return true;
            }
            return false;
        }

        public bool ValidateUserAccount(ValidationRequest validationRequest)
        {
            var student = GetUser(validationRequest.Code);
            bool validateAccount;
            if (validationRequest.IsValidated) validateAccount = true;
            else validateAccount = false;

            if (student != null)
            {
                student.IsValidated = validateAccount;
                _context.Users.Update(student);
                _context.SaveChanges();
                return true;
            }
            return false;
        }

        public async Task<int> UpdatePasswordAsync(ResetPasswordCredentials resetPasswordCredentials)
        {//Employees - Users
            var employee = await _context.Users
                .FirstOrDefaultAsync(u => u.PermanentCode == resetPasswordCredentials.UserCode);

            if (employee == null)
                return 0; // utilisateur introuvable

            employee.Pwd = resetPasswordCredentials.NewPwd;
            //employee.UpdatedAt = DateTime.UtcNow;

            return await _context.SaveChangesAsync();
        }

        public Users UpdateStudentProfile(SStudentEltToUpdate eltToUpdate)
        {
            var student = GetUser(eltToUpdate.PermanentCode);

            if(student != null)
            {
                student.PhoneNumber = eltToUpdate.PhoneNumber;
                student.Nas = eltToUpdate.Nas;
                
                if (eltToUpdate.Pwd != null &&  eltToUpdate.Pwd.Trim()!= "")
                    student.Pwd = eltToUpdate.Pwd.Trim();

                _context.Users.Update(student);
                _context.SaveChanges();
            }
            return student;
        }

        /*DELETE*/
    }
}
