using Microsoft.AspNetCore.Mvc;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BugsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public BugsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // POST api/bugs
    [HttpPost]
    public async Task<IActionResult> PostBug([FromBody] Bug bug)
    {
        if (string.IsNullOrWhiteSpace(bug.Description)) return BadRequest("Mesajul este obligatoriu!");

        bug.ReportedAt = DateTime.UtcNow;

        _context.Bugs.Add(bug);
        await _context.SaveChangesAsync();

        return Ok(bug);
    }
}