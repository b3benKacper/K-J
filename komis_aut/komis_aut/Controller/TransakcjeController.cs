using komis_aut.Data;
using komis_aut.Modele;
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
        public async Task<ActionResult<Transakcja>> Post(Transakcja transakcja)
        {
            _context.Transakcje.Add(transakcja);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = transakcja.TransakcjaId }, transakcja);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, Transakcja transakcja)
        {
            if (id != transakcja.TransakcjaId) return BadRequest();
            _context.Entry(transakcja).State = EntityState.Modified;
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
