using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace komis_aut.Modele
{
    public class Zdjecie
    {
        [Key]  
        public int ZdjecieId { get; set; }
        [Required]
        public int PojazdId { get; set; }
        [Required]
        public string ZdjecieUrl { get; set; }
        [ForeignKey("PojazdId")]

        public Pojazd Pojazd { get; set; }
    }

}
