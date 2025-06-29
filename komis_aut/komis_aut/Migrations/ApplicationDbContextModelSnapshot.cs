﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using komis_aut.Data;

#nullable disable

namespace komis_aut.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    partial class ApplicationDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.15")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("komis_aut.Modele.Oferta", b =>
                {
                    b.Property<int>("OfertaId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("OfertaId"));

                    b.Property<DateOnly?>("DataZalozenia")
                        .IsRequired()
                        .HasColumnType("date");

                    b.Property<int>("KupujacyId")
                        .HasColumnType("integer");

                    b.Property<decimal>("Kwota")
                        .HasColumnType("numeric");

                    b.Property<int>("PojazdId")
                        .HasColumnType("integer");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("OfertaId");

                    b.HasIndex("KupujacyId");

                    b.HasIndex("PojazdId");

                    b.ToTable("oferty", (string)null);
                });

            modelBuilder.Entity("komis_aut.Modele.Pojazd", b =>
                {
                    b.Property<int>("PojazdId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("PojazdId"));

                    b.Property<decimal>("Cena")
                        .HasColumnType("numeric");

                    b.Property<DateOnly?>("DataDodania")
                        .IsRequired()
                        .HasColumnType("date");

                    b.Property<string>("Marka")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Model")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Opis")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("Przebieg")
                        .HasColumnType("integer");

                    b.Property<string>("RodzajPaliwa")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("RokProdukcji")
                        .HasColumnType("integer");

                    b.Property<string>("SkrzyniaBiegow")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("SprzedajacyId")
                        .HasColumnType("integer");

                    b.HasKey("PojazdId");

                    b.HasIndex("SprzedajacyId");

                    b.ToTable("pojazdy", (string)null);
                });

            modelBuilder.Entity("komis_aut.Modele.Transakcja", b =>
                {
                    b.Property<int>("TransakcjaId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("TransakcjaId"));

                    b.Property<decimal>("CenaKoncowa")
                        .HasColumnType("numeric");

                    b.Property<DateOnly?>("DataTransakcji")
                        .IsRequired()
                        .HasColumnType("date");

                    b.Property<int>("KupujacyId")
                        .HasColumnType("integer");

                    b.Property<int>("PojazdId")
                        .HasColumnType("integer");

                    b.Property<int>("SprzedajacyId")
                        .HasColumnType("integer");

                    b.Property<string>("StatusPlatnosci")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int?>("UzytkownikId")
                        .HasColumnType("integer");

                    b.HasKey("TransakcjaId");

                    b.HasIndex("KupujacyId");

                    b.HasIndex("PojazdId");

                    b.HasIndex("SprzedajacyId");

                    b.HasIndex("UzytkownikId");

                    b.ToTable("transakcje", (string)null);
                });

            modelBuilder.Entity("komis_aut.Modele.Uzytkownik", b =>
                {
                    b.Property<int>("UzytkownikId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("UzytkownikId"));

                    b.Property<DateOnly?>("DataRejestracji")
                        .IsRequired()
                        .HasColumnType("date");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Haslo")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Imie")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Nazwisko")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Rola")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Telefon")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("UzytkownikId");

                    b.ToTable("uzytkownicy", (string)null);
                });

            modelBuilder.Entity("komis_aut.Modele.Zdjecie", b =>
                {
                    b.Property<int>("ZdjecieId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("ZdjecieId"));

                    b.Property<int>("PojazdId")
                        .HasColumnType("integer");

                    b.Property<string>("ZdjecieUrl")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("ZdjecieId");

                    b.HasIndex("PojazdId");

                    b.ToTable("zdjecia", (string)null);
                });

            modelBuilder.Entity("komis_aut.Modele.Oferta", b =>
                {
                    b.HasOne("komis_aut.Modele.Uzytkownik", "Kupujacy")
                        .WithMany("Oferty")
                        .HasForeignKey("KupujacyId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("komis_aut.Modele.Pojazd", "Pojazd")
                        .WithMany("Oferty")
                        .HasForeignKey("PojazdId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Kupujacy");

                    b.Navigation("Pojazd");
                });

            modelBuilder.Entity("komis_aut.Modele.Pojazd", b =>
                {
                    b.HasOne("komis_aut.Modele.Uzytkownik", "Sprzedajacy")
                        .WithMany()
                        .HasForeignKey("SprzedajacyId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Sprzedajacy");
                });

            modelBuilder.Entity("komis_aut.Modele.Transakcja", b =>
                {
                    b.HasOne("komis_aut.Modele.Uzytkownik", "Kupujacy")
                        .WithMany()
                        .HasForeignKey("KupujacyId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("komis_aut.Modele.Pojazd", "Pojazd")
                        .WithMany()
                        .HasForeignKey("PojazdId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("komis_aut.Modele.Uzytkownik", "Sprzedajacy")
                        .WithMany()
                        .HasForeignKey("SprzedajacyId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("komis_aut.Modele.Uzytkownik", null)
                        .WithMany("Transakcje")
                        .HasForeignKey("UzytkownikId");

                    b.Navigation("Kupujacy");

                    b.Navigation("Pojazd");

                    b.Navigation("Sprzedajacy");
                });

            modelBuilder.Entity("komis_aut.Modele.Zdjecie", b =>
                {
                    b.HasOne("komis_aut.Modele.Pojazd", "Pojazd")
                        .WithMany("Zdjecia")
                        .HasForeignKey("PojazdId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Pojazd");
                });

            modelBuilder.Entity("komis_aut.Modele.Pojazd", b =>
                {
                    b.Navigation("Oferty");

                    b.Navigation("Zdjecia");
                });

            modelBuilder.Entity("komis_aut.Modele.Uzytkownik", b =>
                {
                    b.Navigation("Oferty");

                    b.Navigation("Transakcje");
                });
#pragma warning restore 612, 618
        }
    }
}
