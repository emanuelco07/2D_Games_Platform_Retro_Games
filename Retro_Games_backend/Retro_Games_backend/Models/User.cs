using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Models;

public class User
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)] //indica auto increment 
    public int Id { get; set; }
    
    [Required] //face campul NOT NULL, pentru ca username ul trebuie sa fie mereu completat
    [MaxLength(50)] //setam lungimea maxima 
    public required string Username { get; set; }
    
    [Required] //parola este obligatorie
    [MaxLength(255)]
    public required string Password { get; set; } //parola inca nu e hash-uita/rezolvam mai tarziu

    //public int HighScore { get; set; } //scorul va fii in tabela de legatura UserGameScore, deoarece scorul depinde 
    //atat e joc cat si de jucator
    
    public DateTime RegistrationDate { get; set; } 
    [MaxLength(70)]
    public string? Email { get; set; } //?-inseamna ca poate avea valori null, poate fi null
    //am adaugat datele de mai sus pentru a testa ce se intampla cand modific tabela si realizez alta migratie
    
    public ICollection<UserGameScore>? UserGameScores { get; set; } =  new List<UserGameScore>();
    //permite sa vezi scourile inregistrate pentru orice joc
    
    //stabilim relatiile (one to many)
    public ICollection<Chat> Chats { get; set; } = new List<Chat>();
    public ICollection<Bug> Bugs { get; set; } = new List<Bug>();
}