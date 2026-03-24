using AutoMapper;
using Azure.Core;
using Microsoft.AspNetCore.Mvc;
using MyUAAcademiaB.Dto;
using MyUAAcademiaB.Interfaces;
using MyUAAcademiaB.Models;
using System.Globalization;

namespace MyUAAcademiaB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BillController : ControllerBase
    {
        private readonly IBillInterface _billInterface;
        private readonly IUserInterface _userInterface;
        private readonly IClasseCourseInterface _classeCourseInterface;
        private readonly IUserCourseInterface _userClasseInterface;
        private readonly IBillService _billService;
        private readonly IMapper _mapper;

        public BillController(IBillInterface billInterface, IUserInterface userInterface, 
            IClasseCourseInterface classeCourseInterface, IUserCourseInterface userClasseInterface,
            IBillService billService, IMapper mapper)
        {
            _billInterface = billInterface;
            _userInterface = userInterface;
            _classeCourseInterface = classeCourseInterface;
            _userClasseInterface = userClasseInterface;
            _billService = billService;
            _mapper = mapper;
        }

        /*CREATE*/
        [HttpPost("bills")]
        [ProducesResponseType(200, Type = typeof(Bills))]
        [ProducesResponseType(400)]
        public IActionResult CreateBill([FromBody] BillDto billToCreate)
        {
            if (billToCreate == null) return BadRequest(ModelState);
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (!_userInterface.StudentExists(billToCreate.PermanentCode))
            {
                ModelState.AddModelError("", "Cet utilisateur n'existe pas.");
                return StatusCode(404, ModelState);
            }

            if (_billInterface.BillExists(billToCreate.SessionStudy, billToCreate.YearStudy, billToCreate.PermanentCode))
            {
                ModelState.AddModelError("", "Cette facture existe déjà.");
                return StatusCode(409, ModelState);
            }

            var allUserCourses = _billInterface.GetSessionBill(billToCreate.PermanentCode, billToCreate.YearStudy, billToCreate.SessionStudy);
            var courseName = allUserCourses.Select(auc => auc.CourseName).ToList();
            var courses = _classeCourseInterface.GetSessionCourses(billToCreate.SessionStudy, billToCreate.YearStudy, courseName);

            if (courses.Count == 0)
            {
                ModelState.AddModelError("", "Erreur lors de l'ajout de des cours.");
                return StatusCode(409, ModelState);
            }

            var amount = _billService.CalculateAmount(courses);
            billToCreate.Amount = amount;
            var billMap = _mapper.Map<Bills>(billToCreate);
            var billCreated = _billInterface.CreateBill(billMap);

            if (billCreated == null)
            {
                ModelState.AddModelError("", "Erreur lors de la création de la facture.");
                return StatusCode(500, ModelState);
            }

            return Ok(billCreated);
        }

        /*READ*/
        [HttpGet("bills")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<BillDto>))]
        public IActionResult GetBills()
        {
            var bills = _mapper.Map<List<BillDto>>(_billInterface.GetBills());

            if (!ModelState.IsValid) return BadRequest(ModelState);

            return Ok(bills);
        }

        [HttpGet("expiredBills")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<BillDto>))]
        public IActionResult GetExpiredBills()
        {
            var expiredBills = _mapper.Map<List<BillDto>>(_billInterface.GetExpiredBills());

            if (!ModelState.IsValid) return BadRequest(ModelState);

            return Ok(expiredBills);
        }

        [HttpGet("billsPaidLate")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<BillDto>))]
        public IActionResult GetBillsPaidLate()
        {
            var billsPaidLate = _mapper.Map<List<BillDto>>(_billInterface.GetBillsPaidLate());

            if (!ModelState.IsValid) return BadRequest(ModelState);

            return Ok(billsPaidLate);
        }

        [HttpPost("expiredBillsBefore")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<BillDto>))]
        public IActionResult GetExpiredBillsBefore([FromBody] string date)
        {
            if (string.IsNullOrEmpty(date))
            {
                return BadRequest("Invalid date.");
            }

            var parsedDate = DateTime.Parse(date, new CultureInfo("en-US"));
            //DateTime.TryParse(date, out DateTime parsedDate);
            var billsExpiredBefore = _mapper.Map<List<BillDto>>(_billInterface.GetExpiredBillsBefore(parsedDate));

            if (!ModelState.IsValid) return BadRequest(ModelState);

            return Ok(billsExpiredBefore);
        }

        [HttpPost("expiredBillsAfter")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<BillDto>))]
        public IActionResult GetExpiredBillsAfter([FromBody] string date)
        {
            if (string.IsNullOrEmpty(date))
            {
                return BadRequest("Invalid date.");
            }

            var parsedDate = DateTime.Parse(date, new CultureInfo("en-US"));
            //DateTime.TryParse(date, out DateTime parsedDate);
            var billsExpiredAfter = _mapper.Map<List<BillDto>>(_billInterface.GetExpiredBillsAfter(parsedDate));

            if (!ModelState.IsValid) return BadRequest(ModelState);

            return Ok(billsExpiredAfter);
        }

        [HttpGet("bills/{permanentCode}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<BillDto>))]
        [ProducesResponseType(400)]
        public IActionResult GetStudentBills(string permanentCode)
        {
            if (permanentCode == null || permanentCode.Trim() == "") return NotFound();

            if (!_userInterface.StudentExists(permanentCode))
            {
                ModelState.AddModelError("", "L'étudiant n'existe pas.");
                return StatusCode(400, ModelState);
            }

            var studentBills = _mapper.Map<List<BillDto>>(_billInterface.GetStudentBills(permanentCode.Trim()));

            if (!ModelState.IsValid) return BadRequest(ModelState);

            return Ok(studentBills);
        }

        /*UPDATE*/
        [HttpPut("bills")]
        [ProducesResponseType(200, Type = typeof(Bills))]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult UpdateBill([FromBody] BillDto billToUpdate) 
        {
            if (billToUpdate == null || billToUpdate.PermanentCode == null) return BadRequest(ModelState);

            if (!_userInterface.StudentExists(billToUpdate.PermanentCode))
            {
                ModelState.AddModelError("", "L'étudiant n'existe pas.");
                return StatusCode(400, ModelState);
            }

            var amount = 0.0;
            var allUserCourses = _billInterface.GetSessionBill(billToUpdate.PermanentCode, billToUpdate.YearStudy, billToUpdate.SessionStudy);
            var courseName = allUserCourses.Select(auc => auc.CourseName).ToList();
            var courses = _classeCourseInterface.GetSessionCourses(billToUpdate.SessionStudy, billToUpdate.YearStudy, courseName);

            if (courses.Count > 0)
                amount = _billService.CalculateAmount(courses);

            billToUpdate.Amount = amount;
            var billMap = _mapper.Map<Bills>(billToUpdate);
            var billUpdated = _billInterface.UpdateBill(billMap);

            if (billUpdated < 0)
            {
                ModelState.AddModelError("", "Erreur lors de la mise à jour de la facture.");
                return StatusCode(500, ModelState);
            }

            return Ok(billUpdated);
        }

        [HttpPut("pay")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> PayTheBillAsync([FromBody] BillToUpdateDto billToUpdate)
        {
            if (billToUpdate == null || billToUpdate.PermanentCode == null) return BadRequest(ModelState);

            if (!_userInterface.StudentExists(billToUpdate.PermanentCode))
            {
                ModelState.AddModelError("", "L'étudiant n'existe pas.");
                return StatusCode(400, ModelState);
            }

            var lineModified = await _billInterface.PayTheBill(billToUpdate);

            if (lineModified <= 0)
            {
                ModelState.AddModelError("", "Erreur lors du paiement.");
                return StatusCode(500, ModelState);
            }

            return Ok(true);
        }


        /*DELETE*/
    }
}
