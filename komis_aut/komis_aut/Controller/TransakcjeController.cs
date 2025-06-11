using komis_aut.Data;
using komis_aut.Modele;
using komis_aut.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace komis_aut.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransakcjaController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TransakcjaController(ApplicationDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Transakcja>>> GetAll() =>
            await _context.Transakcje.ToListAsync();

        [HttpGet("{id}")]
        public async Task<ActionResult<Transakcja>> Get(int id)
        {
            var transakcja = await _context.Transakcje.FindAsync(id);
            if (transakcja == null) return NotFound();
            return transakcja;
        }

        [HttpPost]
        public async Task<ActionResult<Transakcja>> Post(TransakcjaInputDto dto)
        {
            var pojazd = await _context.Pojazdy.FindAsync(dto.PojazdId);
            if (pojazd == null)
                return NotFound("Pojazd nie istnieje!");

            var oferta = await _context.Oferty.FindAsync(dto.OfertaId);
            if (oferta != null)
            {
                oferta.Status = "sprzedany";
                _context.Oferty.Update(oferta); // Wymuś aktualizację statusu w bazie
            }

            if (pojazd.Opis == null || !pojazd.Opis.ToLower().Contains("sprzedany"))
                pojazd.Opis = (pojazd.Opis?.Trim() ?? "") + " (SPRZEDANY)";

            var transakcja = new Transakcja
            {
                PojazdId = dto.PojazdId,
                KupujacyId = dto.KupujacyId,
                SprzedajacyId = pojazd.SprzedajacyId,
                CenaKoncowa = dto.CenaKoncowa,
                StatusPlatnosci = "zakupione",
                DataTransakcji = dto.DataTransakcji ?? DateOnly.FromDateTime(DateTime.Now)
            };

            _context.Transakcje.Add(transakcja);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = transakcja.TransakcjaId }, transakcja);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, TransakcjaInputDto dto)
        {
            var transakcja = await _context.Transakcje.FindAsync(id);
            if (transakcja == null) return NotFound();

            transakcja.PojazdId = dto.PojazdId;
            transakcja.KupujacyId = dto.KupujacyId;
            transakcja.CenaKoncowa = dto.CenaKoncowa;
            transakcja.StatusPlatnosci = dto.StatusPlatnosci;
            transakcja.DataTransakcji = dto.DataTransakcji ?? transakcja.DataTransakcji;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var transakcja = await _context.Transakcje.FindAsync(id);
            if (transakcja == null) return NotFound();
            _context.Transakcje.Remove(transakcja);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}