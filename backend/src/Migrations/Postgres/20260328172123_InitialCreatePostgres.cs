using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

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
                name: "contracts",
                columns: table => new
                {
                    code = table.Column<string>(type: "text", nullable: false),
                    availability = table.Column<string>(type: "text", nullable: false),
                    base_salary = table.Column<string>(type: "text", nullable: false),
                    department = table.Column<string>(type: "text", nullable: false),
                    description = table.Column<string>(type: "text", nullable: false),
                    ending_date = table.Column<DateOnly>(type: "date", nullable: true),
                    faculty = table.Column<string>(type: "text", nullable: false),
                    job_title = table.Column<string>(type: "text", nullable: false),
                    maximum_wage = table.Column<string>(type: "text", nullable: false),
                    minimum_wage = table.Column<int>(type: "integer", nullable: false),
                    number_of_hours = table.Column<int>(type: "integer", nullable: false),
                    starting_date = table.Column<DateOnly>(type: "date", nullable: false),
                    type_of_employment = table.Column<string>(type: "text", nullable: false),
                    type_of_offer = table.Column<string>(type: "text", nullable: false),
                    work_shift = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_contracts", x => x.code);
                });

            migrationBuilder.CreateTable(
                name: "employees",
                columns: table => new
                {
                    code = table.Column<string>(type: "text", nullable: false, collation: "SQL_Latin1_General_CP1_CS_AS"),
                    emp_status = table.Column<string>(type: "text", nullable: false),
                    created_by_code = table.Column<string>(type: "text", nullable: true, collation: "SQL_Latin1_General_CP1_CS_AS"),
                    birth_day = table.Column<DateOnly>(type: "date", nullable: false),
                    user_status = table.Column<string>(type: "text", nullable: true),
                    first_name = table.Column<string>(type: "text", nullable: false),
                    is_activated = table.Column<int>(type: "integer", nullable: false),
                    is_validated = table.Column<bool>(type: "boolean", nullable: false),
                    last_name = table.Column<string>(type: "text", nullable: false),
                    nas = table.Column<int>(type: "integer", nullable: true),
                    nationality = table.Column<string>(type: "text", nullable: false),
                    personal_email = table.Column<string>(type: "text", nullable: false),
                    phone_number = table.Column<string>(type: "text", nullable: false),
                    professional_email = table.Column<string>(type: "text", nullable: false),
                    pwd = table.Column<string>(type: "text", nullable: false),
                    sexe = table.Column<char>(type: "character(1)", nullable: false),
                    street_address = table.Column<string>(type: "text", nullable: false),
                    user_role = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_employees", x => x.code);
                    table.ForeignKey(
                        name: "fk_employees_employees_created_by_code",
                        column: x => x.created_by_code,
                        principalTable: "employees",
                        principalColumn: "code");
                });

            migrationBuilder.CreateTable(
                name: "student_files",
                columns: table => new
                {
                    file_code = table.Column<string>(type: "text", nullable: false),
                    student_code = table.Column<string>(type: "text", nullable: false),
                    file_name = table.Column<string>(type: "text", nullable: false),
                    content_type = table.Column<string>(type: "text", nullable: false),
                    file_type = table.Column<string>(type: "text", nullable: false),
                    uploaded_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_student_files", x => x.file_code);
                });

            migrationBuilder.CreateTable(
                name: "classes",
                columns: table => new
                {
                    classe_name = table.Column<string>(type: "text", nullable: false),
                    capacity = table.Column<int>(type: "integer", nullable: true),
                    type_of_classe = table.Column<string>(type: "text", nullable: false),
                    employee_code = table.Column<string>(type: "text", nullable: false, collation: "SQL_Latin1_General_CP1_CS_AS")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_classes", x => x.classe_name);
                    table.ForeignKey(
                        name: "fk_classes_employees_employee_code",
                        column: x => x.employee_code,
                        principalTable: "employees",
                        principalColumn: "code",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "employees_contracts",
                columns: table => new
                {
                    emp_code = table.Column<string>(type: "text", nullable: false, collation: "SQL_Latin1_General_CP1_CS_AS"),
                    contract_code = table.Column<string>(type: "text", nullable: false),
                    real_starting_date = table.Column<DateOnly>(type: "date", nullable: false),
                    real_end_date = table.Column<DateOnly>(type: "date", nullable: true),
                    is_contract_over = table.Column<bool>(type: "boolean", nullable: false),
                    real_salary = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_employees_contracts", x => new { x.emp_code, x.contract_code });
                    table.ForeignKey(
                        name: "fk_employees_contracts_contracts_contract_code",
                        column: x => x.contract_code,
                        principalTable: "contracts",
                        principalColumn: "code",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_employees_contracts_employees_emp_code",
                        column: x => x.emp_code,
                        principalTable: "employees",
                        principalColumn: "code",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "programs",
                columns: table => new
                {
                    title = table.Column<string>(type: "text", nullable: false),
                    program_name = table.Column<string>(type: "text", nullable: false),
                    descriptions = table.Column<string>(type: "text", nullable: false),
                    grade = table.Column<string>(type: "text", nullable: false),
                    department = table.Column<string>(type: "text", nullable: false),
                    faculty = table.Column<string>(type: "text", nullable: false),
                    employee_code = table.Column<string>(type: "text", nullable: false, collation: "SQL_Latin1_General_CP1_CS_AS")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_programs", x => x.title);
                    table.ForeignKey(
                        name: "fk_programs_employees_employee_code",
                        column: x => x.employee_code,
                        principalTable: "employees",
                        principalColumn: "code",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    permanent_code = table.Column<string>(type: "text", nullable: false),
                    employee_code = table.Column<string>(type: "text", nullable: true, collation: "SQL_Latin1_General_CP1_CS_AS"),
                    birth_day = table.Column<DateOnly>(type: "date", nullable: false),
                    user_status = table.Column<string>(type: "text", nullable: true),
                    first_name = table.Column<string>(type: "text", nullable: false),
                    is_activated = table.Column<int>(type: "integer", nullable: false),
                    is_validated = table.Column<bool>(type: "boolean", nullable: false),
                    last_name = table.Column<string>(type: "text", nullable: false),
                    nas = table.Column<int>(type: "integer", nullable: true),
                    nationality = table.Column<string>(type: "text", nullable: false),
                    personal_email = table.Column<string>(type: "text", nullable: false),
                    phone_number = table.Column<string>(type: "text", nullable: false),
                    professional_email = table.Column<string>(type: "text", nullable: false),
                    pwd = table.Column<string>(type: "text", nullable: false),
                    sexe = table.Column<char>(type: "character(1)", nullable: false),
                    street_address = table.Column<string>(type: "text", nullable: false),
                    user_role = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_users", x => x.permanent_code);
                    table.ForeignKey(
                        name: "fk_users_employees_employee_code",
                        column: x => x.employee_code,
                        principalTable: "employees",
                        principalColumn: "code");
                });

            migrationBuilder.CreateTable(
                name: "courses",
                columns: table => new
                {
                    sigle = table.Column<string>(type: "text", nullable: false),
                    full_name = table.Column<string>(type: "text", nullable: false),
                    credits = table.Column<int>(type: "integer", nullable: false),
                    price = table.Column<double>(type: "double precision", nullable: false),
                    summer = table.Column<int>(type: "integer", nullable: true),
                    autumn = table.Column<int>(type: "integer", nullable: true),
                    winter = table.Column<int>(type: "integer", nullable: true),
                    employee_code = table.Column<string>(type: "text", nullable: false, collation: "SQL_Latin1_General_CP1_CS_AS"),
                    program_title = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_courses", x => x.sigle);
                    table.ForeignKey(
                        name: "fk_courses_employees_employee_code",
                        column: x => x.employee_code,
                        principalTable: "employees",
                        principalColumn: "code",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_courses_programs_program_title",
                        column: x => x.program_title,
                        principalTable: "programs",
                        principalColumn: "title",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "bills",
                columns: table => new
                {
                    session_study = table.Column<string>(type: "text", nullable: false),
                    year_study = table.Column<string>(type: "text", nullable: false),
                    permanent_code = table.Column<string>(type: "text", nullable: false),
                    date_of_issue = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    dead_line = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    date_of_paiement = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    amount = table.Column<double>(type: "double precision", nullable: true),
                    amount_paid = table.Column<double>(type: "double precision", nullable: true),
                    general_expenses = table.Column<double>(type: "double precision", nullable: true),
                    sports_administration_fees = table.Column<double>(type: "double precision", nullable: true),
                    dental_insurance = table.Column<double>(type: "double precision", nullable: true),
                    insurance_fees = table.Column<double>(type: "double precision", nullable: true),
                    refunds_and_adjustments = table.Column<double>(type: "double precision", nullable: true),
                    program_title = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_bills", x => new { x.session_study, x.year_study, x.permanent_code });
                    table.ForeignKey(
                        name: "fk_bills_programs_program_title",
                        column: x => x.program_title,
                        principalTable: "programs",
                        principalColumn: "title",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_bills_users_permanent_code",
                        column: x => x.permanent_code,
                        principalTable: "users",
                        principalColumn: "permanent_code",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "user_program_enrollments",
                columns: table => new
                {
                    permanent_code = table.Column<string>(type: "text", nullable: false),
                    title = table.Column<string>(type: "text", nullable: false),
                    enrollment_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    end_date_estimate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    real_end_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    is_enrolled = table.Column<bool>(type: "boolean", nullable: false),
                    has_finished = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_user_program_enrollments", x => new { x.permanent_code, x.title });
                    table.ForeignKey(
                        name: "fk_user_program_enrollments_programs_title",
                        column: x => x.title,
                        principalTable: "programs",
                        principalColumn: "title",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_user_program_enrollments_users_permanent_code",
                        column: x => x.permanent_code,
                        principalTable: "users",
                        principalColumn: "permanent_code",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "bulletins",
                columns: table => new
                {
                    permanent_code = table.Column<string>(type: "text", nullable: false),
                    sigle = table.Column<string>(type: "text", nullable: false),
                    grade = table.Column<double>(type: "double precision", nullable: true),
                    mention = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_bulletins", x => new { x.sigle, x.permanent_code });
                    table.ForeignKey(
                        name: "fk_bulletins_courses_sigle",
                        column: x => x.sigle,
                        principalTable: "courses",
                        principalColumn: "sigle",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_bulletins_users_permanent_code",
                        column: x => x.permanent_code,
                        principalTable: "users",
                        principalColumn: "permanent_code",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "classes_courses",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    classe_name = table.Column<string>(type: "text", nullable: false),
                    course_sigle = table.Column<string>(type: "text", nullable: false),
                    jours = table.Column<string>(type: "text", nullable: false),
                    start_time = table.Column<string>(type: "text", nullable: false),
                    end_time = table.Column<string>(type: "text", nullable: false),
                    session_course = table.Column<string>(type: "text", nullable: false),
                    year_course = table.Column<string>(type: "text", nullable: false),
                    employee_code = table.Column<string>(type: "text", nullable: false, collation: "SQL_Latin1_General_CP1_CS_AS"),
                    taught_by = table.Column<string>(type: "text", nullable: true, collation: "SQL_Latin1_General_CP1_CS_AS")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_classes_courses", x => x.id);
                    table.ForeignKey(
                        name: "fk_classes_courses_classes_classe_name",
                        column: x => x.classe_name,
                        principalTable: "classes",
                        principalColumn: "classe_name",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_classes_courses_courses_course_sigle",
                        column: x => x.course_sigle,
                        principalTable: "courses",
                        principalColumn: "sigle",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_classes_courses_employees_employee_code",
                        column: x => x.employee_code,
                        principalTable: "employees",
                        principalColumn: "code",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_classes_courses_employees_taught_by",
                        column: x => x.taught_by,
                        principalTable: "employees",
                        principalColumn: "code",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "user_courses",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    c_course_id = table.Column<int>(type: "integer", nullable: false),
                    permanent_code = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_user_courses", x => x.id);
                    table.ForeignKey(
                        name: "fk_user_courses_classes_courses_c_course_id",
                        column: x => x.c_course_id,
                        principalTable: "classes_courses",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_user_courses_users_permanent_code",
                        column: x => x.permanent_code,
                        principalTable: "users",
                        principalColumn: "permanent_code",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_bills_permanent_code",
                table: "bills",
                column: "permanent_code");

            migrationBuilder.CreateIndex(
                name: "ix_bills_program_title",
                table: "bills",
                column: "program_title");

            migrationBuilder.CreateIndex(
                name: "ix_bulletins_permanent_code",
                table: "bulletins",
                column: "permanent_code");

            migrationBuilder.CreateIndex(
                name: "ix_classes_employee_code",
                table: "classes",
                column: "employee_code");

            migrationBuilder.CreateIndex(
                name: "ix_classes_courses_classe_name_start_time_jours_session_course",
                table: "classes_courses",
                columns: new[] { "classe_name", "start_time", "jours", "session_course", "year_course" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_classes_courses_course_sigle",
                table: "classes_courses",
                column: "course_sigle");

            migrationBuilder.CreateIndex(
                name: "ix_classes_courses_employee_code",
                table: "classes_courses",
                column: "employee_code");

            migrationBuilder.CreateIndex(
                name: "ix_classes_courses_taught_by_start_time_jours_session_course_y",
                table: "classes_courses",
                columns: new[] { "taught_by", "start_time", "jours", "session_course", "year_course" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_courses_employee_code",
                table: "courses",
                column: "employee_code");

            migrationBuilder.CreateIndex(
                name: "ix_courses_program_title",
                table: "courses",
                column: "program_title");

            migrationBuilder.CreateIndex(
                name: "ix_employees_created_by_code",
                table: "employees",
                column: "created_by_code");

            migrationBuilder.CreateIndex(
                name: "ix_employees_contracts_contract_code",
                table: "employees_contracts",
                column: "contract_code");

            migrationBuilder.CreateIndex(
                name: "ix_employees_contracts_emp_code",
                table: "employees_contracts",
                column: "emp_code",
                unique: true,
                filter: "[IsContractOver] = 0");

            migrationBuilder.CreateIndex(
                name: "ix_programs_employee_code",
                table: "programs",
                column: "employee_code");

            migrationBuilder.CreateIndex(
                name: "ix_user_courses_c_course_id",
                table: "user_courses",
                column: "c_course_id");

            migrationBuilder.CreateIndex(
                name: "ix_user_courses_permanent_code",
                table: "user_courses",
                column: "permanent_code");

            migrationBuilder.CreateIndex(
                name: "ix_user_program_enrollments_title",
                table: "user_program_enrollments",
                column: "title");

            migrationBuilder.CreateIndex(
                name: "ix_users_employee_code",
                table: "users",
                column: "employee_code");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "bills");

            migrationBuilder.DropTable(
                name: "bulletins");

            migrationBuilder.DropTable(
                name: "employees_contracts");

            migrationBuilder.DropTable(
                name: "student_files");

            migrationBuilder.DropTable(
                name: "user_courses");

            migrationBuilder.DropTable(
                name: "user_program_enrollments");

            migrationBuilder.DropTable(
                name: "contracts");

            migrationBuilder.DropTable(
                name: "classes_courses");

            migrationBuilder.DropTable(
                name: "users");

            migrationBuilder.DropTable(
                name: "classes");

            migrationBuilder.DropTable(
                name: "courses");

            migrationBuilder.DropTable(
                name: "programs");

            migrationBuilder.DropTable(
                name: "employees");
        }
    }
}
