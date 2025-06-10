using System.ComponentModel.DataAnnotations;

namespace komis_aut.Modele
{
    public class Uzytkownik
    {
        [Key]
        public int UzytkownikId { get; set; }
        [Required]
        public string Imie { get; set; }
        [Required]

        public string Nazwisko { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string Haslo { get; set; }
        [Required]
        public string Telefon { get; set; }
        [Required]
        public string Rola { get; set; }
        [Required]
        public DateOnly? DataRejestracji { get; set; }

        public ICollection<Oferta> Oferty { get; set; }
        public ICollection<Transakcja> Transakcje { get; set; }
    }

}
