using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace WebApplication1.Models;

public class Bug
{
    [Key]
    public int Id { get; set; } //id ul bug ului
    
    [Required]
    [MaxLength(500)]
    public required string Description { get; set; } //descrierea bug ului
    
    public DateTime ReportedAt { get; set; } //data la care a fost raportat bug ul
    
    //legatura cu tabela Users
    [JsonPropertyName("userId")]
    [Required]
    public int UserId { get; set; }

}