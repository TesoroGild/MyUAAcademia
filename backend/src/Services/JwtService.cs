using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MyUAAcademiaB.Services
{
    public class JwtService
    {
        private readonly string _secretKey = Environment.GetEnvironmentVariable("Key");
        private readonly string _issuer = Environment.GetEnvironmentVariable("Issuer");
        private readonly string _audience = Environment.GetEnvironmentVariable("Audience");
        private readonly int _expiryHours = 2;

        public string GenerateToken(string code, string userRole)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));
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
                issuer: _issuer,
                audience: _issuer, //bonnes pratiques, mettre un diff. ici c'est le meme car c'est un seul serveur qui est utilise
                claims: claims,
                notBefore: now,
                expires: now.AddHours(_expiryHours),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
