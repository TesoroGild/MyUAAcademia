using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyUAAcademiaB.Migrations.Postgres
{
    /// <inheritdoc />
    public partial class InitialCreatePostgres : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Contracts",
                columns: table => new
                {
                    Code = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Availability = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BaseSalary = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Department = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EndingDate = table.Column<DateOnly>(type: "date", nullable: true),
                    Faculty = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    JobTitle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MaximumWage = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MinimumWage = table.Column<int>(type: "int", nullable: false),
                    NumberOfHours = table.Column<int>(type: "int", nullable: false),
                    StartingDate = table.Column<DateOnly>(type: "date", nullable: false),
                    TypeOfEmployment = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TypeOfOffer = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    WorkShift = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Contracts", x => x.Code);
                });

            migrationBuilder.CreateTable(
                name: "Employees",
                columns: table => new
                {
                    Code = table.Column<string>(type: "nvarchar(450)", nullable: false, collation: "SQL_Latin1_General_CP1_CS_AS"),
                    EmpStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedByCode = table.Column<string>(type: "nvarchar(450)", nullable: true, collation: "SQL_Latin1_General_CP1_CS_AS"),
                    BirthDay = table.Column<DateOnly>(type: "date", nullable: false),
                    UserStatus = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsActivated = table.Column<int>(type: "int", nullable: false),
                    IsValidated = table.Column<bool>(type: "bit", nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Nas = table.Column<int>(type: "int", nullable: true),
                    Nationality = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PersonalEmail = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProfessionalEmail = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Pwd = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Sexe = table.Column<string>(type: "nvarchar(1)", nullable: false),
                    StreetAddress = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserRole = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employees", x => x.Code);
                    table.ForeignKey(
                        name: "FK_Employees_Employees_CreatedByCode",
                        column: x => x.CreatedByCode,
                        principalTable: "Employees",
                        principalColumn: "Code");
                });

            migrationBuilder.CreateTable(
                name: "StudentFiles",
                columns: table => new
                {
                    FileCode = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    StudentCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FileName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ContentType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FileType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UploadedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentFiles", x => x.FileCode);
                });

            migrationBuilder.CreateTable(
                name: "Classes",
                columns: table => new
                {
                    ClasseName = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Capacity = table.Column<int>(type: "int", nullable: true),
                    TypeOfClasse = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EmployeeCode = table.Column<string>(type: "nvarchar(450)", nullable: false, collation: "SQL_Latin1_General_CP1_CS_AS")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Classes", x => x.ClasseName);
                    table.ForeignKey(
                        name: "FK_Classes_Employees_EmployeeCode",
                        column: x => x.EmployeeCode,
                        principalTable: "Employees",
                        principalColumn: "Code",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EmployeesContracts",
                columns: table => new
                {
                    EmpCode = table.Column<string>(type: "nvarchar(450)", nullable: false, collation: "SQL_Latin1_General_CP1_CS_AS"),
                    ContractCode = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    RealStartingDate = table.Column<DateOnly>(type: "date", nullable: false),
                    RealEndDate = table.Column<DateOnly>(type: "date", nullable: true),
                    IsContractOver = table.Column<bool>(type: "bit", nullable: false),
                    RealSalary = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmployeesContracts", x => new { x.EmpCode, x.ContractCode });
                    table.ForeignKey(
                        name: "FK_EmployeesContracts_Contracts_ContractCode",
                        column: x => x.ContractCode,
                        principalTable: "Contracts",
                        principalColumn: "Code",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EmployeesContracts_Employees_EmpCode",
                        column: x => x.EmpCode,
                        principalTable: "Employees",
                        principalColumn: "Code",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Programs",
                columns: table => new
                {
                    Title = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProgramName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Descriptions = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Grade = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Department = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Faculty = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EmployeeCode = table.Column<string>(type: "nvarchar(450)", nullable: false, collation: "SQL_Latin1_General_CP1_CS_AS")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Programs", x => x.Title);
                    table.ForeignKey(
                        name: "FK_Programs_Employees_EmployeeCode",
                        column: x => x.EmployeeCode,
                        principalTable: "Employees",
                        principalColumn: "Code",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    PermanentCode = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    EmployeeCode = table.Column<string>(type: "nvarchar(450)", nullable: true, collation: "SQL_Latin1_General_CP1_CS_AS"),
                    BirthDay = table.Column<DateOnly>(type: "date", nullable: false),
                    UserStatus = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsActivated = table.Column<int>(type: "int", nullable: false),
                    IsValidated = table.Column<bool>(type: "bit", nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Nas = table.Column<int>(type: "int", nullable: true),
                    Nationality = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PersonalEmail = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProfessionalEmail = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Pwd = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Sexe = table.Column<string>(type: "nvarchar(1)", nullable: false),
                    StreetAddress = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserRole = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.PermanentCode);
                    table.ForeignKey(
                        name: "FK_Users_Employees_EmployeeCode",
                        column: x => x.EmployeeCode,
                        principalTable: "Employees",
                        principalColumn: "Code");
                });

            migrationBuilder.CreateTable(
                name: "Courses",
                columns: table => new
                {
                    Sigle = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Credits = table.Column<int>(type: "int", nullable: false),
                    Price = table.Column<double>(type: "float", nullable: false),
                    Summer = table.Column<int>(type: "int", nullable: true),
                    Autumn = table.Column<int>(type: "int", nullable: true),
                    Winter = table.Column<int>(type: "int", nullable: true),
                    EmployeeCode = table.Column<string>(type: "nvarchar(450)", nullable: false, collation: "SQL_Latin1_General_CP1_CS_AS"),
                    ProgramTitle = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Courses", x => x.Sigle);
                    table.ForeignKey(
                        name: "FK_Courses_Employees_EmployeeCode",
                        column: x => x.EmployeeCode,
                        principalTable: "Employees",
                        principalColumn: "Code",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Courses_Programs_ProgramTitle",
                        column: x => x.ProgramTitle,
                        principalTable: "Programs",
                        principalColumn: "Title",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Bills",
                columns: table => new
                {
                    SessionStudy = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    YearStudy = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    PermanentCode = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    DateOfIssue = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DeadLine = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateOfPaiement = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Amount = table.Column<double>(type: "float", nullable: true),
                    AmountPaid = table.Column<double>(type: "float", nullable: true),
                    GeneralExpenses = table.Column<double>(type: "float", nullable: true),
                    SportsAdministrationFees = table.Column<double>(type: "float", nullable: true),
                    DentalInsurance = table.Column<double>(type: "float", nullable: true),
                    InsuranceFees = table.Column<double>(type: "float", nullable: true),
                    RefundsAndAdjustments = table.Column<double>(type: "float", nullable: true),
                    ProgramTitle = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bills", x => new { x.SessionStudy, x.YearStudy, x.PermanentCode });
                    table.ForeignKey(
                        name: "FK_Bills_Programs_ProgramTitle",
                        column: x => x.ProgramTitle,
                        principalTable: "Programs",
                        principalColumn: "Title",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Bills_Users_PermanentCode",
                        column: x => x.PermanentCode,
                        principalTable: "Users",
                        principalColumn: "PermanentCode",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UserProgramEnrollments",
                columns: table => new
                {
                    PermanentCode = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    EnrollmentDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    EndDateEstimate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    RealEndDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsEnrolled = table.Column<bool>(type: "bit", nullable: false),
                    HasFinished = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserProgramEnrollments", x => new { x.PermanentCode, x.Title });
                    table.ForeignKey(
                        name: "FK_UserProgramEnrollments_Programs_Title",
                        column: x => x.Title,
                        principalTable: "Programs",
                        principalColumn: "Title",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserProgramEnrollments_Users_PermanentCode",
                        column: x => x.PermanentCode,
                        principalTable: "Users",
                        principalColumn: "PermanentCode",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Bulletins",
                columns: table => new
                {
                    PermanentCode = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Sigle = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Grade = table.Column<double>(type: "float", nullable: true),
                    Mention = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bulletins", x => new { x.Sigle, x.PermanentCode });
                    table.ForeignKey(
                        name: "FK_Bulletins_Courses_Sigle",
                        column: x => x.Sigle,
                        principalTable: "Courses",
                        principalColumn: "Sigle",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Bulletins_Users_PermanentCode",
                        column: x => x.PermanentCode,
                        principalTable: "Users",
                        principalColumn: "PermanentCode",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ClassesCourses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ClasseName = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CourseSigle = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Jours = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    StartTime = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    EndTime = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SessionCourse = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    YearCourse = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    EmployeeCode = table.Column<string>(type: "nvarchar(450)", nullable: false, collation: "SQL_Latin1_General_CP1_CS_AS"),
                    TaughtBy = table.Column<string>(type: "nvarchar(450)", nullable: true, collation: "SQL_Latin1_General_CP1_CS_AS")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClassesCourses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ClassesCourses_Classes_ClasseName",
                        column: x => x.ClasseName,
                        principalTable: "Classes",
                        principalColumn: "ClasseName",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ClassesCourses_Courses_CourseSigle",
                        column: x => x.CourseSigle,
                        principalTable: "Courses",
                        principalColumn: "Sigle",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ClassesCourses_Employees_EmployeeCode",
                        column: x => x.EmployeeCode,
                        principalTable: "Employees",
                        principalColumn: "Code",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ClassesCourses_Employees_TaughtBy",
                        column: x => x.TaughtBy,
                        principalTable: "Employees",
                        principalColumn: "Code",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UserCourses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CCourseId = table.Column<int>(type: "int", nullable: false),
                    PermanentCode = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserCourses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserCourses_ClassesCourses_CCourseId",
                        column: x => x.CCourseId,
                        principalTable: "ClassesCourses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserCourses_Users_PermanentCode",
                        column: x => x.PermanentCode,
                        principalTable: "Users",
                        principalColumn: "PermanentCode",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Bills_PermanentCode",
                table: "Bills",
                column: "PermanentCode");

            migrationBuilder.CreateIndex(
                name: "IX_Bills_ProgramTitle",
                table: "Bills",
                column: "ProgramTitle");

            migrationBuilder.CreateIndex(
                name: "IX_Bulletins_PermanentCode",
                table: "Bulletins",
                column: "PermanentCode");

            migrationBuilder.CreateIndex(
                name: "IX_Classes_EmployeeCode",
                table: "Classes",
                column: "EmployeeCode");

            migrationBuilder.CreateIndex(
                name: "IX_ClassesCourses_ClasseName_StartTime_Jours_SessionCourse_YearCourse",
                table: "ClassesCourses",
                columns: new[] { "ClasseName", "StartTime", "Jours", "SessionCourse", "YearCourse" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ClassesCourses_CourseSigle",
                table: "ClassesCourses",
                column: "CourseSigle");

            migrationBuilder.CreateIndex(
                name: "IX_ClassesCourses_EmployeeCode",
                table: "ClassesCourses",
                column: "EmployeeCode");

            migrationBuilder.CreateIndex(
                name: "IX_ClassesCourses_TaughtBy_StartTime_Jours_SessionCourse_YearCourse",
                table: "ClassesCourses",
                columns: new[] { "TaughtBy", "StartTime", "Jours", "SessionCourse", "YearCourse" },
                unique: true,
                filter: "[TaughtBy] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Courses_EmployeeCode",
                table: "Courses",
                column: "EmployeeCode");

            migrationBuilder.CreateIndex(
                name: "IX_Courses_ProgramTitle",
                table: "Courses",
                column: "ProgramTitle");

            migrationBuilder.CreateIndex(
                name: "IX_Employees_CreatedByCode",
                table: "Employees",
                column: "CreatedByCode");

            migrationBuilder.CreateIndex(
                name: "IX_EmployeesContracts_ContractCode",
                table: "EmployeesContracts",
                column: "ContractCode");

            migrationBuilder.CreateIndex(
                name: "IX_EmployeesContracts_EmpCode",
                table: "EmployeesContracts",
                column: "EmpCode",
                unique: true,
                filter: "[IsContractOver] = 0");

            migrationBuilder.CreateIndex(
                name: "IX_Programs_EmployeeCode",
                table: "Programs",
                column: "EmployeeCode");

            migrationBuilder.CreateIndex(
                name: "IX_UserCourses_CCourseId",
                table: "UserCourses",
                column: "CCourseId");

            migrationBuilder.CreateIndex(
                name: "IX_UserCourses_PermanentCode",
                table: "UserCourses",
                column: "PermanentCode");

            migrationBuilder.CreateIndex(
                name: "IX_UserProgramEnrollments_Title",
                table: "UserProgramEnrollments",
                column: "Title");

            migrationBuilder.CreateIndex(
                name: "IX_Users_EmployeeCode",
                table: "Users",
                column: "EmployeeCode");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Bills");

            migrationBuilder.DropTable(
                name: "Bulletins");

            migrationBuilder.DropTable(
                name: "EmployeesContracts");

            migrationBuilder.DropTable(
                name: "StudentFiles");

            migrationBuilder.DropTable(
                name: "UserCourses");

            migrationBuilder.DropTable(
                name: "UserProgramEnrollments");

            migrationBuilder.DropTable(
                name: "Contracts");

            migrationBuilder.DropTable(
                name: "ClassesCourses");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Classes");

            migrationBuilder.DropTable(
                name: "Courses");

            migrationBuilder.DropTable(
                name: "Programs");

            migrationBuilder.DropTable(
                name: "Employees");
        }
    }
}
