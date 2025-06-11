namespace komis_aut.Dto
{
    public class PojazdInputDto
    {
        public int SprzedajacyId { get; set; }
        public string Marka { get; set; }
        public string Model { get; set; }
        public int RokProdukcji { get; set; }
        public decimal Cena { get; set; }
        public int Przebieg { get; set; }
        public string RodzajPaliwa { get; set; }
        public string SkrzyniaBiegow { get; set; }
        public string Opis { get; set; }
        public DateOnly? DataDodania { get; set; }
    }
}