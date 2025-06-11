using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace komis_aut.Modele
{
    public class Pojazd
    {
        [Key]
        public int PojazdId { get; set; }
        [Required]
        public int SprzedajacyId { get; set; }
        [Required]
        public string Marka { get; set; }
        [Required]
        public string Model { get; set; }
        [Required]
        public int RokProdukcji { get; set; }
        [Required]
        public decimal Cena { get; set; }
        [Required]
        public int Przebieg { get; set; }
        [Required]
        public string RodzajPaliwa { get; set; }
        [Required]
        public string SkrzyniaBiegow { get; set; }
        [Required]
        public string Opis { get; set; }
        [Required]
        public DateOnly? DataDodania { get; set; }
        [ForeignKey("SprzedajacyId")]
        [JsonIgnore]
        public Uzytkownik Sprzedajacy { get; set; }
        public ICollection<Zdjecie> Zdjecia { get; set; } = new List<Zdjecie>();
        public ICollection<Oferta> Oferty { get; set; } = new List<Oferta>();
    }

}
