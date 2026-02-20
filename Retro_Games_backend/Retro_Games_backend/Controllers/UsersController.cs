using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")] //ruta de baza: api/Users
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        //metoda ajutatoare pentru a obtine GameId pe baza numelui jocului
        private async Task<Game?> GetGameNameByNameAsync(string gameName)
        {
            //cauta jcoul in baza de date
            return await _context.Games.FirstOrDefaultAsync(g => g.Name == gameName);
        }
        
        //POST: /api/Users/Leaderboard
        //primeste GameName in body pentru flezibilitate
        [HttpPost("leaderboard")]
        public async Task<ActionResult<IEnumerable<LeaderboardEntry>>> GetLeaderboard([FromBody] GameRequestModel request)
        {
            //validam daca numele jocului a fost trimis
            if (string.IsNullOrEmpty(request.GameName))
            {
                return BadRequest("GameName is required");
            }
            
            //obtinem informatii depsre joc
            var game = await GetGameNameByNameAsync(request.GameName);
            if (game == null)
            {
                return NotFound($"Game '{request.GameName}' not found.");
            }
            
            //Interogam tabela UserGameScore, filtrand dupa GameId si ordonant primii 5 dupa scor
            var leaderboard = await _context.UserGameScores
                .Where(ugs => ugs.GameId == game.Id) //filtreaza scorurile dupa jocul specific
                .OrderByDescending(ugs => ugs.HighScore) //ordonam dupa highscore
                .Take(5) //luam primii 5
                .Select(ugs => new LeaderboardEntry
                {
                    Username = ugs.User.Username, //accesam username de la obiectul user asociat
                    HighScore = ugs.HighScore
                })
                .ToListAsync(); //executa query ul asincron (nu se blocheaza firul principal de executie)
            
            return Ok(leaderboard);
        }
        
        // POST: /api/Users/Rankings
        // primeste GameName in body
        [HttpPost("rankings")]
        public async Task<ActionResult<IEnumerable<RankingEntry>>> GetRankings([FromBody] GameRequestModel request)
        {
            if (string.IsNullOrEmpty(request.GameName))
            {
                return BadRequest("GameName is required");
            }

            var game = await GetGameNameByNameAsync(request.GameName);
            if (game == null)
            {
                return NotFound($"Game '{request.GameName}' not found.");
            }

            //luam toti jucatorii ordonati dupa scor
            var rankingsRaw = await _context.UserGameScores
                .Where(ugs => ugs.GameId == game.Id)
                .OrderByDescending(ugs => ugs.HighScore)
                .Select(ugs => new
                {
                    username = ugs.User.Username,
                    highscore = ugs.HighScore
                })
                .ToListAsync();

            // adaugam si pozitia (rank)
            var rankings = rankingsRaw
                .Select((entry, index) => new RankingEntry
                {
                    Rank = index + 1,
                    Username = entry.username,
                    HighScore = entry.highscore
                })
                .ToList();

            return Ok(rankings);
        }

        //POST: /api/Users/highscore{gameGame}
        [Authorize]
        [HttpPost("highscore")]
        public async Task<ActionResult<int>> GetHighScore([FromBody] GameRequestModel request) //ne citeste nume jocului din body
        {
            
            //extragem UserId fin token ul JWT
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                return Unauthorized(); //daca id ul utilizatorului nu poate fi exstras sau e invalid
            }
            
            //validam daca numele jocului a fost trimis
            if (string.IsNullOrEmpty(request.GameName))
            {
                return BadRequest("GameName is required");
            }
            
            //obtinem informatii depsre joc
            var game = await GetGameNameByNameAsync(request.GameName);
            if (game == null)
            {
                return NotFound($"Game '{request.GameName}' not found.");
            }
            
            //Cauta scorul maxim al utilizatorului pentru jocul specific
            var userGameScore = await _context.UserGameScores
                .FirstOrDefaultAsync(ugs => ugs.GameId == game.Id && ugs.UserId == userId);
            
            //returneaza scorul sau 0 daca nu exista inca un scor
            return Ok(new { highScore = userGameScore?.HighScore ?? 0 });
        }
        
        //PUT: /api/Users/updatehighscore
        //[FromBody] preia scorul din corpul JSON al cererii
        [Authorize] //doar utilizatorii autentificati pot accesa acest endpoint
        [HttpPut("updatehighscore")]
        public async Task<IActionResult> UpdateHighScore([FromBody] ScoreUpdateModel model)
        {
            //verificam modelul primit
            if (!ModelState.IsValid || string.IsNullOrEmpty(model.GameName))
            {
                return BadRequest("Invalid score update data or game name missing!");
            }
            
            //extragem UserId din JWT
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                return Unauthorized(); //daca id ul utilizatorului nu poate fi extras sau e invalid
            }
            
            //obtinem informatiile despre joc
            var game = await GetGameNameByNameAsync(model.GameName);
            if (game == null)
            {
                return NotFound($"Game '{model.GameName}' not found.");
            }
            
            //cautam inregistrarea UserGameScore existenta pentru jocul x si utilizatorul y
            var userGameScore = await _context.UserGameScores
                .FirstOrDefaultAsync(ugs => ugs.GameId == game.Id && ugs.UserId == userId);

            if (userGameScore == null)
            {
                //daca nu exista o inregistrare o cream
                userGameScore = new UserGameScore
                {
                    UserId = userId,
                    GameId = game.Id,
                    HighScore = model.Score,
                    LastUpdated = DateTime.UtcNow
                };
                _context.UserGameScores.Add(userGameScore);
            }
            else
            {
                //daca exista si noul scor este mai mare, il actualizam
                if (model.Score > userGameScore.HighScore)
                {
                    userGameScore.HighScore = model.Score; //modificam highscore ul
                    userGameScore.LastUpdated = DateTime.UtcNow; //salvam data la care a fost modificat
                    _context.UserGameScores.Update(userGameScore); //marcheaza unitatea ca modificata
                }
            }
            
            //salvam modificarile in baza de date
            await _context.SaveChangesAsync();
            
            return Ok(new { message = "High score updated successfully." });
        }
        
        public class GameRequestModel
        {
            public string GameName { get; set; } = null!;
        }
    }
}