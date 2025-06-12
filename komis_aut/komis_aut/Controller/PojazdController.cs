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
            var pojazd = await _context.Pojazdy.Include(p => p.Zdjecia)
                .FirstOrDefaultAsync(p => p.PojazdId == id);
            if (pojazd == null) return NotFound();
            return pojazd;
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Pojazd>> Post(PojazdInputDto dto)
        {
            int? sprzedajacyId = dto.SprzedajacyId;

            // Jeśli nie admin, bierz userId z JWT:
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var rola = User.FindFirst(ClaimTypes.Role)?.Value;
            if (rola != "ADMIN") sprzedajacyId = userId;

            var pojazd = new Pojazd
            {
                SprzedajacyId = sprzedajacyId ?? 0,
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

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, PojazdInputDto dto)
        {
            var pojazd = await _context.Pojazdy.FindAsync(id);
            if (pojazd == null) return NotFound();

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var rola = User.FindFirst(ClaimTypes.Role)?.Value;

            // Admin może edytować wszystko, inni tylko swoje
            if (rola != "ADMIN" && pojazd.SprzedajacyId != userId)
                return Forbid();

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

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var pojazd = await _context.Pojazdy.FindAsync(id);
            if (pojazd == null) return NotFound();

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var rola = User.FindFirst(ClaimTypes.Role)?.Value;

            // Admin może usuwać wszystko, inni tylko swoje
            if (rola != "ADMIN" && pojazd.SprzedajacyId != userId)
                return Forbid();

            _context.Pojazdy.Remove(pojazd);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [Authorize]
        [HttpGet("moje")]
        public async Task<ActionResult<IEnumerable<Pojazd>>> GetMojePojazdy()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
                return Unauthorized();
            int userId = int.Parse(userIdClaim);

            var sprzedajace = await _context.Pojazdy
                .Where(p => p.SprzedajacyId == userId)
                .Include(p => p.Zdjecia)
                .ToListAsync();

            var kupioneIds = await _context.Transakcje
                .Where(t => t.KupujacyId == userId)
                .Select(t => t.PojazdId)
                .ToListAsync();

            var kupione = await _context.Pojazdy
                .Where(p => kupioneIds.Contains(p.PojazdId))
                .Include(p => p.Zdjecia)
                .ToListAsync();

            var moje = sprzedajace.Concat(kupione)
                .GroupBy(p => p.PojazdId)
                .Select(g => g.First())
                .ToList();

            return moje;
        }
    }
}