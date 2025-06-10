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
                name: "uzytkownicy",
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
                    DataRejestracji = table.Column<DateOnly>(type: "date", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_uzytkownicy", x => x.UzytkownikId);
                });

            migrationBuilder.CreateTable(
                name: "pojazdy",
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
                    DataDodania = table.Column<DateOnly>(type: "date", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_pojazdy", x => x.PojazdId);
                    table.ForeignKey(
                        name: "FK_pojazdy_uzytkownicy_SprzedajacyId",
                        column: x => x.SprzedajacyId,
                        principalTable: "uzytkownicy",
                        principalColumn: "UzytkownikId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "oferty",
                columns: table => new
                {
                    OfertaId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PojazdId = table.Column<int>(type: "integer", nullable: false),
                    KupujacyId = table.Column<int>(type: "integer", nullable: false),
                    Kwota = table.Column<decimal>(type: "numeric", nullable: false),
                    DataZalozenia = table.Column<DateOnly>(type: "date", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_oferty", x => x.OfertaId);
                    table.ForeignKey(
                        name: "FK_oferty_pojazdy_PojazdId",
                        column: x => x.PojazdId,
                        principalTable: "pojazdy",
                        principalColumn: "PojazdId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_oferty_uzytkownicy_KupujacyId",
                        column: x => x.KupujacyId,
                        principalTable: "uzytkownicy",
                        principalColumn: "UzytkownikId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "transakcje",
                columns: table => new
                {
                    TransakcjaId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PojazdId = table.Column<int>(type: "integer", nullable: false),
                    KupujacyId = table.Column<int>(type: "integer", nullable: false),
                    SprzedajacyId = table.Column<int>(type: "integer", nullable: false),
                    CenaKoncowa = table.Column<decimal>(type: "numeric", nullable: false),
                    DataTransakcji = table.Column<DateOnly>(type: "date", nullable: false),
                    StatusPlatnosci = table.Column<string>(type: "text", nullable: false),
                    UzytkownikId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_transakcje", x => x.TransakcjaId);
                    table.ForeignKey(
                        name: "FK_transakcje_pojazdy_PojazdId",
                        column: x => x.PojazdId,
                        principalTable: "pojazdy",
                        principalColumn: "PojazdId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_transakcje_uzytkownicy_KupujacyId",
                        column: x => x.KupujacyId,
                        principalTable: "uzytkownicy",
                        principalColumn: "UzytkownikId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_transakcje_uzytkownicy_SprzedajacyId",
                        column: x => x.SprzedajacyId,
                        principalTable: "uzytkownicy",
                        principalColumn: "UzytkownikId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_transakcje_uzytkownicy_UzytkownikId",
                        column: x => x.UzytkownikId,
                        principalTable: "uzytkownicy",
                        principalColumn: "UzytkownikId");
                });

            migrationBuilder.CreateTable(
                name: "zdjecia",
                columns: table => new
                {
                    ZdjecieId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PojazdId = table.Column<int>(type: "integer", nullable: false),
                    ZdjecieUrl = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_zdjecia", x => x.ZdjecieId);
                    table.ForeignKey(
                        name: "FK_zdjecia_pojazdy_PojazdId",
                        column: x => x.PojazdId,
                        principalTable: "pojazdy",
                        principalColumn: "PojazdId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_oferty_KupujacyId",
                table: "oferty",
                column: "KupujacyId");

            migrationBuilder.CreateIndex(
                name: "IX_oferty_PojazdId",
                table: "oferty",
                column: "PojazdId");

            migrationBuilder.CreateIndex(
                name: "IX_pojazdy_SprzedajacyId",
                table: "pojazdy",
                column: "SprzedajacyId");

            migrationBuilder.CreateIndex(
                name: "IX_transakcje_KupujacyId",
                table: "transakcje",
                column: "KupujacyId");

            migrationBuilder.CreateIndex(
                name: "IX_transakcje_PojazdId",
                table: "transakcje",
                column: "PojazdId");

            migrationBuilder.CreateIndex(
                name: "IX_transakcje_SprzedajacyId",
                table: "transakcje",
                column: "SprzedajacyId");

            migrationBuilder.CreateIndex(
                name: "IX_transakcje_UzytkownikId",
                table: "transakcje",
                column: "UzytkownikId");

            migrationBuilder.CreateIndex(
                name: "IX_zdjecia_PojazdId",
                table: "zdjecia",
                column: "PojazdId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "oferty");

            migrationBuilder.DropTable(
                name: "transakcje");

            migrationBuilder.DropTable(
                name: "zdjecia");

            migrationBuilder.DropTable(
                name: "pojazdy");

            migrationBuilder.DropTable(
                name: "uzytkownicy");
        }
    }
}
