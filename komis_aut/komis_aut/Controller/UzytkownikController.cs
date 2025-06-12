using komis_aut.Data;
using komis_aut.Modele;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace komis_aut.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class UzytkownikController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UzytkownikController(ApplicationDbContext context) => _context = context;

        // Tylko dla admina: pobierz wszystkich użytkowników
        [Authorize(Roles = "ADMIN")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Uzytkownik>>> GetAll()
            => await _context.Uzytkownicy.ToListAsync();

        [Authorize(Roles = "ADMIN")]
        [HttpGet("{id}")]
        public async Task<ActionResult<Uzytkownik>> Get(int id)
        {
            var user = await _context.Uzytkownicy.FindAsync(id);
            if (user == null) return NotFound();
            return user;
        }

        // Edytuj użytkownika (mail i rola)
        [Authorize(Roles = "ADMIN")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, Uzytkownik user)
        {
            if (id != user.UzytkownikId)
                return BadRequest();

            var istnieje = await _context.Uzytkownicy.AnyAsync(u => u.UzytkownikId == id);
            if (!istnieje) return NotFound();

            var userDb = await _context.Uzytkownicy.FindAsync(id);
            if (userDb == null) return NotFound();

            userDb.Email = user.Email;
            userDb.Rola = user.Rola;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // Usuń użytkownika
        [Authorize(Roles = "ADMIN")]
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