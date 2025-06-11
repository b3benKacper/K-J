namespace komis_aut.Dto
{
    public class TransakcjaInputDto
    {
        public int PojazdId { get; set; }
        public int OfertaId { get; set; } 
        public int KupujacyId { get; set; }
        public decimal CenaKoncowa { get; set; }
        public string StatusPlatnosci { get; set; }
        public DateOnly? DataTransakcji { get; set; }
    }
}