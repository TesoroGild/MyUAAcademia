using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyUAAcademiaB.Dto;
using MyUAAcademiaB.Interfaces;
using MyUAAcademiaB.Models;
using MyUAAcademiaB.Services;
using System.Security.Claims;

namespace MyUAAcademiaB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[EnableCors("AllowSpecificOrigin")]
    //[EnableCors]
    public class AuthController(IAuthService authService, IMapper mapper, IEmployeeInterface employeeInterface,
        IUserInterface userInterface, JwtService jwtService) : ControllerBase
    {
        private readonly IAuthService _authService = authService;
        private readonly IMapper _mapper = mapper;
        private readonly IEmployeeInterface _employeeInterface = employeeInterface;
        private readonly IUserInterface _userInterface = userInterface;
        private readonly JwtService _jwtService = jwtService;

        //CREATE
        [HttpPost("login")]
        [ProducesResponseType(200, Type = typeof(EmployeeCoDto))]
        [ProducesResponseType(400)]
        public IActionResult Authenticate([FromBody] LoginCredentials loginCredentials)
        {
            if (loginCredentials == null) return BadRequest("Format invalide.");

            var userConnected = _authService.AutenticateEmployee(loginCredentials);

            if (userConnected == null)
            {
                ModelState.AddModelError("", "Erreur lors de la tentative de connection!");
                //return StatusCode(500, ModelState);
                return Unauthorized("Informations invalides.");
            }
            else
            {
                //var jwtService = new JwtService();
                var token = _jwtService.GenerateToken(loginCredentials.Code, userConnected.UserRole);

                Response.Cookies.Append("SESSION_ID", token, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTimeOffset.UtcNow.AddHours(2),
                    Path = "/"
                });

                var userMapped = _mapper.Map<EmployeeCoDto>(userConnected);

                return Ok(userMapped);
            }
        }

        [HttpPost("login2")]
        [ProducesResponseType(200, Type = typeof(StudentCoDto))]
        [ProducesResponseType(400)]
        public IActionResult AuthenticateStudent([FromBody] LoginCredentialsStudent loginCredentialsStudent)
        {
            if (loginCredentialsStudent == null) return BadRequest("Format invalide.");
            //var test = _authService.HashPassword(loginCredentialsStudent.PermanentCode, loginCredentialsStudent.Pwd);

            var userConnected = _authService.AuthenticateUser(loginCredentialsStudent);

            if (userConnected == null)
            {
                ModelState.AddModelError("", "Erreur lors de la tentative de connection!");
                //return StatusCode(500, ModelState);
                return Unauthorized("Informations invalides.");
            }
            else
            {
                //var jwtService = new JwtService();
                var token = _jwtService.GenerateToken(loginCredentialsStudent.PermanentCode, userConnected.UserRole);

                Response.Cookies.Append("SESSION_ID", token, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTimeOffset.UtcNow.AddHours(2),
                    Path = "/"
                });

                var userMapped = _mapper.Map<StudentCoDto>(userConnected);

                return Ok(userMapped);
            }
        }

        [HttpPost("logout")]
        [ProducesResponseType(200, Type = typeof(bool))]
        [ProducesResponseType(400)]
        [Authorize(Roles = "Admin, Employee, Professor, Student")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("SESSION_ID", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/"
            });

            return Ok(true);
        }

        [Authorize]
        [HttpGet("reconnect")]
        [ProducesResponseType(200)]
        [ProducesResponseType(401)]
        public IActionResult GetCurrentUser()
        {
            var code = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var currentUser = _employeeInterface.GetEmployee(code);

            if (currentUser == null)
            {
                var cU = _userInterface.GetUser(code);

                if (cU != null)
                {
                    var cUM = _mapper.Map<StudentCoDto>(cU);
                    return Ok(cUM);
                }

                ModelState.AddModelError("", "Erreur lors de la tentative de connection!");
                return Unauthorized("Informations invalides.");
            }
            else
            {
                var userMapped = _mapper.Map<EmployeeCoDto>(currentUser);
                return Ok(userMapped);
            }
        }


        //UPDATE
        [HttpPut("reset-password")]
        [ProducesResponseType(200, Type = typeof(bool))]
        [ProducesResponseType(400)]
        [Authorize(Roles = "Admin, Professor")]
        public async Task<IActionResult> UpdatePassword([FromBody] ResetPasswordCredentials resetPasswordCredentials)
        {
            if (resetPasswordCredentials == null) return BadRequest("Format invalide.");

            //var userConnected = _employeeInterface.GetEmployee(resetPasswordCredentials.UserCode);
            var hashedPwd = _authService.HashPassword(resetPasswordCredentials.UserCode, resetPasswordCredentials.NewPwd);
            resetPasswordCredentials.NewPwd = "";
            resetPasswordCredentials.NewPwd = hashedPwd;
            var res = await _employeeInterface.UpdatePasswordAsync(resetPasswordCredentials);

            if (res <= 0) return Unauthorized();

            return Ok(true);
        }

        [HttpPut("reset-password2")]
        [ProducesResponseType(200, Type = typeof(bool))]
        [ProducesResponseType(400)]
        [Authorize(Roles = "Professor, Student")]
        public async Task<IActionResult> UpdatePassword1([FromBody] ResetPasswordCredentials resetPasswordCredentials)
        {
            if (resetPasswordCredentials == null) return BadRequest("Format invalide.");

            //var userConnected = _employeeInterface.GetEmployee(resetPasswordCredentials.UserCode);
            var hashedPwd = _authService.HashPassword(resetPasswordCredentials.UserCode, resetPasswordCredentials.NewPwd);
            resetPasswordCredentials.NewPwd = "";
            resetPasswordCredentials.NewPwd = hashedPwd;
            var res = await _userInterface.UpdatePasswordAsync(resetPasswordCredentials);

            if (res <= 0) return Unauthorized();

            return Ok(true);
        }
    }
}
