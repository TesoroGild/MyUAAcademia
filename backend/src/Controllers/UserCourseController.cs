using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyUAAcademiaB.Data;
using MyUAAcademiaB.Dto;
using MyUAAcademiaB.Interfaces;
using MyUAAcademiaB.Models;

namespace MyUAAcademiaB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserCourseController : ControllerBase
    {
        private readonly IClasseCourseInterface _classeCourseInterface;
        private readonly IUserCourseInterface _userCourseInterface;
        private readonly IMapper _mapper;
        private readonly DataContext _context;
        private readonly IBillService _billService;
        private readonly IBulletinService _bulletinService;
        private readonly ICourseInterface _courseInterface;

        public UserCourseController(IClasseCourseInterface classeCourseInterface, IUserCourseInterface userCourseInterface, 
            IMapper mapper, DataContext context, IBillService billService, IBulletinService bulletinService,
            ICourseInterface courseInterface)
        {
            _classeCourseInterface = classeCourseInterface;
            _userCourseInterface = userCourseInterface;
            _mapper = mapper;
            _context = context;
            _billService = billService;
            _bulletinService = bulletinService;
            _courseInterface = courseInterface;
        }

        /*CREATE*/
        [HttpPost("students-courses")]
        [ProducesResponseType(200, Type = typeof(bool))]
        [ProducesResponseType(400)]
        public async Task<IActionResult> RegisterStudentsToCourse([FromBody] UsersCoursesList userCourseToCreate)
        {
            if (userCourseToCreate == null) return BadRequest(ModelState);

            var l1 = userCourseToCreate.PermanentCodes.Count;
            var l2 = userCourseToCreate.CCourseIds.Count;
            var numberRegister = l1 * l2;

            var newStudentsCourses = new List<UserCourse>();
            var coursesSigle = _classeCourseInterface.GetCoursesSigle(userCourseToCreate.CCourseIds);

            foreach (var studentId in userCourseToCreate.PermanentCodes)
            {
                foreach (var courseId in userCourseToCreate.CCourseIds)
                {
                    //Verifier la periode d'inscription du courseid. si c'est meme session meme cours, refuser 
                    bool exists = await _context.UserCourses
                        .AnyAsync(sc => sc.PermanentCode == studentId && sc.CCourseId == courseId);

                    if (!exists)
                    {
                        newStudentsCourses.Add(new UserCourse
                        {
                            CCourseId = courseId,
                            PermanentCode = studentId
                        });
                    }
                }
            }

            if (newStudentsCourses.Any())
            {
                var result = await _userCourseInterface.RegisterStudentsToCoursesAsync(newStudentsCourses);

                if (numberRegister != result)
                {
                    ModelState.AddModelError("", "Erreur lors de l'enregistrement de l'étudiant.");
                    return StatusCode(500, ModelState);
                }
            }

            foreach (var studentId in userCourseToCreate.PermanentCodes)
            {
                var today = DateTime.Now;
                var s = "";
                if (today.Month >= 1 && today.Month <= 4) s = "Hiver";
                if (today.Month >= 5 && today.Month <= 8) s = "Été";
                if (today.Month >= 9 && today.Month <= 12) s = "Automne";

                var billToCreate = new BillDto
                {
                    DateOfIssue = today,
                    DeadLine = today.AddMonths(1),
                    SessionStudy = s,
                    YearStudy = today.Year + "",
                    PermanentCode = studentId,
                };
                var responseBill = await _billService.CreateBill(billToCreate);

                if (responseBill == 404)    
                {
                    ModelState.AddModelError("", "Cet utilisateur n'existe pas.");
                    return StatusCode(404, ModelState);
                }

                if (responseBill == 409)
                {
                    ModelState.AddModelError("", "Aucun élément trouvé.");
                    return StatusCode(409, ModelState);
                }

                if (responseBill == 500)
                {
                    ModelState.AddModelError("", "Erreur lors de la création de la facture.");
                    return StatusCode(500, ModelState);
                }

                foreach (var courseSigle in coursesSigle)
                {
                    var bulletinToCreate = new BulletinDto
                    {
                        PermanentCode = studentId,
                        Sigle = courseSigle
                    };
                    var responseBulletin = await _bulletinService.CreateBulletin(bulletinToCreate);

                    if (responseBulletin == 500)
                    {
                        ModelState.AddModelError("", "Erreur lors de la création d'un bullettin.");
                        return StatusCode(500, ModelState);
                    }
                }
            }

            return Ok(true);
        }


        /*READ*/
        [HttpGet("student-courses/{permanentCode}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<ClassesCourses>))]
        public IActionResult GetStudentClasseCourse(string permanentCode)
        {
            if (string.IsNullOrEmpty(permanentCode)) return BadRequest(ModelState);
            var studentClassesCoursesId = _userCourseInterface.GetStudentClasseCourse(permanentCode);
            var studentCoursesSigle = _classeCourseInterface.GetCoursesSigle(studentClassesCoursesId.ToList());
            var studentCourses = _courseInterface.GetProgramCoursesBySigle(studentCoursesSigle.ToList());

            return Ok(studentCourses);
        }



        /*UPDATE*/
        [HttpPut("modify-student-course")]
        [ProducesResponseType(200, Type = typeof(UserCourse))]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult ModifyUserCourse(UserCourseDto userCourseToModify)
        {
            if (userCourseToModify == null) return BadRequest(ModelState);

            if (!_userCourseInterface.IsStudentRegister(userCourseToModify.Id))
            {
                ModelState.AddModelError("", "N'existe pas.");
                return StatusCode(400, ModelState);
            }

            var userCourseMap = _mapper.Map<UserCourse>(userCourseToModify);
            var isModify = _userCourseInterface.ModifyUserCourse(userCourseMap);

            if (isModify == null)
            {
                ModelState.AddModelError("", "Erreur lors de la création de l'étudiant.");
                return StatusCode(500, ModelState);
            }

            return Ok(isModify);
        }
    }
}
