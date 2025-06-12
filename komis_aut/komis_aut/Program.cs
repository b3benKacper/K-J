using komis_aut.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Dodaj bazę danych
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Dodaj kontrolery API + Razor Pages
builder.Services.AddControllers();
builder.Services.AddRazorPages();

// JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

// CORS – dla frontendu (np. React)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Middleware pipeline
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors("AllowReact");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapRazorPages();

// ------- SEEDING ADMINA -------//
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    if (!context.Uzytkownicy.Any(u => u.Rola == "ADMIN"))
    {
        var admin = new komis_aut.Modele.Uzytkownik
        {
            Imie = "Admin",
            Nazwisko = "Admin",
            Email = "admin@admin.pl",
            Haslo = BCrypt.Net.BCrypt.HashPassword("admin1234"),
            Telefon = "123456789",
            Rola = "ADMIN",
            DataRejestracji = DateOnly.FromDateTime(DateTime.Now)
        };
        context.Uzytkownicy.Add(admin);
        context.SaveChanges();
    }
}
// ------- KONIEC SEEDINGU -------//

app.Run();