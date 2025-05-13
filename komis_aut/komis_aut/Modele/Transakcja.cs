using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace komis_aut.Modele
{
    public class Transakcja
    {
        [Key]
        public int TransakcjaId { get; set; }
        [Required]
        public int PojazdId { get; set; }
        [Required]
        public int KupujacyId { get; set; }
        [Required]
        public int SprzedajacyId { get; set; }
        [Required]
        public decimal CenaKoncowa { get; set; }
        [Required]
        public DateTime DataTransakcji { get; set; }
        [Required]
        public string StatusPlatnosci { get; set; }
        [ForeignKey("PojazdId")]
        public Pojazd Pojazd { get; set; }
        [ForeignKey("KupujacyId")]
        public Uzytkownik Kupujacy { get; set; }
        [ForeignKey("SprzedajacyId")]
        public Uzytkownik Sprzedajacy { get; set; }
    }

}
