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
        private readonly IBillInterface _billInterface;
        private readonly IBulletinService _bulletinService;
        private readonly ICourseInterface _courseInterface;
        private readonly IBulletinInterface _bulletinInterface;

        public UserCourseController(IClasseCourseInterface classeCourseInterface, IUserCourseInterface userCourseInterface, 
            IMapper mapper, DataContext context, IBillService billService, IBulletinService bulletinService,
            ICourseInterface courseInterface, IBillInterface billInterface, IBulletinInterface bulletinInterface)
        {
            _classeCourseInterface = classeCourseInterface;
            _userCourseInterface = userCourseInterface;
            _mapper = mapper;
            _context = context;
            _billService = billService;
            _bulletinService = bulletinService;
            _courseInterface = courseInterface;
            _billInterface = billInterface;
            _bulletinInterface = bulletinInterface;
        }

        /*CREATE*/
        [HttpPost("students-courses")]
        [ProducesResponseType(200, Type = typeof(bool))]
        [ProducesResponseType(400)]
        public async Task<IActionResult> RegisterStudentsToCourse([FromBody] UsersCoursesList userCourseToCreate)
        {
            if (userCourseToCreate == null) return BadRequest(ModelState);

            var l1 = userCourseToCreate.PermanentCodes.Count;
            var l2 = userCourseToCreate.CCourseIdsToAdd.Count;
            var l3 = userCourseToCreate.CCourseIdsToDrop.Count;

            var numberOfRegistrations = l1 * l2;
            var numberOfUnregistrations = l1 * l3;

            var studentsCoursesToDrop = new List<UserCourse>();
            var coursesToDrop = _classeCourseInterface.GetCoursesSigle(userCourseToCreate.CCourseIdsToDrop);
            var newStudentsCourses = new List<UserCourse>();
            var coursesSigle = _classeCourseInterface.GetCoursesSigle(userCourseToCreate.CCourseIdsToAdd);

            foreach (var studentId in userCourseToCreate.PermanentCodes)
            {
                foreach (var courseId in userCourseToCreate.CCourseIdsToDrop)
                {
                    bool exists = await _context.UserCourses
                        .AnyAsync(sc => sc.PermanentCode == studentId && sc.CCourseId == courseId);

                    if (exists)
                    {
                        studentsCoursesToDrop.Add(new UserCourse
                        {
                            CCourseId = courseId,
                            PermanentCode = studentId
                        });
                    }
                }

                foreach (var courseId in userCourseToCreate.CCourseIdsToAdd)
                {
                    //Verifier la periode d'inscription du courseid. meme session meme cours, refuser 
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

            //Par la suite, recuperer la session et l'année d'étude depuis le cours et non par rapport à la date actuelle.
            var today = DateTime.Now;
            var s = "";
            if (today.Month >= 1 && today.Month <= 4) s = "Hiver";
            if (today.Month >= 5 && today.Month <= 8) s = "Été";
            if (today.Month >= 9 && today.Month <= 12) s = "Automne";
            
            if (studentsCoursesToDrop.Count != 0)
            {
                foreach (var studentId in userCourseToCreate.PermanentCodes)
                {
                    var exist = _billInterface.BillExists(s, today.Year + "", studentId);
                    if (exist)
                    {
                        var userSessionCourses = _billInterface.GetCoursesToDropOnBill(studentId, today.Year + "", s, userCourseToCreate.CCourseIdsToDrop);

                        if (userSessionCourses.Count == 0)
                        {
                            ModelState.AddModelError("", "Aucun élément trouvé.");
                            return StatusCode(409, ModelState);
                        }

                        var amount = _billService.CalculateAmount(userSessionCourses);
                        //TODO
                        //Modifier le programme
                        var billFound = _billInterface.GetStudentSessionYearProgramBill(studentId, today.Year + "", s, userCourseToCreate.ProgramTitle);
                        billFound.Amount = billFound.Amount - amount;
                        var result = _billInterface.UpdateBill(billFound);

                        if (result < 0)
                        {
                            ModelState.AddModelError("", "Erreur lors de la mise à jour de la facture.");
                            return StatusCode(500, ModelState);
                        }
                    }

                    //Mettre plutot classesourse comme fk plutot que sigle
                    foreach (var courseSigle in coursesToDrop)
                    {
                        var bulletinToDrop = new BulletinDto
                        {
                            PermanentCode = studentId,
                            Sigle = courseSigle
                        };

                        var bulletinMap = _mapper.Map<Bulletins>(bulletinToDrop);
                        var responseBulletin = await _bulletinInterface.RemoveCourseTranscript(bulletinMap);

                        if (responseBulletin == 500)
                        {
                            ModelState.AddModelError("", "Erreur lors de la création d'un bullettin.");
                            return StatusCode(500, ModelState);
                        }
                    }
                }

                var result2 = await _userCourseInterface.DropCourses(studentsCoursesToDrop);

                if (numberOfUnregistrations != result2)
                {
                    ModelState.AddModelError("", "Erreur lors de l'abandon du cours.");
                    return StatusCode(500, ModelState);
                }
            }
            
            if (newStudentsCourses.Count != 0)
            {
                var result1 = await _userCourseInterface.RegisterStudentsToCoursesAsync(newStudentsCourses);

                if (numberOfRegistrations != result1)
                {
                    ModelState.AddModelError("", "Erreur lors de l'enregistrement de l'étudiant.");
                    return StatusCode(500, ModelState);
                }


                foreach (var studentId in userCourseToCreate.PermanentCodes)
                {

                    var billToCreate = new BillDto
                    {
                        DateOfIssue = today,
                        DeadLine = today.AddMonths(1),
                        SessionStudy = s,
                        YearStudy = today.Year + "",
                        PermanentCode = studentId,
                        DentalInsurance = 120,
                        GeneralExpenses = 245,
                        InsuranceFees = 250,
                        RefundsAndAdjustments = 120,
                        SportsAdministrationFees = 120
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

                        var bulletinMap = _mapper.Map<Bulletins>(bulletinToCreate);
                        var responseBulletin = _bulletinInterface.CreateBulletin(bulletinMap);

                        if (responseBulletin <= 0)
                        {
                            ModelState.AddModelError("", "Erreur lors de la création d'un bullettin.");
                            return StatusCode(500, ModelState);
                        }
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
    }
}
