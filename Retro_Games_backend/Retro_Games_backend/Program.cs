using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json;
using Microsoft.OpenApi.Models;
using WebApplication1.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "Retro Games API", Version = "v1" });

    //adauga suport pentru JWT Bearer authentication
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer ' [space] and then your token in the text input below.\n\nExample: 'Bearer 12345abcdef'",
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});


//inregistrarea controllelor
builder.Services.AddControllers()
    .AddJsonOptions(options => 
    {
        //aceasta linie este esentiala pentru a converti PascalCase (HighScore) in camelCase (highScore)
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.WriteIndented = true;
    });

//incepem configurarea DbContexxt pentru PostgreSQL
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    //foloseste npgsql pentru a se conecta la PostgreSQL
    //"DefaultConnection" va fi citit din appsettings.json
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    );
});
//configurare incheiata

//configuram CORS pentru a permite Angular sa comunice 
/*
 * Cross-Origin Resource Sharing (CORS) is a security mechanism
 * that controls how web applications running on one domain
 * can access resources from another domain
 */
builder.Services.AddCors(options =>
{
    options.AddPolicy("RetroGames", //numele politicii CORS
        policy => policy.WithOrigins("http://localhost:4200") //URL ul catre front end ul de Angular
            .AllowAnyHeader() //permite orice header in cerere
            .AllowAnyMethod()); //permite orice metoda in cerere
});
//finalizare configurare CORS

//Configurare JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    //setari pentru validarea tocken ului
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true, //valideaza emitentul tocken ului
        ValidateAudience = true, //valideaza audienta (clientul)
        ValidateLifetime = true, //valideaza durata de viata a tocken ului
        ValidateIssuerSigningKey = true, //valideaza cheia de semnare

        //valori citite din appsettings.json
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
    };
});

builder.Services.AddAuthorization(); //pentru adaugarea serviciului de autorizare

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


//app.UseHttpsRedirection(); o comentam pentru nu pot accesa portul 5040

//folosirea politicii CORS in pipeline ul HTTP
app.UseCors("RetroGames");

//trebuie adaugate dupa app.UserCors() si inainte de app.MapControllers
app.UseAuthentication(); //pornim autentificare JWT
app.UseAuthorization(); //daca vrem sa adaugam autorizare

//maparea controlelor API
app.MapControllers();

app.Run();
