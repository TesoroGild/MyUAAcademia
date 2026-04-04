using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MyUAAcademiaB.Dto;
using MyUAAcademiaB.Interfaces;
using MyUAAcademiaB.Models;
using MyUAAcademiaB.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MyUAAcademiaB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
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

            var auth = _authService.AuthenticateEmployee(loginCredentials);
            var userConnected = auth.Employee;

            if (userConnected == null)
            {
                return StatusCode(auth.StatusCode, new { message = auth.ErrorMessage });
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

            var auth = _authService.AuthenticateUser(loginCredentialsStudent);
            var userConnected = auth.User;

            if (userConnected == null)
            {
                return StatusCode(auth.StatusCode, new { message = auth.ErrorMessage });
            }
            else
            {
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

        [HttpPost("prelogin")]
        [ProducesResponseType(200, Type = typeof(EmployeeCoDto))]
        [ProducesResponseType(400)]
        public IActionResult AuthenticateuserForReset([FromBody] ResetCredentialsDto resetCredentials)
        {
            if (resetCredentials == null) return BadRequest("Format invalide.");

            var user = _employeeInterface.GetUserForReset(resetCredentials);
        
            if (user == null)
            {
                return StatusCode(400, new { message = "Identifiants invalides." });
            }
            else
            {
                var resetToken = _jwtService.GenerateResetToken(user.Code, user.UserRole);

                Response.Cookies.Append("RESET_TOKEN", resetToken, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTimeOffset.UtcNow.AddMinutes(10),
                    Path = "/api/Auth/reset"
                });

                var userMapped = _mapper.Map<EmployeeCoDto>(user);

                return Ok(userMapped);
            }
        }

        [HttpPost("prelogin2")]
        [ProducesResponseType(200, Type = typeof(EmployeeCoDto))]
        [ProducesResponseType(400)]
        public IActionResult AuthenticateUser1ForReset([FromBody] ResetCredentialsDto resetCredentials)
        {
            if (resetCredentials == null) return BadRequest("Format invalide.");

            var user = _userInterface.GetUserForReset(resetCredentials);

            if (user == null)
            {
                return StatusCode(400, new { message = "Identifiants invalides." });
            }
            else
            {
                var resetToken = _jwtService.GenerateResetToken(user.PermanentCode, user.UserRole);

                Response.Cookies.Append("RESET_TOKEN", resetToken, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTimeOffset.UtcNow.AddMinutes(10),
                    Path = "/api/Auth/reset"
                });

                var userMapped = _mapper.Map<StudentCoDto>(user);

                return Ok(userMapped);
            }
        }

        [HttpPost("logout")]
        [ProducesResponseType(200, Type = typeof(bool))]
        [ProducesResponseType(400)]
        [Authorize(Roles = "admin, director, professor, student")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("SESSION_ID", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/",
                Expires = DateTime.UtcNow.AddDays(-1)
            });

            return Ok(true);
        }

        [Authorize(Roles = "admin, director, professor, student")]
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
        [HttpPut("reset/password")]
        [ProducesResponseType(200, Type = typeof(bool))]
        [ProducesResponseType(400)]
        public async Task<IActionResult> UpdatePassword([FromBody] ResetPasswordCredentials resetPasswordCredentials)
        {
            if (resetPasswordCredentials == null) return BadRequest("Format invalide.");

            string token = Request.Cookies["RESET_TOKEN"] ?? Request.Cookies["SESSION_ID"];

            if (string.IsNullOrEmpty(token))
                return Unauthorized(new { message = "Action non autorisée." });

            try
            {
                var handler = new JwtSecurityTokenHandler();
                var validationParams = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("ResetKey"))),
                    ValidateIssuer = true,
                    ValidIssuer = Environment.GetEnvironmentVariable("ResetIssuer"),
                    ValidateAudience = true,
                    ValidAudience = Environment.GetEnvironmentVariable("ResetIssuer"),
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };

                var principal = handler.ValidateToken(token, validationParams, out _);
                var userCodeFromToken = principal.FindFirstValue("sub");

                if (string.IsNullOrEmpty(userCodeFromToken))
                    return Unauthorized(new { message = "Token invalide." });

                var hashedPwd = _authService.HashPassword(userCodeFromToken, resetPasswordCredentials.NewPwd);

                resetPasswordCredentials.UserCode = userCodeFromToken;
                resetPasswordCredentials.NewPwd = hashedPwd;

                var res = await _employeeInterface.UpdatePasswordAsync(resetPasswordCredentials);

                if (res <= 0) return StatusCode(500, new { message = "Échec de la mise à jour." });

                if (Request.Cookies.ContainsKey("RESET_TOKEN"))
                {
                    Response.Cookies.Delete("RESET_TOKEN");
                }

                return Ok(new { message = "Mot de passe mis à jour avec succès." });
            }
            catch (SecurityTokenExpiredException)
            {
                return Unauthorized(new { message = "Token expiré." });
            }
            catch (Exception)
            {
                return Unauthorized(new { message = "Token invalide." });
            }
        }

        [HttpPut("reset/password2")]
        [ProducesResponseType(200, Type = typeof(bool))]
        [ProducesResponseType(400)]
        public async Task<IActionResult> UpdatePassword1([FromBody] ResetPasswordCredentials resetPasswordCredentials)
        {
            if (resetPasswordCredentials == null) return BadRequest("Format invalide.");

            string token = Request.Cookies["RESET_TOKEN"] ?? Request.Cookies["SESSION_ID"];

            if (string.IsNullOrEmpty(token))
                return Unauthorized(new { message = "Action non autorisée." });

            try
            {
                var handler = new JwtSecurityTokenHandler();
                var jwtToken = handler.ReadJwtToken(token);
                var userCodeFromToken = jwtToken.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;

                if (string.IsNullOrEmpty(userCodeFromToken)) return Unauthorized(new { message = "Token invalide." });

                var hashedPwd = _authService.HashPassword(userCodeFromToken, resetPasswordCredentials.NewPwd);

                resetPasswordCredentials.UserCode = userCodeFromToken;
                resetPasswordCredentials.NewPwd = hashedPwd;

                var res = await _userInterface.UpdatePasswordAsync(resetPasswordCredentials);

                if (res <= 0) return StatusCode(500, new { message = "Échec de la mise à jour." });

                if (Request.Cookies.ContainsKey("RESET_TOKEN"))
                {
                    Response.Cookies.Delete("RESET_TOKEN");
                }

                return Ok(new { message = "Mot de passe mis à jour avec succès." });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Erreur lors de la lecture de l'identité." });
            }
        }
    }
}
