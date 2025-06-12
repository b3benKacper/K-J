using komis_aut.Modele;
using Microsoft.EntityFrameworkCore;

namespace komis_aut.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<komis_aut.Modele.Uzytkownik> Uzytkownicy { get; set; }
        public DbSet<komis_aut.Modele.Oferta> Oferty { get; set; }
        public DbSet<komis_aut.Modele.Zdjecie> Zdjecia { get; set; }
        public DbSet<komis_aut.Modele.Pojazd> Pojazdy { get; set; }
        public DbSet<komis_aut.Modele.Transakcja> Transakcje { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Uzytkownik>().ToTable("uzytkownicy");
            modelBuilder.Entity<Oferta>().ToTable("oferty");
            modelBuilder.Entity<Zdjecie>().ToTable("zdjecia");
            modelBuilder.Entity<Pojazd>().ToTable("pojazdy");
            modelBuilder.Entity<Transakcja>().ToTable("transakcje");

            // ✅ Cascade delete: Użytkownik -> Oferty (Kupujacy)
            modelBuilder.Entity<Oferta>()
                .HasOne(o => o.Kupujacy)
                .WithMany(u => u.Oferty)
                .HasForeignKey(o => o.KupujacyId)
                .OnDelete(DeleteBehavior.Cascade);

            // ✅ Cascade delete: Użytkownik -> Transakcje jako Kupujacy
            modelBuilder.Entity<Transakcja>()
                .HasOne(t => t.Kupujacy)
                .WithMany()
                .HasForeignKey(t => t.KupujacyId)
                .OnDelete(DeleteBehavior.Cascade);

            // ✅ Cascade delete: Użytkownik -> Transakcje jako Sprzedajacy
            modelBuilder.Entity<Transakcja>()
                .HasOne(t => t.Sprzedajacy)
                .WithMany()
                .HasForeignKey(t => t.SprzedajacyId)
                .OnDelete(DeleteBehavior.Cascade);
        }

    }


}
