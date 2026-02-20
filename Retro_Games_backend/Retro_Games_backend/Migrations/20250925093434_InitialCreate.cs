using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace WebApplication1.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Games",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Games", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Username = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Password = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    RegistrationDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Email = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "UserGameScores",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    GameId = table.Column<int>(type: "int", nullable: false),
                    HighScore = table.Column<int>(type: "int", nullable: false),
                    LastUpdated = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserGameScores", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserGameScores_Games_GameId",
                        column: x => x.GameId,
                        principalTable: "Games",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserGameScores_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Games",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Snake" },
                    { 2, "Tetris" },
                    { 3, "Brick Breaker" },
                    { 4, "Brick Breaker 2" },
                    { 5, "Goal Scorer" },
                    { 6, "Super Bricks" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Email", "Password", "RegistrationDate", "Username" },
                values: new object[,]
                {
                    { 1, null, "$2a$11$rn.FwhrTjNC7E9O3Fk3nm.3CEY.wIZKqbBK6rpWXdPs6tBGoxgueW", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "test_user_c_sharp" },
                    { 2, null, "$2a$11$7i6PP.C/M84I6FsFFFJS2eOKJlppUMAeEb6QzyJ4thZp1U5FEFYjK", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "emanuel" },
                    { 3, null, "$2a$11$b1mfR7RAIB1VeHIAwu8Dn.zkS7WwJnIWrWzDzbsRvfEGd7bLFQAsy", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "emanuelco.07" },
                    { 4, null, "$2a$11$hazM9eN4lNB2h0awMOXebOkAfWSdBMFFr4fjAbnE4Nx6EALpf2nVu", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "andrei" },
                    { 5, null, "$2a$11$x40hWgbfhTmpkasJUwbLH.nEJoLTHP6kNUik203DUG.JVZw4xHm0G", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "final_boss" },
                    { 6, null, "$2a$11$c2iv...by4i8jWxLj38nT.W9N3RiZpmAZaUIDEGBjcsjmLX31Jv.e ", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "vale" },
                    { 7, null, "$2a$11$zhLty/lZixfjZERsRlPDQebGoEIlvKlS3ITUrJMFIMr.NbacbwECG", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "beni" }
                });

            migrationBuilder.InsertData(
                table: "UserGameScores",
                columns: new[] { "Id", "GameId", "HighScore", "LastUpdated", "UserId" },
                values: new object[,]
                {
                    { 1, 1, 80, new DateTime(2025, 9, 23, 11, 9, 51, 420, DateTimeKind.Unspecified).AddTicks(5300), 2 },
                    { 2, 1, 2, new DateTime(2025, 7, 15, 14, 10, 17, 179, DateTimeKind.Unspecified).AddTicks(8280), 4 },
                    { 3, 1, 39, new DateTime(2025, 7, 28, 13, 30, 5, 335, DateTimeKind.Unspecified).AddTicks(2550), 3 },
                    { 4, 1, 45, new DateTime(2025, 9, 23, 11, 14, 11, 813, DateTimeKind.Unspecified).AddTicks(990), 5 },
                    { 5, 1, 1, new DateTime(2025, 7, 15, 14, 11, 25, 620, DateTimeKind.Unspecified).AddTicks(340), 6 },
                    { 6, 1, 4, new DateTime(2025, 7, 15, 14, 19, 15, 913, DateTimeKind.Unspecified).AddTicks(9630), 1 },
                    { 7, 2, 28154, new DateTime(2025, 7, 24, 8, 43, 22, 392, DateTimeKind.Unspecified).AddTicks(4070), 3 },
                    { 8, 2, 204, new DateTime(2025, 7, 23, 9, 41, 58, 901, DateTimeKind.Unspecified).AddTicks(3020), 4 },
                    { 9, 2, 314, new DateTime(2025, 7, 24, 9, 42, 5, 747, DateTimeKind.Unspecified).AddTicks(8460), 6 },
                    { 10, 2, 194, new DateTime(2025, 7, 23, 9, 42, 57, 10, DateTimeKind.Unspecified).AddTicks(320), 1 },
                    { 11, 2, 8412, new DateTime(2025, 8, 11, 13, 56, 8, 203, DateTimeKind.Unspecified).AddTicks(9570), 2 },
                    { 12, 3, 6207, new DateTime(2025, 9, 19, 9, 57, 3, 365, DateTimeKind.Unspecified).AddTicks(4290), 2 },
                    { 13, 3, 3456, new DateTime(2025, 8, 20, 11, 18, 45, 516, DateTimeKind.Unspecified).AddTicks(1550), 3 },
                    { 14, 3, 1100, new DateTime(2025, 8, 14, 11, 27, 1, 53, DateTimeKind.Unspecified).AddTicks(3870), 6 },
                    { 15, 3, 500, new DateTime(2025, 8, 19, 11, 33, 35, 830, DateTimeKind.Unspecified).AddTicks(8930), 1 },
                    { 16, 3, 7014, new DateTime(2025, 8, 20, 12, 18, 5, 929, DateTimeKind.Unspecified).AddTicks(1480), 4 },
                    { 17, 4, 3430, new DateTime(2025, 8, 20, 11, 59, 40, 679, DateTimeKind.Unspecified).AddTicks(8820), 3 },
                    { 18, 4, 5678, new DateTime(2025, 8, 20, 12, 44, 27, 665, DateTimeKind.Unspecified).AddTicks(2140), 4 },
                    { 19, 5, 20, new DateTime(2025, 8, 25, 14, 32, 2, 217, DateTimeKind.Unspecified).AddTicks(1260), 2 },
                    { 20, 5, 10, new DateTime(2025, 8, 25, 14, 34, 1, 880, DateTimeKind.Unspecified).AddTicks(6930), 3 },
                    { 21, 5, 20, new DateTime(2025, 8, 25, 14, 52, 3, 98, DateTimeKind.Unspecified).AddTicks(6460), 6 },
                    { 22, 6, 23500, new DateTime(2025, 9, 1, 13, 44, 24, 105, DateTimeKind.Unspecified).AddTicks(2200), 2 },
                    { 23, 6, 6500, new DateTime(2025, 9, 1, 13, 51, 15, 97, DateTimeKind.Unspecified).AddTicks(1270), 6 },
                    { 24, 6, 5700, new DateTime(2025, 9, 1, 14, 24, 29, 104, DateTimeKind.Unspecified).AddTicks(5250), 3 },
                    { 25, 6, 16894, new DateTime(2025, 9, 1, 14, 27, 31, 353, DateTimeKind.Unspecified).AddTicks(6610), 1 },
                    { 26, 6, 19391, new DateTime(2025, 9, 1, 14, 29, 54, 950, DateTimeKind.Unspecified).AddTicks(4740), 4 },
                    { 27, 4, 6914, new DateTime(2025, 9, 22, 14, 46, 20, 926, DateTimeKind.Unspecified).AddTicks(8190), 2 },
                    { 28, 4, 6066, new DateTime(2025, 9, 22, 15, 14, 59, 684, DateTimeKind.Unspecified).AddTicks(5460), 2 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserGameScores_GameId",
                table: "UserGameScores",
                column: "GameId");

            migrationBuilder.CreateIndex(
                name: "IX_UserGameScores_UserId",
                table: "UserGameScores",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Username",
                table: "Users",
                column: "Username",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserGameScores");

            migrationBuilder.DropTable(
                name: "Games");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
