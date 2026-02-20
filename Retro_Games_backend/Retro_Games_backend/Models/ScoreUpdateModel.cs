namespace WebApplication1.Models;

public class ScoreUpdateModel
{
    public int Score { get; set; }
    public string GameName { get; set; } = null!; //numele jocului nu poate fi null
}