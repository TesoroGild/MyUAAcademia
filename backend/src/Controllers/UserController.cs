using AutoMapper;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using MyUAAcademiaB.Dto;
using MyUAAcademiaB.Interfaces;
using MyUAAcademiaB.Models;
using System.Globalization;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.AspNetCore.Authorization;

namespace MyUAAcademiaB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowSpecificOrigin")]
    public class UserController(IUserInterface userInterface, IUserService userService,
        IMapper mapper, IAuthService authService, IUserProgramInterface userProgramInterface,
        IFileService fileService, IUserCourseInterface userCourseInterface, IClasseCourseInterface classeCourseInterface,
        IBulletinInterface bulletinInterface) : ControllerBase
    {
        private readonly IAuthService _authService = authService;
        private readonly IUserInterface _userInterface = userInterface;
        private readonly IUserService _userService = userService;
        private readonly IUserProgramInterface _userProgramInterface = userProgramInterface;
        private readonly IMapper _mapper = mapper;
        private readonly IFileService _fileService = fileService;
        private readonly IClasseCourseInterface _classeCourseInterface = classeCourseInterface;
        private readonly IUserCourseInterface _userCourseInterface = userCourseInterface;
        private readonly IBulletinInterface _bulletinInterface = bulletinInterface;

        //EXIST
        [HttpPost("exist")]
        [ProducesResponseType(200, Type = typeof(VerifiedUserDto))]
        [ProducesResponseType(400)]
        //[Authorize(Roles = "admin, professor, student")]
        public IActionResult GetEmployee([FromBody] ExistCredentialsDto credentials)
        {
            if (!_userInterface.UserExistsV1(credentials.Code, credentials.Email))
                return BadRequest(new
                {
                    success = false,
                    message = "Aucun compte associé."
                });

            var student = _userInterface.GetUser(credentials.Code);

            if (!ModelState.IsValid) return BadRequest(ModelState);

            return Ok(new VerifiedUserDto
            {
                FirstName = student.FirstName,
                LastName = student.LastName,
                UserRole = student.UserRole,
                UserCode = student.PermanentCode
            });
        }


        /*CREATE*/
        [HttpPost("students")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Users>))]
        [ProducesResponseType(400)]
        //FromBody
        public async Task<IActionResult> CreateStudent([FromForm] UserTCDto studentTocreate)
        {
            if (studentTocreate == null) return BadRequest(ModelState);

            DateOnly parseBirthDay;

            DateOnly.TryParseExact(studentTocreate.BirthDay, "yyyy-MM-dd",
                           CultureInfo.InvariantCulture,
                           DateTimeStyles.None,
                           out parseBirthDay);

            var permanentCode = _userService.GeneratePermanentCode(studentTocreate.LastName, studentTocreate.FirstName, parseBirthDay, studentTocreate.Sexe);
            var studentExist = _userInterface.StudentExists(permanentCode);

            if (studentExist)
            {
                ModelState.AddModelError("", "L'étudiant existe déjà.");
                return StatusCode(422, ModelState);
            }

            if (!ModelState.IsValid) return BadRequest(ModelState);

            studentTocreate.PermanentCode = permanentCode;
            var email = _userService.GenerateEmail(studentTocreate.FirstName, studentTocreate.LastName);
            var studentMap = _mapper.Map<Users>(studentTocreate);
            studentMap.IsActivated = 0;
            if (string.IsNullOrWhiteSpace(studentTocreate.EmployeeCode)) studentMap.Pwd = 
                    _authService.HashPassword(permanentCode, _userService.SetFirstPasssword(studentTocreate.LastName, studentTocreate.FirstName));
            else studentMap.Pwd = _authService.HashPassword(permanentCode, studentTocreate.Password);
            studentMap.ProfessionalEmail = email;
            var userCreated = _userInterface.CreateStudent(studentMap);

            if (userCreated == null)
            {
                ModelState.AddModelError("", "Erreur lors de la création de l'étudiant.");
                return StatusCode(500, ModelState);
            }

            if (studentTocreate.ProgramTitle.Length > 0)
            {
                foreach (var prog in studentTocreate.ProgramTitle)
                {
                    UserProgramEnrollmentDto reg = new UserProgramEnrollmentDto
                    {
                        PermanentCode = userCreated.PermanentCode,
                        Title = prog
                    };
                    var registrationMap = _mapper.Map<UserProgramEnrollment>(reg);
                    var userProgramRegistered = _userProgramInterface.RegisterAStudentToAProgram(registrationMap);

                    if (userProgramRegistered == null)
                    {
                        ModelState.AddModelError("", "Erreur lors de l'enregistrement de l'étudiant à ce programme.");
                        return StatusCode(500, ModelState);
                    }
                }
            }

            if (studentTocreate.IdentityProof != null)
            {
                await _fileService.SaveFileAsync(studentTocreate.IdentityProof, "StudentsAdmission", studentTocreate.PermanentCode, "Preuve d'identité");
            }
            if (studentTocreate.Picture != null)
            {
                await _fileService.SaveFileAsync(studentTocreate.Picture, "StudentsAdmission", studentTocreate.PermanentCode, "Photo");
            }
            if (studentTocreate.SchoolTranscript != null)
            {
                await _fileService.SaveFileAsync(studentTocreate.SchoolTranscript, "StudentsAdmission", studentTocreate.PermanentCode, "Relevés scolaires");
            }

            return Ok(userCreated);
        }

        /*READ*/
        [HttpGet("professors")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<UserTDDto>))]
        public IActionResult GetProfessors()
        {
            var professors = _mapper.Map<List<UserTDDto>>(_userInterface.GetProfessors());

            if (!ModelState.IsValid) return BadRequest(ModelState);

            return Ok(professors);
        }

        [HttpGet("students")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<UserTDDto>))]
        public IActionResult GetStudents()
        {
            var students = _mapper.Map<List<UserTDDto>>(_userInterface.GetStudents());

            if (!ModelState.IsValid) return BadRequest(ModelState);

            return Ok(students);
        }

        [HttpGet("studentsV2")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<UserV2Dto>))]
        public IActionResult GetStudentsV2()
        {
            var studentsV2 = _mapper.Map<List<UserV2Dto>>(_userInterface.GetStudentsV2());

            if (!ModelState.IsValid) return BadRequest(ModelState);

            return Ok(studentsV2);
        }

        [HttpGet("students/{permanentCode}")]
        [ProducesResponseType(200, Type = typeof(UserTDDto))]
        [ProducesResponseType(400)]
        public IActionResult GetStudent(string permanentCode)
        {
            if (!_userInterface.StudentExists(permanentCode)) return NotFound();

            var student = _mapper.Map<UserTDDto>(_userInterface.GetUser(permanentCode));

            if (!ModelState.IsValid) return BadRequest(ModelState);

            return Ok(student);
        }

        [HttpGet("files/{permanentCode}")]
        [ProducesResponseType(200, Type = typeof(FilesDto))]
        [ProducesResponseType(400)]
        public IActionResult GetAdmisionFiles(string permanentCode)
        {
            if (!_userInterface.StudentExists(permanentCode)) return NotFound();

            var studentFiles = _fileService.GetFiles(permanentCode, "StudentsAdmission");
            foreach (var file in studentFiles)
            {
                file.Url = Url.Content(file.Url);
            }

            return Ok(studentFiles);
        }

        [HttpGet("test/{folder}/{code}/{fileName}")]
        [ProducesResponseType(200, Type = typeof(FilesDto))]
        [ProducesResponseType(400)]
        public IActionResult Test(string folder, string code, string fileName)
        {
            var path = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", folder, code, fileName);
            if (!System.IO.File.Exists(path))
                return NotFound();

            var provider = new FileExtensionContentTypeProvider();
            if (!provider.TryGetContentType(path, out var contentType))
            {
                contentType = "application/octet-stream"; // fallback
            }

            return PhysicalFile(path, contentType, fileName);
        }

        [HttpGet("users")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<UserTCDto>))]
        public IActionResult GetUsers()
        {
            var users = _mapper.Map<List<UserTCDto>>(_userInterface.GetUsers());

            if (!ModelState.IsValid) return BadRequest(ModelState);

            return Ok(users);
        }

        [HttpPost("usersByUsername")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<UserTCDto>))]
        [ProducesResponseType(400)]
        public IActionResult GetUsersByName([FromBody] string userName)
        {
            if (userName == null || userName == "")  return BadRequest("Invalid username.");

            var students = _mapper.Map<List<UserTCDto>>(_userInterface.GetUsersByName(userName));

            if (!ModelState.IsValid) return BadRequest(ModelState);

            return Ok(students);
        }

        [HttpGet("program/{classeCourseId}")]
        [ProducesResponseType(200)]
        public IActionResult GetStudentInClasseCourse(int classeCourseId)
        {
            var courseExist = _classeCourseInterface.IsClasseExist(classeCourseId+"");

            if (!courseExist)
            {
                ModelState.AddModelError("", "Aucun cours trouvé.");
                return StatusCode(404, ModelState);
            }

            List<int> classeCourseIds = new List<int>();
            classeCourseIds.Add(classeCourseId);
            //verif si l'etudiant a deja une note dans bulletin
            var permanentCodes = _userCourseInterface.GetPermanentCodes(classeCourseId+"");
            var test = _classeCourseInterface.GetCoursesSigle(classeCourseIds);
            var schoolReports = _bulletinInterface.GetStudentsCourseBulletin(test, permanentCodes);
            var students = _userInterface.GetStudentsByCodes(permanentCodes);

            var studentsAndNotes = students
                .Select(s => new
                {
                    PermanentCode = s.PermanentCode,
                    FirstName = s.FirstName,
                    LastName = s.LastName,
                    Grade = schoolReports.FirstOrDefault(sr => sr.PermanentCode == s.PermanentCode)?.Grade,
                    Mention = schoolReports.FirstOrDefault(sr => sr.PermanentCode == s.PermanentCode)?.Mention,
                })
                .ToList();

            return Ok(studentsAndNotes);
        }

        /*UPDATE*/
        [HttpPut("students/activate")]
        [ProducesResponseType(200, Type = typeof(bool))]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult ActivateStudentAccount([FromBody] ActivationRequest activationRequest)
        {
            if (activationRequest == null) return BadRequest(ModelState);

            if(!_userInterface.StudentExists(activationRequest.Code))
            {
                ModelState.AddModelError("", "L'étudiant n'existe pas.");
                return StatusCode(400, ModelState);
            }

            var isActivated = _userInterface.ActivateStudentAccount(activationRequest);

            if (!isActivated)
            {
                ModelState.AddModelError("", "Erreur lors de la création de l'étudiant.");
                return StatusCode(500, ModelState);
            }

            return Ok(isActivated);
        }

        [HttpPut("validate")]
        [ProducesResponseType(200, Type = typeof(bool))]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult ValidateUserAccount([FromBody] ValidationRequest validationRequest)
        {
            if (validationRequest == null) return BadRequest(ModelState);

            if (!_userInterface.StudentExists(validationRequest.Code))
            {
                ModelState.AddModelError("", "Aucun étudiant trouvé.");
                return StatusCode(400, ModelState);
            }

            var isActivated = _userInterface.ValidateUserAccount(validationRequest);

            if (!isActivated)
            {
                ModelState.AddModelError("", "Erreur lors de la validation de l'employé.");
                return StatusCode(500, ModelState);
            }

            return Ok(isActivated);
        }

        [HttpPut("students")]
        [ProducesResponseType(200, Type = typeof(Users))]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult UpdateStudent([FromBody] SStudentEltToUpdate eltToUpdate)
        {
            if (eltToUpdate == null) return BadRequest(ModelState);

            if (!_userInterface.StudentExists(eltToUpdate.PermanentCode))
            {
                ModelState.AddModelError("", "L'étudiant n'existe pas.");
                return StatusCode(400, ModelState);
            }

            var studentUpdated = _userInterface.UpdateStudentProfile(eltToUpdate);

            if (studentUpdated == null)
            {
                ModelState.AddModelError("", "Erreur lors de la modification de l'étudiant.");
                return StatusCode(500, ModelState);
            }

            return Ok(studentUpdated);
        }
    }
    
}
