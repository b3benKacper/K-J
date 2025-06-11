using komis_aut.Data;
using komis_aut.Modele;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

        [HttpPost]
        public async Task<ActionResult<Oferta>> Post(Oferta oferta)
        {
            oferta.Status = "aktywny";
            _context.Oferty.Add(oferta);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = oferta.OfertaId }, oferta);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, Oferta oferta)
        {
            if (id != oferta.OfertaId) return BadRequest();
            _context.Entry(oferta).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var oferta = await _context.Oferty.FindAsync(id);
            if (oferta == null) return NotFound();
            _context.Oferty.Remove(oferta);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

}
