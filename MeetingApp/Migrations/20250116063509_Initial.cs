using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace MeetingApp.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Meetings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Date = table.Column<DateTime>(type: "TEXT", nullable: false),
                    StartTime = table.Column<TimeSpan>(type: "TEXT", nullable: false),
                    EndTime = table.Column<TimeSpan>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Meetings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Username = table.Column<string>(type: "TEXT", nullable: false),
                    Email = table.Column<string>(type: "TEXT", nullable: false),
                    PasswordHash = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Meetings",
                columns: new[] { "Id", "Date", "Description", "EndTime", "Name", "StartTime" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 1, 16, 0, 0, 0, 0, DateTimeKind.Local), "Weekly team sync to discuss ongoing tasks and blockers.", new TimeSpan(0, 10, 0, 0, 0), "Team Sync", new TimeSpan(0, 9, 0, 0, 0) },
                    { 2, new DateTime(2025, 1, 17, 0, 0, 0, 0, DateTimeKind.Local), "Initial meeting to discuss project goals, scope, and timelines.", new TimeSpan(0, 15, 30, 0, 0), "Project Kickoff", new TimeSpan(0, 14, 0, 0, 0) }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Email", "PasswordHash", "Username" },
                values: new object[,]
                {
                    { 1, "johndoe@example.com", "hashedpassword123", "JohnDoe" },
                    { 2, "janesmith@example.com", "hashedpassword456", "JaneSmith" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Meetings");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
