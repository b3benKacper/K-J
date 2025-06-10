using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace komis_aut.Modele
{
[Table("oferty")]
    public class Oferta
    {
        [Key]
        public int OfertaId { get; set; }

        [Required]
        public int PojazdId { get; set; }

        [Required]
        public int KupujacyId { get; set; }

        [Required]
        public decimal Kwota { get; set; }

        [Required]
        public DateOnly? DataZalozenia { get; set; }

        [Required]
        public string Status { get; set; }


        [ForeignKey("PojazdId")]

        public Pojazd? Pojazd { get; set; }


        [ForeignKey("KupujacyId")]
        public Uzytkownik? Kupujacy { get; set; }
    }

}
