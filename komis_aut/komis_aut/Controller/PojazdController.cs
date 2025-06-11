using komis_aut.Data;
using komis_aut.Modele;
using komis_aut.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace komis_aut.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class PojazdController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PojazdController(ApplicationDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Pojazd>>> GetAll() =>
            await _context.Pojazdy.Include(p => p.Zdjecia).ToListAsync();

        [HttpGet("{id}")]
        public async Task<ActionResult<Pojazd>> Get(int id)
        {
            var pojazd = await _context.Pojazdy.Include(p => p.Zdjecia).FirstOrDefaultAsync(p => p.PojazdId == id);
            if (pojazd == null) return NotFound();
            return pojazd;
        }

        [HttpPost]
        public async Task<ActionResult<Pojazd>> Post(PojazdInputDto dto)
        {
            var pojazd = new Pojazd
            {
                SprzedajacyId = dto.SprzedajacyId,
                Marka = dto.Marka,
                Model = dto.Model,
                RokProdukcji = dto.RokProdukcji,
                Cena = dto.Cena,
                Przebieg = dto.Przebieg,
                RodzajPaliwa = dto.RodzajPaliwa,
                SkrzyniaBiegow = dto.SkrzyniaBiegow,
                Opis = dto.Opis,
                DataDodania = dto.DataDodania
            };

            _context.Pojazdy.Add(pojazd);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = pojazd.PojazdId }, pojazd);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, PojazdInputDto dto)
        {
            var pojazd = await _context.Pojazdy.FindAsync(id);
            if (pojazd == null) return NotFound();

            pojazd.SprzedajacyId = dto.SprzedajacyId;
            pojazd.Marka = dto.Marka;
            pojazd.Model = dto.Model;
            pojazd.RokProdukcji = dto.RokProdukcji;
            pojazd.Cena = dto.Cena;
            pojazd.Przebieg = dto.Przebieg;
            pojazd.RodzajPaliwa = dto.RodzajPaliwa;
            pojazd.SkrzyniaBiegow = dto.SkrzyniaBiegow;
            pojazd.Opis = dto.Opis;
            pojazd.DataDodania = dto.DataDodania;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var pojazd = await _context.Pojazdy.FindAsync(id);
            if (pojazd == null) return NotFound();
            _context.Pojazdy.Remove(pojazd);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [Authorize]
        [HttpGet("moje")]
        public async Task<ActionResult<IEnumerable<Pojazd>>> GetMojePojazdy()
        {
            // Pobierz userId z tokena JWT
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
                return Unauthorized();
            int userId = int.Parse(userIdClaim);

            var mojePojazdy = await _context.Pojazdy
                .Where(p => p.SprzedajacyId == userId)
                .Include(p => p.Zdjecia)
                .ToListAsync();

            return mojePojazdy;
        }
    }
}