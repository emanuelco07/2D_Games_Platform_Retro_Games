using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Models;

public class UserGameScore
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)] //indica auto-increment
    public int Id { get; set; } //id ul tabelei

    public int UserId { get; set; } //id ul utilizatorului, cheie straina
    public int GameId { get; set; } //id ul jocului

    //ii permite lui EF Core sa incarce automat intreg obiectul User atunci cand se preia UserGameScore
    public User User { get; set; } = null!; //proprietatea de navigatie catre user, EF va intele ca UserId este cheia 

    //straina pentru relatia User
    public Game Game { get; set; } = null!; //null! (nullable forgiving operator) indica compilatorului
    //ca aceasta proprietate va fi initializata de EF Core
    //(nu va fii null in timpul utilizarii runtime odata ce este incarcata din DB)

    public int HighScore { get; set; } //valoarea scorului maxim

    public DateTime LastUpdated { get; set; } = DateTime.UtcNow; //data la care s-a actualizat ultima data scorului
    //Data si ora in format UTC (Coordinated universal time)
}