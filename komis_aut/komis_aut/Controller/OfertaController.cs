using komis_aut.Data;
using komis_aut.Modele;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace komis_aut.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class OfertaController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OfertaController(ApplicationDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Oferta>>> GetAll() =>
            await _context.Oferty.ToListAsync();

        [HttpGet("{id}")]
        public async Task<ActionResult<Oferta>> Get(int id)
        {
            var oferta = await _context.Oferty.FindAsync(id);
            if (oferta == null) return NotFound();
            return oferta;
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Oferta>> Post(Oferta oferta)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var rola = User.FindFirst(ClaimTypes.Role)?.Value;

            var pojazd = await _context.Pojazdy.FindAsync(oferta.PojazdId);
            if (pojazd == null)
                return BadRequest("Nie znaleziono pojazdu.");

            // Tylko admin lub właściciel pojazdu może dodać ofertę
            if (rola != "ADMIN" && pojazd.SprzedajacyId != userId)
                return Forbid("Nie możesz dodać oferty dla nieswojego pojazdu!");

            _context.Oferty.Add(oferta);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = oferta.OfertaId }, oferta);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, Oferta oferta)
        {
            if (id != oferta.OfertaId) return BadRequest();

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var rola = User.FindFirst(ClaimTypes.Role)?.Value;
            var pojazd = await _context.Pojazdy.FindAsync(oferta.PojazdId);

            if (rola != "ADMIN" && pojazd != null && pojazd.SprzedajacyId != userId)
                return Forbid();

            _context.Entry(oferta).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var oferta = await _context.Oferty.FindAsync(id);
            if (oferta == null) return NotFound();

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var rola = User.FindFirst(ClaimTypes.Role)?.Value;
            var pojazd = await _context.Pojazdy.FindAsync(oferta.PojazdId);

            if (rola != "ADMIN" && pojazd != null && pojazd.SprzedajacyId != userId)
                return Forbid();

            _context.Oferty.Remove(oferta);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}