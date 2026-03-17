using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MyUAAcademiaB.Dto;
using MyUAAcademiaB.Interfaces;
using MyUAAcademiaB.Models;

namespace MyUAAcademiaB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BulletinController : ControllerBase
    {
        private readonly IBulletinInterface _bulletinInterface;
        public readonly ICourseInterface _courseInterface;
        private readonly IUserInterface _userInterface;
        private readonly IUserCourseInterface _userCourseInterface;
        private readonly IClasseCourseInterface _classeCourseInterface;

        private readonly IBulletinService _bulletinService;
        private readonly ISchoolReportService _schoolReportService;

        private readonly IMapper _mapper;

        public BulletinController( IBulletinInterface bulletinInterface, ICourseInterface courseInterface,
            IUserInterface userInterface, IUserCourseInterface userCourseInterface, 
            IClasseCourseInterface classeCourseInterface, IBulletinService bulletinService,
            ISchoolReportService schoolReportService, IMapper mapper)
        {
            _bulletinInterface = bulletinInterface;
            _courseInterface = courseInterface;
            _classeCourseInterface = classeCourseInterface;
            _userInterface = userInterface;
            _userCourseInterface = userCourseInterface;
            _bulletinService = bulletinService;
            _schoolReportService = schoolReportService;
            _mapper = mapper;
        }

        /*CREATE*/
        [HttpPost("bulletins")]
        [ProducesResponseType(200, Type = typeof(Bulletins))]
        [ProducesResponseType(400)]
        public IActionResult CreateBulletin([FromBody] BulletinDto bulletinTocreate)
        {
            if (bulletinTocreate == null) return BadRequest(ModelState);

            if (!_userInterface.StudentExists(bulletinTocreate.PermanentCode))
            {
                ModelState.AddModelError("", "Cet utilisateur n'existe pas.");
                return StatusCode(404, ModelState);
            }

            if (_bulletinInterface.CourseExists(bulletinTocreate.PermanentCode, bulletinTocreate.Sigle))
            {
                ModelState.AddModelError("", "Ce cours existe déjà sur ce bullettin.");
                return StatusCode(409, ModelState);
            }

            if (!ModelState.IsValid) return BadRequest(ModelState);

            var bulletinMap = _mapper.Map<Bulletins>(bulletinTocreate);
            var bulletinCreated = _bulletinInterface.CreateBulletin(bulletinMap);

            if (bulletinCreated == null)
            {
                ModelState.AddModelError("", "Erreur lors de la création d'un bullettin.");
                return StatusCode(500, ModelState);
            }

            return Ok(bulletinCreated);
        }

        /*READ*/
        [HttpGet("bulletins")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Bulletins>))]
        public IActionResult GetBulletins()
        {
            var bulletins = _bulletinInterface.GetBulletins();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            return Ok(bulletins);
        }


        [HttpGet("bulletin/{permanentCode}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<BulletinResponse>))]
        [ProducesResponseType(400)]
        public IActionResult GetStudentBulletin(string permanentCode)
        {
            if (string.IsNullOrEmpty(permanentCode)) return BadRequest(ModelState);
            if (!_bulletinInterface.BulletinExists(permanentCode)) return NotFound();

            var studentBulletin = _bulletinInterface.GetStudentBulletin(permanentCode);
            var list1Sorted = studentBulletin.OrderBy(l1s => l1s.Sigle);
            var studentBulletinMap = _mapper.Map<List<BulletinDto>>(list1Sorted);

            var classesCoursesId = _userCourseInterface.GetStudentClasseCourse(permanentCode);
            var bulletinCourses = _classeCourseInterface.GetClasseCourseById(classesCoursesId);

            var courseIds = bulletinCourses
                .OrderBy(bc => bc.CourseId)
                .Select(bc => bc.CourseId)
                .ToList();
            var courses = _courseInterface.GetSigleName(courseIds);

            var schoolReport = _schoolReportService.CreateSchoolReport(studentBulletinMap, bulletinCourses, courses);
            var average = _bulletinService.CalculateAverage(studentBulletin);

            if (!ModelState.IsValid) return BadRequest(ModelState);

            var bulletin = new BulletinResponse
            {
                Bulletins = schoolReport,
                Average = average
            };

            return Ok(bulletin);
        }

        /*UPDATE*/
        [HttpPut("bulletins")]
        [ProducesResponseType(200, Type = typeof(bool))]
        [ProducesResponseType(207)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UpdateBulletin([FromBody] List<BulletinDto> bulletinsToUpdate)
        {
            if (bulletinsToUpdate == null) return BadRequest(ModelState);

            var invalidStudent = 0;
            var updatesFailed = 0;
            var student404 = new List<string>();
            var bull500 = new List<string>();

            foreach (var bulletinToUpdate in bulletinsToUpdate)
            {
                if (!_userInterface.StudentExists(bulletinToUpdate.PermanentCode))
                {
                    invalidStudent++;
                    student404.Add(bulletinToUpdate.PermanentCode);
                } 
                else
                {
                    if (bulletinToUpdate.Grade != null && bulletinToUpdate.Grade.ToString().Trim() != "")
                        if (bulletinToUpdate.Mention == null || bulletinToUpdate.Mention == "")
                            bulletinToUpdate.Mention = _bulletinService.SetMention(bulletinToUpdate.Grade);

                    var bulletinMap = _mapper.Map<Bulletins>(bulletinToUpdate);
                    var res = await _bulletinInterface.UpdateBulletin(bulletinMap);

                    if (res <= 0) updatesFailed++;
                }
            }

            if (invalidStudent != 0 || updatesFailed != 0)
            {
                if (invalidStudent == bulletinsToUpdate.Count)
                {
                    ModelState.AddModelError("", "Etudiants non existants!.");
                    return StatusCode(400, ModelState);
                }
                else if (updatesFailed == bulletinsToUpdate.Count)
                {
                    ModelState.AddModelError("", "Erreur lors de l'ajout des notes!.");
                    return StatusCode(500, ModelState);
                }
                else
                {
                    return StatusCode(207, new
                    {
                        message = "Etudiants non existants!",
                        failedItems = student404
                    });
                }
            }

            return Ok(false);
        }
    }
}
