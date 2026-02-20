using System.Text.Json.Serialization;

namespace WebApplication1.Models;

public class LeaderboardEntry
{
    public string Username { get; set; } = null!; //pentru a indica ca nu poate fi null
            
    [JsonPropertyName("highScore")]
    public int HighScore { get; set; }
}