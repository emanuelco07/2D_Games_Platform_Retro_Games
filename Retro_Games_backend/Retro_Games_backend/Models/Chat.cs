using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace WebApplication1.Models;

public class Chat
{
    [Key] public int Id { get; set; } //id ul mesajului

    [JsonPropertyName("username")]
    [MaxLength(50)]

    public required string Username { get; set; } = string.Empty; //username ul utilizatorului care a trimis mesajul
    //initializeaza proprietatea cu un sir gol

    [Required]
    [JsonPropertyName("message")]
    [MaxLength(250)]
    public required string Message { get; set; } //textul mesajului

    public DateTime SendAt { get; set; } //data la care a fost scris mesajul

    //legatura cu tabela Users
    [JsonPropertyName("userId")]
    [Required]
    public int UserId { get; set; }
}