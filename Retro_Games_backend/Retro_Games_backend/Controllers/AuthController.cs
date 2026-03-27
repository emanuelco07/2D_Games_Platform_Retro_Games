using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Controllers;

[ApiController] //indica ca aceasta este o clara de controller API
[Route("api/[controller]")] //defineste ruta de baza pentru acest controller api/Auth
public class AuthController : ControllerBase //Mosteneste din ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly ApplicationDbContext _context; //variabila folosita pentru a interactiona cu baza de date

    //Constructorul Controllerului
    //preluam accesul la baza de date
    public AuthController(ApplicationDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    //metoda pentru inregistrarea unui utilizator nou
    //ruta completa pentru acest endpoint va fi: POST /api/Auth/register
    [HttpPost("register")] //indica faptul ca metoda raspunde la cereri de tip http post pe ruta register
    public async Task<IActionResult> Register([FromBody] User user)
    {
        //verificam daca username-ul si parola sunt goale
        if (string.IsNullOrEmpty(user.Username) || string.IsNullOrEmpty(user.Password))
            //returneaza un raspuns http 400 Bad Requuest cu un mesaj JSON de eroare
            return BadRequest(new { succes = false, message = "Username or password is empty" });

        //verificam existenta username-ului
        if (await _context.Users.AnyAsync(x => x.Username == user.Username))
            //returenaza un raspuns http 409 Conflict, indicand ca username-ul exista deja
            return BadRequest(new { succes = false, message = "Username already exists" });

        //hash-uim parrola
        user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);

        //adaugam utilizatorul in baza de date
        _context.Users.Add(user);
        await _context.SaveChangesAsync(); //salvam modificarile in baza de date (executam insert)

        //raspuns de succes (inregistrarea s a realizat)
        return CreatedAtAction(nameof(Register), new { succes = true, userId = user.Id }, user);
    }

    //metoa pentru autentificare unui utilizator
    //ruta POST api/Auth/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] User loginUser)
    {
        //verificam daca username-ul si parola sunt goale
        if (string.IsNullOrEmpty(loginUser.Username) || string.IsNullOrEmpty(loginUser.Password))
            //daca unul dintre campuri este gol returnam un mesaj de eroare
            return BadRequest(new { succes = false, message = "Username or password is empty" });

        //cautam utilizatorul dupa username in baza de date
        var user = await _context.Users.SingleOrDefaultAsync(u => u.Username == loginUser.Username);

        //verificam daca utilizatorul exista
        if (user == null)
            //din motive de securitate nu confirmam daca user-ul exista deja
            return BadRequest(new { succes = false, message = "Username or password is invalid" });

        //verificam parola hash-uita
        if (!BCrypt.Net.BCrypt.Verify(loginUser.Password, user.Password))
            //daca parola e incorecta trimitem un mesaj de eroare
            return BadRequest(new { succes = false, message = "Invalid username or password" });

        //autentificare reusita

        //obtinem high score ul pentru un joc specifist (snake, tetris, etc)
        var userSpecificGameHighScore = 0;

        //gaseste id ul jocului snake
        var snakeGame = await _context.Games.FirstOrDefaultAsync(g => g.Name == "Snake");

        //daca am gasit jocul
        if (snakeGame != null)
        {
            //cautam scorul utilizatorului pentru jocul snake
            var snakeScore = await _context.UserGameScores
                .FirstOrDefaultAsync(s => s.GameId == snakeGame.Id && s.UserId == user.Id);

            //daca exita, il setam
            if (snakeScore != null) userSpecificGameHighScore = snakeScore.HighScore;
        }

        //generare tocken json
        var issuer = _configuration["JWT:Issuer"]; //Se citeste din appseettings.json
        var audience = _configuration["JWT:Audience"];
        var key = Encoding.ASCII.GetBytes(_configuration["JWT:Key"]!); //se citesste cheia

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()), //id ul utilizatorului
                new Claim("Id", user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Sub, user.Username), //subiect (username)
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()) //id unic pentru token
            }),
            Expires = DateTime.UtcNow.AddHours(2), //token ul expira in 2 ore
            Issuer = issuer,
            Audience = audience,
            SigningCredentials =
                new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        var jwtToken = tokenHandler.WriteToken(token);
        //final generare jwt

        return Ok(new
        {
            succes = true,
            message = "Login successful!",
            userId = user.Id,
            username = user.Username, //util pentru front-end dupa login
            highScore = userSpecificGameHighScore, //util pentru front-end dupa login
            //highscore ul l-am obtinut specific pentru fiecare joc
            token = jwtToken //returneaza token ul jwt
        });
    }
}