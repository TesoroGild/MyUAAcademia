using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyUAAcademiaB.Migrations
{
    /// <inheritdoc />
    public partial class programfinishedcolumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "HasFinished",
                table: "UserProgramEnrollments",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HasFinished",
                table: "UserProgramEnrollments");
        }
    }
}
