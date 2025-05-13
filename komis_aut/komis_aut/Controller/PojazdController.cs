using komis_aut.Data;
using komis_aut.Modele;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        public async Task<ActionResult<Pojazd>> Post(Pojazd pojazd)
        {
            _context.Pojazdy.Add(pojazd);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = pojazd.PojazdId }, pojazd);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, Pojazd pojazd)
        {
            if (id != pojazd.PojazdId) return BadRequest();
            _context.Entry(pojazd).State = EntityState.Modified;
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
    }

}
