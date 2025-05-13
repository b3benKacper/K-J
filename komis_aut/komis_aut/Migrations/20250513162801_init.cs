using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace komis_aut.Migrations
{
    /// <inheritdoc />
    public partial class init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Uzytkownicy",
                columns: table => new
                {
                    UzytkownikId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Imie = table.Column<string>(type: "text", nullable: false),
                    Nazwisko = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    Haslo = table.Column<string>(type: "text", nullable: false),
                    Telefon = table.Column<string>(type: "text", nullable: false),
                    Rola = table.Column<string>(type: "text", nullable: false),
                    DataRejestracji = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Uzytkownicy", x => x.UzytkownikId);
                });

            migrationBuilder.CreateTable(
                name: "Pojazdy",
                columns: table => new
                {
                    PojazdId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SprzedajacyId = table.Column<int>(type: "integer", nullable: false),
                    Marka = table.Column<string>(type: "text", nullable: false),
                    Model = table.Column<string>(type: "text", nullable: false),
                    RokProdukcji = table.Column<int>(type: "integer", nullable: false),
                    Cena = table.Column<decimal>(type: "numeric", nullable: false),
                    Przebieg = table.Column<int>(type: "integer", nullable: false),
                    RodzajPaliwa = table.Column<string>(type: "text", nullable: false),
                    SkrzyniaBiegow = table.Column<string>(type: "text", nullable: false),
                    Opis = table.Column<string>(type: "text", nullable: false),
                    DataDodania = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pojazdy", x => x.PojazdId);
                    table.ForeignKey(
                        name: "FK_Pojazdy_Uzytkownicy_SprzedajacyId",
                        column: x => x.SprzedajacyId,
                        principalTable: "Uzytkownicy",
                        principalColumn: "UzytkownikId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Oferty",
                columns: table => new
                {
                    OfertaId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PojazdId = table.Column<int>(type: "integer", nullable: false),
                    KupujacyId = table.Column<int>(type: "integer", nullable: false),
                    Kwota = table.Column<decimal>(type: "numeric", nullable: false),
                    DataZalozenia = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Oferty", x => x.OfertaId);
                    table.ForeignKey(
                        name: "FK_Oferty_Pojazdy_PojazdId",
                        column: x => x.PojazdId,
                        principalTable: "Pojazdy",
                        principalColumn: "PojazdId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Oferty_Uzytkownicy_KupujacyId",
                        column: x => x.KupujacyId,
                        principalTable: "Uzytkownicy",
                        principalColumn: "UzytkownikId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Transakcje",
                columns: table => new
                {
                    TransakcjaId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PojazdId = table.Column<int>(type: "integer", nullable: false),
                    KupujacyId = table.Column<int>(type: "integer", nullable: false),
                    SprzedajacyId = table.Column<int>(type: "integer", nullable: false),
                    CenaKoncowa = table.Column<decimal>(type: "numeric", nullable: false),
                    DataTransakcji = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    StatusPlatnosci = table.Column<string>(type: "text", nullable: false),
                    UzytkownikId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Transakcje", x => x.TransakcjaId);
                    table.ForeignKey(
                        name: "FK_Transakcje_Pojazdy_PojazdId",
                        column: x => x.PojazdId,
                        principalTable: "Pojazdy",
                        principalColumn: "PojazdId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Transakcje_Uzytkownicy_KupujacyId",
                        column: x => x.KupujacyId,
                        principalTable: "Uzytkownicy",
                        principalColumn: "UzytkownikId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Transakcje_Uzytkownicy_SprzedajacyId",
                        column: x => x.SprzedajacyId,
                        principalTable: "Uzytkownicy",
                        principalColumn: "UzytkownikId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Transakcje_Uzytkownicy_UzytkownikId",
                        column: x => x.UzytkownikId,
                        principalTable: "Uzytkownicy",
                        principalColumn: "UzytkownikId");
                });

            migrationBuilder.CreateTable(
                name: "Zdjecia",
                columns: table => new
                {
                    ZdjecieId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PojazdId = table.Column<int>(type: "integer", nullable: false),
                    ZdjecieUrl = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Zdjecia", x => x.ZdjecieId);
                    table.ForeignKey(
                        name: "FK_Zdjecia_Pojazdy_PojazdId",
                        column: x => x.PojazdId,
                        principalTable: "Pojazdy",
                        principalColumn: "PojazdId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Oferty_KupujacyId",
                table: "Oferty",
                column: "KupujacyId");

            migrationBuilder.CreateIndex(
                name: "IX_Oferty_PojazdId",
                table: "Oferty",
                column: "PojazdId");

            migrationBuilder.CreateIndex(
                name: "IX_Pojazdy_SprzedajacyId",
                table: "Pojazdy",
                column: "SprzedajacyId");

            migrationBuilder.CreateIndex(
                name: "IX_Transakcje_KupujacyId",
                table: "Transakcje",
                column: "KupujacyId");

            migrationBuilder.CreateIndex(
                name: "IX_Transakcje_PojazdId",
                table: "Transakcje",
                column: "PojazdId");

            migrationBuilder.CreateIndex(
                name: "IX_Transakcje_SprzedajacyId",
                table: "Transakcje",
                column: "SprzedajacyId");

            migrationBuilder.CreateIndex(
                name: "IX_Transakcje_UzytkownikId",
                table: "Transakcje",
                column: "UzytkownikId");

            migrationBuilder.CreateIndex(
                name: "IX_Zdjecia_PojazdId",
                table: "Zdjecia",
                column: "PojazdId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Oferty");

            migrationBuilder.DropTable(
                name: "Transakcje");

            migrationBuilder.DropTable(
                name: "Zdjecia");

            migrationBuilder.DropTable(
                name: "Pojazdy");

            migrationBuilder.DropTable(
                name: "Uzytkownicy");
        }
    }
}
