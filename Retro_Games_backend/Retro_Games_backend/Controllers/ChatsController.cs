using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ChatsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET api/chats
    [HttpGet]
    public async Task<IActionResult> GetChats()
    {
        var chats = await _context.Chats
            .OrderByDescending(c => c.SendAt)
            .Take(200)
            .ToListAsync();

        return Ok(chats);
    }

    // POST api/chats
    [HttpPost]
    public async Task<IActionResult> PostChat([FromBody] Chat chat)
    {
        if (string.IsNullOrWhiteSpace(chat.Username) || string.IsNullOrWhiteSpace(chat.Message))
            return BadRequest("Username si mesajul sunt obligatorii.");

        chat.SendAt = DateTime.UtcNow;

        _context.Chats.Add(chat);
        await _context.SaveChangesAsync();

        return Ok(chat);
    }
}