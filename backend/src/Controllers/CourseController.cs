using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MyUAAcademiaB.Dto;
using MyUAAcademiaB.Interfaces;
using MyUAAcademiaB.Models;
using MyUAAcademiaB.Services;

namespace MyUAAcademiaB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseController : ControllerBase
    {
        private readonly ICourseInterface _courseInterface;
        private readonly IMapper _mapper;

        public CourseController(ICourseInterface courseInterface, IMapper mapper)
        {
            _courseInterface = courseInterface;
            _mapper = mapper;
        }

        /*CREATE*/
        [HttpPost("courses")]
        [ProducesResponseType(200, Type = typeof(Courses))]
        [ProducesResponseType(400)]
        public IActionResult CreateCourse([FromBody] CourseDto courseTocreate)
        {
            if (courseTocreate == null) return BadRequest(ModelState);

            var studentExist = _courseInterface.CourseExists(courseTocreate.Sigle);

            if (studentExist)
            {
                ModelState.AddModelError("", "Le cours existe déjà.");
                return StatusCode(422, ModelState);
            }

            if (!ModelState.IsValid) return BadRequest(ModelState);

            var courseMap = _mapper.Map<Courses>(courseTocreate);
            var courseCreated = _courseInterface.CreateCourse(courseMap);

            if (courseCreated == null)
            {
                ModelState.AddModelError("", "Erreur lors de la création du cours.");
                return StatusCode(500, ModelState);
            }

            return Ok(courseCreated);
        }

        /*READ*/
        [HttpGet("courses")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<CourseDto>))]
        public IActionResult GetCourses()
        {
            var courses = _mapper.Map<List<CourseDto>>(_courseInterface.GetCourses());

            if (!ModelState.IsValid) return BadRequest(ModelState);

            return Ok(courses);
        }

        [HttpGet("courses/{courseSigle}")]
        [ProducesResponseType(200, Type = typeof(CourseDto))]
        [ProducesResponseType(400)]
        public IActionResult GetCourse(string courseSigle)
        {
            if (!_courseInterface.CourseExists(courseSigle)) return NotFound();

            var course = _mapper.Map<CourseDto>(_courseInterface.GetCourse(courseSigle));

            if (!ModelState.IsValid) return BadRequest(ModelState);

            return Ok(course);
        }

        [HttpGet("courses/program/{programTitle}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<CourseDto>))]
        public IActionResult GetProgramCourses(string programTitle)
        {
            var courses = _mapper.Map<List<CourseDto>>(_courseInterface.GetProgramCourses(programTitle));

            if (!ModelState.IsValid) return BadRequest(ModelState);

            return Ok(courses);
        }

        [HttpPost("courses/program")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<CourseDto>))]
        public IActionResult GetProgramCourses([FromBody] ProgramSelectionDto programsTitlesJson)
        {
            var programsTitles = programsTitlesJson.ProgramsTitles;
            if (programsTitles == null || programsTitles.Count == 0) return BadRequest(ModelState);

            var courses = _mapper.Map<List<CourseDto>>(_courseInterface.GetProgramCoursesByProgram(programsTitles));

            if (!ModelState.IsValid) return BadRequest(ModelState);

            return Ok(courses);
        }

        [HttpPost("courses/sessions")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<CourseDto>))]
        public IActionResult GetSessionCourses([FromBody] SessionsAvailables sessionsAvailables)
        {
            if (sessionsAvailables == null) return BadRequest(ModelState);

            var sessionCourses = _mapper.Map<List<CourseDto>>(_courseInterface.GetSessionCourses(sessionsAvailables));

            if (!ModelState.IsValid) return BadRequest(ModelState);

            return Ok(sessionCourses);
        }

        [HttpPost("courses/session-year-program")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Courses>))]
        public IActionResult GetCoursesBySessionYear([FromBody] CourseRequest progSesYr)
        {
            if (progSesYr == null) return BadRequest(ModelState);

            var sessionCourses = _courseInterface.GetCoursesBySessionYear(progSesYr);

            if (!ModelState.IsValid) return BadRequest(ModelState);

            return Ok(sessionCourses);
        }

        [HttpPost("courses-by-ids")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Course1>))]
        public IActionResult GetSigleName(ICollection<string> courseIds)
        {
            if (courseIds.Count == 0) return BadRequest(ModelState);

            var courses = _courseInterface.GetSigleName(courseIds);

            if (!ModelState.IsValid) return BadRequest(ModelState);

            return Ok(courses);
        }

        [HttpPost("courses-by-id")]
        [ProducesResponseType(200, Type = typeof(Course1))]
        public IActionResult GetSigleName1(string courseId)
        {
            if (string.IsNullOrEmpty(courseId)) return BadRequest(ModelState);

            var course1 = _courseInterface.GetSigleName1(courseId);

            if (!ModelState.IsValid) return BadRequest(ModelState);

            return Ok(course1);
        }

        [HttpPost("student-session-courses")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<CoursePriceDto>))]
        public IActionResult GetSessionCoursePrice(UserSessionInfos userSessionInfos)
        {
            if (userSessionInfos == null) return BadRequest(ModelState);
            var studentClassesCourses = _courseInterface.GetSessionCoursePrice(userSessionInfos);
            var classesCoursesMap = _mapper.Map<List<CoursePriceDto>>(studentClassesCourses);
            return Ok(classesCoursesMap);
        }

    }
}
