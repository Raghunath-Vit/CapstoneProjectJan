using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MeetingApp.Migrations
{
    /// <inheritdoc />
    public partial class Meetingwork : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Attendees",
                table: "Meetings",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Meetings",
                keyColumn: "Id",
                keyValue: 1,
                column: "Attendees",
                value: "[]");

            migrationBuilder.UpdateData(
                table: "Meetings",
                keyColumn: "Id",
                keyValue: 2,
                column: "Attendees",
                value: "[]");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Attendees",
                table: "Meetings");
        }
    }
}
