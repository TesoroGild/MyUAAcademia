using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyUAAcademiaB.Migrations
{
    /// <inheritdoc />
    public partial class AddTaughtByToClassesCourses : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TaughtBy",
                table: "ClassesCourses",
                type: "nvarchar(450)",
                nullable: true,
                collation: "SQL_Latin1_General_CP1_CS_AS");

            migrationBuilder.CreateIndex(
                name: "IX_ClassesCourses_TaughtBy_StartTime_Jours_SessionCourse_YearCourse",
                table: "ClassesCourses",
                columns: new[] { "TaughtBy", "StartTime", "Jours", "SessionCourse", "YearCourse" },
                unique: true,
                filter: "[TaughtBy] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_ClassesCourses_Employees_TaughtBy",
                table: "ClassesCourses",
                column: "TaughtBy",
                principalTable: "Employees",
                principalColumn: "Code",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ClassesCourses_Employees_TaughtBy",
                table: "ClassesCourses");

            migrationBuilder.DropIndex(
                name: "IX_ClassesCourses_TaughtBy_StartTime_Jours_SessionCourse_YearCourse",
                table: "ClassesCourses");

            migrationBuilder.DropColumn(
                name: "TaughtBy",
                table: "ClassesCourses");
        }
    }
}
