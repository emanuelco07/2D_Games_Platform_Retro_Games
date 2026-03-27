using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;

namespace WebApplication1.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    //aceasta va deveni tabela "Users" in baza de date
    public DbSet<User> Users { get; set; }
    public DbSet<Game> Games { get; set; }
    public DbSet<UserGameScore> UserGameScores { get; set; }
    public DbSet<Chat> Chats { get; set; }
    public DbSet<Bug> Bugs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        //sa ne asiguram ca username ul este unic, cu toate ca am specificat asta la crearea "tabelei"
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();

        //adaugam cateva jocuri in baza de date
        modelBuilder.Entity<Game>().HasData(
            new Game { Id = 1, Name = "Snake" },
            new Game { Id = 2, Name = "Tetris" },
            new Game { Id = 3, Name = "Brick Breaker" },
            new Game { Id = 4, Name = "Brick Breaker 2" },
            new Game { Id = 5, Name = "Goal Scorer" },
            new Game { Id = 6, Name = "Super Bricks" }
        );

        //adaugam cativa utilizatori in baza de date
        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = 1, Username = "test_user_c_sharp",
                Password = "$2a$11$rn.FwhrTjNC7E9O3Fk3nm.3CEY.wIZKqbBK6rpWXdPs6tBGoxgueW"
            },
            new User
            {
                Id = 2, Username = "emanuel", Password = "$2a$11$7i6PP.C/M84I6FsFFFJS2eOKJlppUMAeEb6QzyJ4thZp1U5FEFYjK"
            },
            new User
            {
                Id = 3, Username = "emanuelco.07",
                Password = "$2a$11$b1mfR7RAIB1VeHIAwu8Dn.zkS7WwJnIWrWzDzbsRvfEGd7bLFQAsy"
            },
            new User
            {
                Id = 4, Username = "andrei", Password = "$2a$11$hazM9eN4lNB2h0awMOXebOkAfWSdBMFFr4fjAbnE4Nx6EALpf2nVu"
            },
            new User
            {
                Id = 5, Username = "final_boss",
                Password = "$2a$11$x40hWgbfhTmpkasJUwbLH.nEJoLTHP6kNUik203DUG.JVZw4xHm0G"
            },
            new User
            {
                Id = 6, Username = "vale", Password = "$2a$11$c2iv...by4i8jWxLj38nT.W9N3RiZpmAZaUIDEGBjcsjmLX31Jv.e "
            },
            new User
            {
                Id = 7, Username = "beni", Password = "$2a$11$zhLty/lZixfjZERsRlPDQebGoEIlvKlS3ITUrJMFIMr.NbacbwECG"
            }
        );

        // adaugam scorurile utilizatorilor in baza de date
        modelBuilder.Entity<UserGameScore>().HasData(
            new UserGameScore
            {
                Id = 1, UserId = 2, GameId = 1, HighScore = 80,
                LastUpdated = DateTime.Parse("2025-09-23 11:09:51.42053")
            },
            new UserGameScore
            {
                Id = 2, UserId = 4, GameId = 1, HighScore = 2,
                LastUpdated = DateTime.Parse("2025-07-15 14:10:17.179828")
            },
            new UserGameScore
            {
                Id = 3, UserId = 3, GameId = 1, HighScore = 39,
                LastUpdated = DateTime.Parse("2025-07-28 13:30:05.335255")
            },
            new UserGameScore
            {
                Id = 4, UserId = 5, GameId = 1, HighScore = 45,
                LastUpdated = DateTime.Parse("2025-09-23 11:14:11.813099")
            },
            new UserGameScore
            {
                Id = 5, UserId = 6, GameId = 1, HighScore = 1,
                LastUpdated = DateTime.Parse("2025-07-15 14:11:25.620034")
            },
            new UserGameScore
            {
                Id = 6, UserId = 1, GameId = 1, HighScore = 4,
                LastUpdated = DateTime.Parse("2025-07-15 14:19:15.913963")
            },
            new UserGameScore
            {
                Id = 7, UserId = 3, GameId = 2, HighScore = 28154,
                LastUpdated = DateTime.Parse("2025-07-24 08:43:22.392407")
            },
            new UserGameScore
            {
                Id = 8, UserId = 4, GameId = 2, HighScore = 204,
                LastUpdated = DateTime.Parse("2025-07-23 09:41:58.901302")
            },
            new UserGameScore
            {
                Id = 9, UserId = 6, GameId = 2, HighScore = 314,
                LastUpdated = DateTime.Parse("2025-07-24 09:42:05.747846")
            },
            new UserGameScore
            {
                Id = 10, UserId = 1, GameId = 2, HighScore = 194,
                LastUpdated = DateTime.Parse("2025-07-23 09:42:57.010032")
            },
            new UserGameScore
            {
                Id = 11, UserId = 2, GameId = 2, HighScore = 8412,
                LastUpdated = DateTime.Parse("2025-08-11 13:56:08.203957")
            },
            new UserGameScore
            {
                Id = 12, UserId = 2, GameId = 3, HighScore = 6207,
                LastUpdated = DateTime.Parse("2025-09-19 09:57:03.365429")
            },
            new UserGameScore
            {
                Id = 13, UserId = 3, GameId = 3, HighScore = 3456,
                LastUpdated = DateTime.Parse("2025-08-20 11:18:45.516155")
            },
            new UserGameScore
            {
                Id = 14, UserId = 6, GameId = 3, HighScore = 1100,
                LastUpdated = DateTime.Parse("2025-08-14 11:27:01.053387")
            },
            new UserGameScore
            {
                Id = 15, UserId = 1, GameId = 3, HighScore = 500,
                LastUpdated = DateTime.Parse("2025-08-19 11:33:35.830893")
            },
            new UserGameScore
            {
                Id = 16, UserId = 4, GameId = 3, HighScore = 7014,
                LastUpdated = DateTime.Parse("2025-08-20 12:18:05.929148")
            },
            new UserGameScore
            {
                Id = 17, UserId = 3, GameId = 4, HighScore = 3430,
                LastUpdated = DateTime.Parse("2025-08-20 11:59:40.679882")
            },
            new UserGameScore
            {
                Id = 18, UserId = 4, GameId = 4, HighScore = 5678,
                LastUpdated = DateTime.Parse("2025-08-20 12:44:27.665214")
            },
            new UserGameScore
            {
                Id = 19, UserId = 2, GameId = 5, HighScore = 20,
                LastUpdated = DateTime.Parse("2025-08-25 14:32:02.217126")
            },
            new UserGameScore
            {
                Id = 20, UserId = 3, GameId = 5, HighScore = 10,
                LastUpdated = DateTime.Parse("2025-08-25 14:34:01.880693")
            },
            new UserGameScore
            {
                Id = 21, UserId = 6, GameId = 5, HighScore = 20,
                LastUpdated = DateTime.Parse("2025-08-25 14:52:03.098646")
            },
            new UserGameScore
            {
                Id = 22, UserId = 2, GameId = 6, HighScore = 23500,
                LastUpdated = DateTime.Parse("2025-09-01 13:44:24.10522")
            },
            new UserGameScore
            {
                Id = 23, UserId = 6, GameId = 6, HighScore = 6500,
                LastUpdated = DateTime.Parse("2025-09-01 13:51:15.097127")
            },
            new UserGameScore
            {
                Id = 24, UserId = 3, GameId = 6, HighScore = 5700,
                LastUpdated = DateTime.Parse("2025-09-01 14:24:29.104525")
            },
            new UserGameScore
            {
                Id = 25, UserId = 1, GameId = 6, HighScore = 16894,
                LastUpdated = DateTime.Parse("2025-09-01 14:27:31.353661")
            },
            new UserGameScore
            {
                Id = 26, UserId = 4, GameId = 6, HighScore = 19391,
                LastUpdated = DateTime.Parse("2025-09-01 14:29:54.950474")
            },
            new UserGameScore
            {
                Id = 27, UserId = 2, GameId = 4, HighScore = 6914,
                LastUpdated = DateTime.Parse("2025-09-22 14:46:20.926819")
            },
            new UserGameScore
            {
                Id = 28, UserId = 2, GameId = 4, HighScore = 6066,
                LastUpdated = DateTime.Parse("2025-09-22 15:14:59.684546")
            }
        );
    }
}