using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MyUAAcademiaB.Services
{
    public class JwtService
    {
        private readonly IConfiguration _configuration;

        public JwtService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerateToken(string code, string userRole)
        {
            var secretKey = _configuration["Key"];
            var issuer = _configuration["Issuer"];
            var expiryHours = double.Parse(_configuration["ExpiryHours"] ?? "2");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var now = DateTime.UtcNow;
            var unixTimestamp = new DateTimeOffset(now).ToUnixTimeSeconds();

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, code),
                new Claim(JwtRegisteredClaimNames.Iat, unixTimestamp.ToString(), ClaimValueTypes.Integer64),
                new Claim(ClaimTypes.Role, userRole)
            };


            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: issuer, //bonnes pratiques, mettre #. ici c'est le meme car c'est un seul serveur qui est utilise
                claims: claims,
                notBefore: now,
                expires: now.AddHours(expiryHours),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public string GenerateResetToken(string code, string userRole)
        {
            var secretKey = _configuration["ResetKey"];
            var issuer = _configuration["ResetIssuer"];
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var now = DateTime.UtcNow;
            var unixTimestamp = new DateTimeOffset(now).ToUnixTimeSeconds();

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, code),
                new Claim(JwtRegisteredClaimNames.Iat, unixTimestamp.ToString(), ClaimValueTypes.Integer64),
                new Claim(ClaimTypes.Role, userRole)
            };


            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: issuer,
                claims: claims,
                notBefore: now,
                expires: now.AddMinutes(10),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
