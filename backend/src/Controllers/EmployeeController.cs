using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using MyUAAcademiaB.Dto;
using MyUAAcademiaB.Interfaces;
using MyUAAcademiaB.Models;
using MyUAAcademiaB.Services;
using System.Globalization;
using System.Security.Claims;

namespace MyUAAcademiaB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowSpecificOrigin")]
    public class EmployeeController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IEmployeeInterface _employeeInterface;
        private readonly IEmployeeService _employeeService;
        private readonly IMapper _mapper;
        private readonly IUserService _userService;

        public EmployeeController(IAuthService authService, IEmployeeInterface employeeInterface,
            IEmployeeService employeeService, IUserService userService, IMapper mapper)
        {
            _authService = authService;
            _employeeInterface = employeeInterface;
            _employeeService = employeeService;
            _mapper = mapper;
            _userService = userService;
        }

        /*CREATE*/
        [HttpPost("employee")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Employees>))]
        [ProducesResponseType(400)]
        public IActionResult CreateEmployee([FromBody] EmployeeTCDto employeeTocreate)
        {
            if (employeeTocreate == null) return BadRequest(ModelState);

            DateOnly parseBirthDay;
            DateOnly parseStartingDate;

            DateOnly.TryParseExact(employeeTocreate.BirthDay, "yyyy-MM-dd",
                           CultureInfo.InvariantCulture,
                           DateTimeStyles.None,
                           out parseBirthDay);

            DateOnly.TryParseExact(employeeTocreate.DateOfTakingOffice, "yyyy-MM-dd",
                           CultureInfo.InvariantCulture,
                           DateTimeStyles.None,
                           out parseStartingDate);

            var code = _employeeService.GenerateCode(employeeTocreate.LastName, employeeTocreate.FirstName, parseBirthDay, employeeTocreate.Sexe,
            employeeTocreate.Job, parseStartingDate);
            var employeeExist = _employeeInterface.EmployeeExists(code);

            if (employeeExist)
            {
                ModelState.AddModelError("", "L'employé existe déjà.");
                //422?
                return StatusCode(422, ModelState);
            }

            if (!ModelState.IsValid) return BadRequest(ModelState);

            var email = _userService.GenerateEmail(employeeTocreate.FirstName, employeeTocreate.LastName);

            var employeeMap = _mapper.Map<Employees>(employeeTocreate);
            employeeMap.IsActivated = 0;
            var pwd = _userService.SetFirstPasssword(employeeMap.LastName, employeeMap.FirstName);
            employeeMap.Pwd = _authService.HashPassword(employeeMap.Code, pwd);
            employeeMap.ProfessionalEmail = email;
            employeeMap.PersonalEmail = employeeTocreate.Email;
            employeeMap.Code = code;
            employeeMap.UserStatus = "0";
            var employeeCreated = _employeeInterface.CreateEmployee(employeeMap);

            if (employeeCreated == null)
            {
                ModelState.AddModelError("", "Erreur lors de la création de l'employé.");
                return StatusCode(500, ModelState);
            }

            return Ok(employeeCreated);
        }


        /*READ*/
        [HttpGet("employees")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<EmployeeTDDto>))]
        [Authorize(Roles = "Admin")]
        public IActionResult GetEmployeesV2()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var claims = identity?.Claims.Select(c => new { c.Type, c.Value });

            var employees = _mapper.Map<List<EmployeeTDDto>>(_employeeInterface.GetEmployees());

            if (!ModelState.IsValid) return BadRequest(ModelState);

            return Ok(employees);
        }

        //[HttpGet("employeesV2")]
        //[ProducesResponseType(200, Type = typeof(IEnumerable<EmployeeV2Dto>))]
        //public IActionResult GetEmployeesV2()
        //{
        //    var employeesV2 = _mapper.Map<List<EmployeeV2Dto>>(_employeeInterface.GetEmployeesV2());

        //    if (!ModelState.IsValid) return BadRequest(ModelState);

        //    return Ok(employeesV2);
        //}

        [HttpGet("employee/{code}")]
        [ProducesResponseType(200, Type = typeof(EmployeeTDDto))]
        [ProducesResponseType(400)]
        [Authorize(Roles = "Admin, Professor, admin, professor")]
        public IActionResult GetEmployee(string code)
        {
            if (!_employeeInterface.EmployeeExists(code)) return NotFound();

            var employee = _mapper.Map<EmployeeTDDto>(_employeeInterface.GetEmployee(code));

            if (!ModelState.IsValid) return BadRequest(ModelState);

            return Ok(employee);
        }

        [HttpPost("exist")]
        [ProducesResponseType(200, Type = typeof(Boolean))]
        [ProducesResponseType(400)]
        [Authorize(Roles = "admin, professor, student")]
        public IActionResult GetEmployee([FromBody] ExistCredentialsDto credentials)
        {
            if (!_employeeInterface.EmployeeExistsV1(credentials.Code, credentials.Email))
                return BadRequest(new
                {
                    success = false,
                    message = "Aucun compte associé."
                });

            var employee = _employeeInterface.GetEmployee(credentials.Code);

            if (!ModelState.IsValid) return BadRequest(ModelState);

            return Ok(new VerifiedUserDto
            {
                FirstName = employee.FirstName,
                LastName = employee.LastName,
                UserRole = employee.UserRole,
                UserCode = employee.Code
            });
        }


        /*UPDATE*/
        [HttpPut("activate")]
        [ProducesResponseType(200, Type = typeof(bool))]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult ActivateEmployeeAccount([FromBody] ActivationRequest activationRequest)
        {
            if (activationRequest == null) return BadRequest(ModelState);

            if (!_employeeInterface.EmployeeExists(activationRequest.Code))
            {
                ModelState.AddModelError("", "L'employé n'existe pas.");
                return StatusCode(400, ModelState);
            }

            var isActivated = _employeeInterface.ActivateEmployeeAccount(activationRequest);

            if (!isActivated)
            {
                ModelState.AddModelError("", "Erreur lors de l'activation de l'employé.");
                return StatusCode(500, ModelState);
            }

            return Ok(isActivated);
        }

        [HttpPut("validate")]
        [ProducesResponseType(200, Type = typeof(bool))]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult ValidateEmployeeAccount([FromBody] ValidationRequest validationRequest)
        {
            if (validationRequest == null) return BadRequest(ModelState);

            if (!_employeeInterface.EmployeeExists(validationRequest.Code))
            {
                ModelState.AddModelError("", "L'employé n'existe pas.");
                return StatusCode(400, ModelState);
            }

            var isActivated = _employeeInterface.ValidateEmployeeAccount(validationRequest);

            if (!isActivated)
            {
                ModelState.AddModelError("", "Erreur lors de la validation de l'employé.");
                return StatusCode(500, ModelState);
            }

            return Ok(isActivated);
        }

        [HttpPut("users")]
        [ProducesResponseType(200, Type = typeof(Employees))]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult UpdateEmployee([FromBody] EmployeeTU eltsToUpdate)
        {
            if (eltsToUpdate == null) return BadRequest(ModelState);

            if (!_employeeInterface.EmployeeExists(eltsToUpdate.Code))
            {
                ModelState.AddModelError("", "L'employé n'existe pas.");
                return StatusCode(400, ModelState);
            }

            if (!string.IsNullOrWhiteSpace(eltsToUpdate.Pwd))
            {
                eltsToUpdate.Pwd = _authService.HashPassword(eltsToUpdate.Code, eltsToUpdate.Pwd);
            }

            var studentUpdated = _employeeInterface.UpdateEmployee(eltsToUpdate);

            if (studentUpdated == null)
            {
                ModelState.AddModelError("", "Erreur lors de la modification de l'employé.");
                return StatusCode(500, ModelState);
            }

            return Ok(studentUpdated);
        }


        /*DELETE*/
    }
}
