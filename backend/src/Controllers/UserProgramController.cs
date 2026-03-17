using AutoMapper;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using MyUAAcademiaB.Dto;
using MyUAAcademiaB.Interfaces;
using MyUAAcademiaB.Models;
using MyUAAcademiaB.Services;

namespace MyUAAcademiaB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowSpecificOrigin")]
    public class UserProgramController : ControllerBase
    {
        private readonly IUserProgramInterface _userProgramInterface;
        private readonly IUserProgramService _userProgramService;
        private readonly IProgramInterface _programInterface;
        private readonly IMapper _mapper;
        private readonly IUserInterface _userInterface;

        public UserProgramController(
            IUserProgramInterface userProgramInterface, IMapper mapper,
            IUserProgramService userProgramService, IProgramInterface programInterface,
            IUserInterface userInterface)
        {
            _userProgramInterface = userProgramInterface;
            _programInterface = programInterface;
            _userProgramService = userProgramService;
            _mapper = mapper;
            _userInterface = userInterface;
        }

        /*CREATE*/
        [HttpPost("fully-register-student")]
        [ProducesResponseType(200, Type = typeof(bool))]
        [ProducesResponseType(400)]
        public IActionResult FullyRegisterStudent([FromBody] UsersProgramEnrollmentDto userProgramToRegister)
        {
            if (userProgramToRegister == null) return BadRequest(ModelState);
            
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var grade = _programInterface.GetGrade(userProgramToRegister.Title);

            var listLength = userProgramToRegister.PermanentCodes.Count;
            for (int i = 0; i < listLength; i++)
            {
                UserProgramEnrollmentDto reg = new UserProgramEnrollmentDto
                {
                    PermanentCode = userProgramToRegister.PermanentCodes[i],
                    Title = userProgramToRegister.Title
                };
                var userProgramWithDates = _userProgramService.setEstimatedDates(reg, grade);
                var registrationMap = _mapper.Map<UserProgramEnrollment>(userProgramWithDates);
                var userProgramRegistered = _userProgramInterface.RegisterAStudentToAProgram(registrationMap);

                if (userProgramRegistered == null)
                {
                    ModelState.AddModelError("", "Erreur lors de l'enregistrement de l'étudiant à ce programme.");
                    return StatusCode(500, ModelState);
                }
            }

            return Ok(true);
        }

        [HttpPost("register-student")]
        [ProducesResponseType(200, Type = typeof(bool))]
        [ProducesResponseType(400)]
        public IActionResult RegisterStudent([FromBody] UsersProgramEnrollmentDto userProgramToRegister)
        {
            if (userProgramToRegister == null) return BadRequest(ModelState);

            if (!ModelState.IsValid) return BadRequest(ModelState);

            var listLength = userProgramToRegister.PermanentCodes.Count;
            for (int i = 0; i < listLength; i++)
            {
                UserProgramEnrollmentDto reg = new UserProgramEnrollmentDto
                {
                    PermanentCode = userProgramToRegister.PermanentCodes[i],
                    Title = userProgramToRegister.Title
                };
                var registrationMap = _mapper.Map<UserProgramEnrollment>(reg);
                var userProgramRegistered = _userProgramInterface.RegisterAStudentToAProgram(registrationMap);

                if (userProgramRegistered == null)
                {
                    ModelState.AddModelError("", "Erreur lors de l'enregistrement de l'étudiant à ce programme.");
                    return StatusCode(500, ModelState);
                }
            }

            return Ok(true);
        }


        /*READ*/
        [HttpGet("students-registered")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<UserProgramEnrollmentDto>))]
        public IActionResult GetStudentsRegistered() 
        {
            var userPrograms = _userProgramInterface.GetStudentsRegistered();
            var upMap = _mapper.Map<List<UserProgramEnrollmentDto>>(userPrograms);

            if (!ModelState.IsValid) return BadRequest(ModelState);

            return Ok(upMap);
        }

        [HttpGet("students-in-the-program/{progTitle}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<UserV3Dto>))]
        public IActionResult GetStudentsInTheProgram(string progTitle)
        {
            var studentsInProgram = _userProgramInterface.GetStudentsInTheProgram(progTitle);
            var students = _mapper.Map<List<UserV3Dto>>(_userInterface.GetStudents());

            //var studentsNotInProgram = studentsInProgram.Where(sip => !students.Any(s => s.PermanentCode == sip.PermanentCode)).ToList();
            var studentsInTheProgram = students.Where(s => studentsInProgram.Contains(s.PermanentCode)).ToList();


            if (!ModelState.IsValid) return BadRequest(ModelState);

            return Ok(studentsInTheProgram);
        }

        [HttpGet("students-not-in-a-program")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<UserTDDto>))]
        public IActionResult GetStudentsInProgram()
        {
            var studentsInProgram = _userProgramInterface.GetStudentsRegistered();
            var students = _mapper.Map<List<UserTDDto>>(_userInterface.GetStudents());

            //var studentsNotInProgram = studentsInProgram.Where(sip => !students.Any(s => s.PermanentCode == sip.PermanentCode)).ToList();
            var studentsNotInProgram = students.Where(s => !studentsInProgram.Any(sip => sip.PermanentCode == s.PermanentCode)).ToList();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            return Ok(studentsNotInProgram);
        }


        /*UPDATE*/
        [HttpPut("programs-admitted")]
        [ProducesResponseType(200, Type = typeof(bool))]
        public IActionResult ActiveAndDelete([FromBody] StudentProgramDecisionDto studentProgramDecisionDto)
        {
            if (studentProgramDecisionDto.FinalDecisions.Count <= 0) return BadRequest("Aucune modification requise");

            int count = _userProgramInterface.ActiveAndDelete(studentProgramDecisionDto);

            if (count <= 0)
            {
                ModelState.AddModelError("", "Erreur lors de la mise à jour du statut des programmes de l'étudiant.");
                return StatusCode(500, ModelState);
            }
            return Ok(true);
        }


        /*DELETE*/
    }
}
