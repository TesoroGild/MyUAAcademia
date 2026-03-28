using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyUAAcademiaB.Migrations
{
    /// <inheritdoc />
    public partial class EndDateContractNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateOnly>(
                name: "RealEndDate",
                table: "EmployeesContracts",
                type: "date",
                nullable: true,
                oldClrType: typeof(DateOnly),
                oldType: "date");

            migrationBuilder.CreateIndex(
                name: "IX_EmployeesContracts_EmpCode",
                table: "EmployeesContracts",
                column: "EmpCode",
                unique: true,
                filter: "[IsContractOver] = 0");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_EmployeesContracts_EmpCode",
                table: "EmployeesContracts");

            migrationBuilder.AlterColumn<DateOnly>(
                name: "RealEndDate",
                table: "EmployeesContracts",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1),
                oldClrType: typeof(DateOnly),
                oldType: "date",
                oldNullable: true);
        }
    }
}
