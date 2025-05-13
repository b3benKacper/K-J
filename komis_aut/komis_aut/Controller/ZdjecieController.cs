using komis_aut.Data;
using komis_aut.Modele;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace komis_aut.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class ZdjecieController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ZdjecieController(ApplicationDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Zdjecie>>> GetAll() =>
            await _context.Zdjecia.ToListAsync();

        [HttpGet("{id}")]
        public async Task<ActionResult<Zdjecie>> Get(int id)
        {
            var zdjecie = await _context.Zdjecia.FindAsync(id);
            if (zdjecie == null) return NotFound();
            return zdjecie;
        }

        [HttpPost]
        public async Task<ActionResult<Zdjecie>> Post(Zdjecie zdjecie)
        {
            _context.Zdjecia.Add(zdjecie);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = zdjecie.ZdjecieId }, zdjecie);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, Zdjecie zdjecie)
        {
            if (id != zdjecie.ZdjecieId) return BadRequest();
            _context.Entry(zdjecie).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var zdjecie = await _context.Zdjecia.FindAsync(id);
            if (zdjecie == null) return NotFound();
            _context.Zdjecia.Remove(zdjecie);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

}
