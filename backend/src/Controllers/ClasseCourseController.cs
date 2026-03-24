
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MyUAAcademiaB.Dto;
using MyUAAcademiaB.Interfaces;
using MyUAAcademiaB.Models;

namespace MyUAAcademiaB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClasseCourseController : ControllerBase
    {
        private readonly IClasseCourseInterface _classeCourseInterface;
        private readonly ICourseInterface _courseInterface;
        private readonly IClasseCourseService _classeCourseService;
        private readonly IMapper _mapper;
        private readonly IUserProgramInterface _userProgramInterface;

        public ClasseCourseController(IClasseCourseInterface classeCourseInterface, ICourseInterface courseInterface,
            IClasseCourseService classeCourseService,IUserProgramInterface userProgramInterface,
            IMapper mapper)
        {
            _classeCourseInterface = classeCourseInterface;
            _courseInterface = courseInterface;
            _userProgramInterface = userProgramInterface;
            _classeCourseService = classeCourseService;
            _mapper = mapper;
        }

        /*CREATE*/
        [HttpPost("classe-course")]
        [ProducesResponseType(200, Type = typeof(ClassesCourses))]
        [ProducesResponseType(400)]
        public IActionResult ScheduleACourse(ClasseCourseDto classeCourseToCreate)
        {
            if (classeCourseToCreate == null) return BadRequest(ModelState);

            var classeCourseToCreateMap = _mapper.Map<ClassesCourses>(classeCourseToCreate);
            var newSchedule = _classeCourseInterface.ScheduleACourse(classeCourseToCreateMap);

            if (newSchedule == null)
            {
                ModelState.AddModelError("", "Erreur lors de la création d'un cours dans une salle.");
                return StatusCode(500, ModelState);
            }

            return Ok(newSchedule);
        }

        /*READ*/
        [HttpPost("classes-courses-by-program-session")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<ClasseCourseDto>))]
        public IActionResult GetClasseCourseByProgramSession([FromBody] CourseRequest programSession)
        {
            var courses = _courseInterface.GetProgramCourses(programSession.ProgramTitle);
            var coursesSigle = courses.Select(c => c.Sigle).ToList();
            var classesCourses = _mapper.Map<List<ClasseCourseDto>>(_classeCourseInterface.GetClasseCourseByProgramSession(coursesSigle, programSession.SessionCourse));

            if (!ModelState.IsValid) return BadRequest(ModelState);

            return Ok(classesCourses);
        }

        [HttpGet("classe-course")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<ClasseCourseDto>))]
        public IActionResult GetClasseCourse()
        {
            var classesCourses = _mapper.Map<List<ClasseCourseDto>>(_classeCourseInterface.GetClasseCourse());

            if (!ModelState.IsValid) return BadRequest(ModelState);

            return Ok(classesCourses);
        }

        [HttpGet("classe-course/{title}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<ClasseCourseDto>))]
        public IActionResult GetClasseCourseByProgram(string title)
        {
            var classesCourses = _mapper.Map<List<ClasseCourseDto>>(_classeCourseInterface.GetClasseCoursesByProgram(title));

            if (!ModelState.IsValid) return BadRequest(ModelState);

            return Ok(classesCourses);
        }

        [HttpPost("student-courses-by-ids")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<ClasseCourses1>))]
        public IActionResult GetClasseCourseById(ICollection<int> courseIds)
        {
            if (courseIds.Count == 0) return BadRequest(ModelState);
            var studentClassesCourses = _classeCourseInterface.GetClasseCourseById(courseIds);
            return Ok(studentClassesCourses);
        }

        [HttpPost("student-session-courses")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<ClasseCourseDto>))]
        public IActionResult GetStudentSessionCourse(UserSessionInfos userSessionInfos)
        {
            if (userSessionInfos == null) return BadRequest(ModelState);
            var studentClassesCourses = _classeCourseInterface.GetStudentSessionCourse(userSessionInfos);
            var classesCoursesMap = _mapper.Map<List<ClasseCourseDto>>(studentClassesCourses);
            return Ok(classesCoursesMap);
        }

        [HttpPost("courses/sessions/{permanentCode}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<ClasseCoursesName>))]
        [ProducesResponseType(400)]
        public IActionResult GetClasseCourseBySessions([FromBody] SessionsAvailables sessionsAvailables, string permanentCode)
        {
            if (sessionsAvailables == null) return BadRequest(ModelState);

            var studentPrograms = _userProgramInterface.GetStudentPrograms(permanentCode);
            var studentPrograms1 = studentPrograms.Where(sp => sp.HasFinished == false).Select(sp => sp.Title);
            var classesCourses = _classeCourseInterface.GetClasseCourseBySessions(sessionsAvailables);
            var test = _classeCourseInterface.GetProgramsSessionCourses(classesCourses, studentPrograms1);
            var coursesIds = test.Select(c => c.CourseSigle).ToList();
            ICollection<Course1> courses = [];

            foreach (string sigle in coursesIds)
            {
                courses.Add(_courseInterface.GetSigleName1(sigle));
            }
            
            var classeCoursesWithNames = _classeCourseService.ClasseCoursesWithNames(test, courses);

            if (!ModelState.IsValid) return BadRequest(ModelState);

            return Ok(classeCoursesWithNames);
        }


        /*UPDATE*/
        [HttpPut("add-remove-student")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<ClassesCourses>))]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult UpdateACourse([FromBody] ClasseCourseDto classesCourses)
        {
            if (classesCourses == null) return BadRequest(ModelState);

            var classeCourseMap = _mapper.Map<ClassesCourses>(classesCourses); 
            var newSchedule = _classeCourseInterface.UpdateACourse(classeCourseMap);

            if (newSchedule == null)
            {
                ModelState.AddModelError("", "Erreur lors de l'inscription de l'étudiant.");
                return StatusCode(500, ModelState);
            }

            return Ok(newSchedule);
        }

        [HttpPut("assign-prof-course")]
        [ProducesResponseType(200, Type = typeof(bool))]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> AssignProfToClasseCourse([FromBody] ProfCCoursesIdDto profCourseIds)
        {
            if (profCourseIds == null) return BadRequest(ModelState);

            var courseExist = _classeCourseInterface.IsClasseExist(profCourseIds.ClassCourseId+"");

            if (!courseExist)
            {
                return StatusCode(400, new { message = "Le prof ou le cours n'existe pas" });
            }

            var rslt = await _classeCourseInterface.AddProfessor(profCourseIds);

            if (rslt <= 0)
            {
                ModelState.AddModelError("", "Erreur lors de l'assignation du professeur.");
                return StatusCode(500, ModelState);
            }

            return Ok(true);
        }

        //[HttpPut("unsubcribe-student")]
        //[ProducesResponseType(200)]
        //[ProducesResponseType(400)]
        //[ProducesResponseType(404)]
        //public IActionResult UnsubcribeStudentToACourse(string permanentCode) {
        //    if (permanentCode == null || permanentCode == "") return BadRequest(ModelState);

        //    if (!_userInterface.StudentExists(permanentCode))
        //    {
        //        ModelState.AddModelError("", "L'étudiant n'existe pas.");
        //        return StatusCode(400, ModelState);
        //    }

        //    var isUnsubcribe = _classeCourseInterface.UnsubcribeStudentToACourse(permanentCode);

        //    if (!isUnsubcribe)
        //    {
        //        ModelState.AddModelError("", "Erreur lors de l'annulation de cours de l'étudiant.");
        //        return StatusCode(500, ModelState);
        //    }

        //    return Ok(isUnsubcribe);
        //}
    }
}
