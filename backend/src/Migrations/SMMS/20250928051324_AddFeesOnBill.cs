using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyUAAcademiaB.Migrations
{
    /// <inheritdoc />
    public partial class AddFeesOnBill : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "DentalInsurance",
                table: "Bills",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "GeneralExpenses",
                table: "Bills",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "InsuranceFees",
                table: "Bills",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "RefundsAndAdjustments",
                table: "Bills",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "SportsAdministrationFees",
                table: "Bills",
                type: "float",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DentalInsurance",
                table: "Bills");

            migrationBuilder.DropColumn(
                name: "GeneralExpenses",
                table: "Bills");

            migrationBuilder.DropColumn(
                name: "InsuranceFees",
                table: "Bills");

            migrationBuilder.DropColumn(
                name: "RefundsAndAdjustments",
                table: "Bills");

            migrationBuilder.DropColumn(
                name: "SportsAdministrationFees",
                table: "Bills");
        }
    }
}
