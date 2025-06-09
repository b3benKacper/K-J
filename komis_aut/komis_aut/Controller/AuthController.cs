using komis_aut.Data;
using komis_aut.Dtos;
using komis_aut.Modele;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text;
using komis_aut.Dtos; 
using Microsoft.EntityFrameworkCore; 
using Microsoft.IdentityModel.Tokens; 
using System.IdentityModel.Tokens.Jwt; 

namespace komis_aut.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;

        public AuthController(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            if (_context.Uzytkownicy.Any(x => x.Email == dto.Email))
                return BadRequest("Email already exists");

            var user = new Uzytkownik
            {
                Email = dto.Email,
                Haslo = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Imie = dto.Imie,
                Nazwisko = dto.Nazwisko
            };

            _context.Uzytkownicy.Add(user);
            await _context.SaveChangesAsync();

            return Ok("User registered");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _context.Uzytkownicy.FirstOrDefaultAsync(x => x.Email == dto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.Haslo))
                return Unauthorized("Invalid credentials");

            var token = GenerateJwt(user);
            return Ok(new { token });
        }

        private string GenerateJwt(Uzytkownik user)
        {
            var claims = new[]
            {
            new Claim(ClaimTypes.NameIdentifier, user.UzytkownikId.ToString()),
            new Claim(ClaimTypes.Name, user.Email)
        };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(3),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

}
