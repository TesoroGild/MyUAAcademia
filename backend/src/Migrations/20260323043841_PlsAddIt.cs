using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyUAAcademiaB.Migrations
{
    /// <inheritdoc />
    public partial class PlsAddIt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProgramTitle",
                table: "Bills",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Bills_ProgramTitle",
                table: "Bills",
                column: "ProgramTitle");

            migrationBuilder.AddForeignKey(
                name: "FK_Bills_Programs_ProgramTitle",
                table: "Bills",
                column: "ProgramTitle",
                principalTable: "Programs",
                principalColumn: "Title",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bills_Programs_ProgramTitle",
                table: "Bills");

            migrationBuilder.DropIndex(
                name: "IX_Bills_ProgramTitle",
                table: "Bills");

            migrationBuilder.DropColumn(
                name: "ProgramTitle",
                table: "Bills");
        }
    }
}
