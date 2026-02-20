namespace WebApplication1.Models;

public class RankingEntry
{
    public int Rank { get; set; }
    public required string Username { get; set; }
    public int HighScore { get; set; }
}