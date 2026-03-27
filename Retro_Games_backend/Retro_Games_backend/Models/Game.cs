using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Models;

public class Game
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)] //indica auto-increment
    public int Id { get; set; }

    [Required] [MaxLength(100)] public required string Name { get; set; }

    public ICollection<UserGameScore>? UserGameScores { get; set; } = new List<UserGameScore>();
    //permite sa vezi scorul inregistrat pentru un anumit joc
}