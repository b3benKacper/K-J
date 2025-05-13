using komis_aut.Data;
using komis_aut.Modele;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace komis_aut.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class UzytkownikController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UzytkownikController(ApplicationDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Uzytkownik>>> GetAll() =>
            await _context.Uzytkownicy.ToListAsync();

        [HttpGet("{id}")]
        public async Task<ActionResult<Uzytkownik>> Get(int id)
        {
            var user = await _context.Uzytkownicy.FindAsync(id);
            if (user == null) return NotFound();
            return user;
        }

        [HttpPost]
        public async Task<ActionResult<Uzytkownik>> Post(Uzytkownik user)
        {
            _context.Uzytkownicy.Add(user);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = user.UzytkownikId }, user);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, Uzytkownik user)
        {
            if (id != user.UzytkownikId) return BadRequest();
            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _context.Uzytkownicy.FindAsync(id);
            if (user == null) return NotFound();
            _context.Uzytkownicy.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

}
