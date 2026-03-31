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
            migrationBuilder.EnsureSchema(
                name: "myuaacademia");

            migrationBuilder.CreateTable(
                name: "contracts",
                schema: "myuaacademia",
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
                schema: "myuaacademia",
                columns: table => new
                {
                    code = table.Column<string>(type: "text", nullable: false),
                    emp_status = table.Column<string>(type: "text", nullable: false),
                    created_by_code = table.Column<string>(type: "text", nullable: true),
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
                        principalSchema: "myuaacademia",
                        principalTable: "employees",
                        principalColumn: "code");
                });

            migrationBuilder.CreateTable(
                name: "student_files",
                schema: "myuaacademia",
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
                schema: "myuaacademia",
                columns: table => new
                {
                    classe_name = table.Column<string>(type: "text", nullable: false),
                    capacity = table.Column<int>(type: "integer", nullable: true),
                    type_of_classe = table.Column<string>(type: "text", nullable: false),
                    employee_code = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_classes", x => x.classe_name);
                    table.ForeignKey(
                        name: "fk_classes_employees_employee_code",
                        column: x => x.employee_code,
                        principalSchema: "myuaacademia",
                        principalTable: "employees",
                        principalColumn: "code",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "employees_contracts",
                schema: "myuaacademia",
                columns: table => new
                {
                    emp_code = table.Column<string>(type: "text", nullable: false),
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
                        principalSchema: "myuaacademia",
                        principalTable: "contracts",
                        principalColumn: "code",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_employees_contracts_employees_emp_code",
                        column: x => x.emp_code,
                        principalSchema: "myuaacademia",
                        principalTable: "employees",
                        principalColumn: "code",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "programs",
                schema: "myuaacademia",
                columns: table => new
                {
                    title = table.Column<string>(type: "text", nullable: false),
                    program_name = table.Column<string>(type: "text", nullable: false),
                    descriptions = table.Column<string>(type: "text", nullable: false),
                    grade = table.Column<string>(type: "text", nullable: false),
                    department = table.Column<string>(type: "text", nullable: false),
                    faculty = table.Column<string>(type: "text", nullable: false),
                    employee_code = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_programs", x => x.title);
                    table.ForeignKey(
                        name: "fk_programs_employees_employee_code",
                        column: x => x.employee_code,
                        principalSchema: "myuaacademia",
                        principalTable: "employees",
                        principalColumn: "code",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "users",
                schema: "myuaacademia",
                columns: table => new
                {
                    permanent_code = table.Column<string>(type: "text", nullable: false),
                    employee_code = table.Column<string>(type: "text", nullable: true),
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
                        principalSchema: "myuaacademia",
                        principalTable: "employees",
                        principalColumn: "code");
                });

            migrationBuilder.CreateTable(
                name: "courses",
                schema: "myuaacademia",
                columns: table => new
                {
                    sigle = table.Column<string>(type: "text", nullable: false),
                    full_name = table.Column<string>(type: "text", nullable: false),
                    credits = table.Column<int>(type: "integer", nullable: false),
                    price = table.Column<double>(type: "double precision", nullable: false),
                    summer = table.Column<int>(type: "integer", nullable: true),
                    autumn = table.Column<int>(type: "integer", nullable: true),
                    winter = table.Column<int>(type: "integer", nullable: true),
                    employee_code = table.Column<string>(type: "text", nullable: false),
                    program_title = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_courses", x => x.sigle);
                    table.ForeignKey(
                        name: "fk_courses_employees_employee_code",
                        column: x => x.employee_code,
                        principalSchema: "myuaacademia",
                        principalTable: "employees",
                        principalColumn: "code",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_courses_programs_program_title",
                        column: x => x.program_title,
                        principalSchema: "myuaacademia",
                        principalTable: "programs",
                        principalColumn: "title",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "bills",
                schema: "myuaacademia",
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
                        principalSchema: "myuaacademia",
                        principalTable: "programs",
                        principalColumn: "title",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_bills_users_permanent_code",
                        column: x => x.permanent_code,
                        principalSchema: "myuaacademia",
                        principalTable: "users",
                        principalColumn: "permanent_code",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "user_program_enrollments",
                schema: "myuaacademia",
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
                        principalSchema: "myuaacademia",
                        principalTable: "programs",
                        principalColumn: "title",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_user_program_enrollments_users_permanent_code",
                        column: x => x.permanent_code,
                        principalSchema: "myuaacademia",
                        principalTable: "users",
                        principalColumn: "permanent_code",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "bulletins",
                schema: "myuaacademia",
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
                        principalSchema: "myuaacademia",
                        principalTable: "courses",
                        principalColumn: "sigle",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_bulletins_users_permanent_code",
                        column: x => x.permanent_code,
                        principalSchema: "myuaacademia",
                        principalTable: "users",
                        principalColumn: "permanent_code",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "classes_courses",
                schema: "myuaacademia",
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
                    employee_code = table.Column<string>(type: "text", nullable: false),
                    taught_by = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_classes_courses", x => x.id);
                    table.ForeignKey(
                        name: "fk_classes_courses_classes_classe_name",
                        column: x => x.classe_name,
                        principalSchema: "myuaacademia",
                        principalTable: "classes",
                        principalColumn: "classe_name",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_classes_courses_courses_course_sigle",
                        column: x => x.course_sigle,
                        principalSchema: "myuaacademia",
                        principalTable: "courses",
                        principalColumn: "sigle",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_classes_courses_employees_employee_code",
                        column: x => x.employee_code,
                        principalSchema: "myuaacademia",
                        principalTable: "employees",
                        principalColumn: "code",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_classes_courses_employees_taught_by",
                        column: x => x.taught_by,
                        principalSchema: "myuaacademia",
                        principalTable: "employees",
                        principalColumn: "code",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "user_courses",
                schema: "myuaacademia",
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
                        principalSchema: "myuaacademia",
                        principalTable: "classes_courses",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_user_courses_users_permanent_code",
                        column: x => x.permanent_code,
                        principalSchema: "myuaacademia",
                        principalTable: "users",
                        principalColumn: "permanent_code",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_bills_permanent_code",
                schema: "myuaacademia",
                table: "bills",
                column: "permanent_code");

            migrationBuilder.CreateIndex(
                name: "ix_bills_program_title",
                schema: "myuaacademia",
                table: "bills",
                column: "program_title");

            migrationBuilder.CreateIndex(
                name: "ix_bulletins_permanent_code",
                schema: "myuaacademia",
                table: "bulletins",
                column: "permanent_code");

            migrationBuilder.CreateIndex(
                name: "ix_classes_employee_code",
                schema: "myuaacademia",
                table: "classes",
                column: "employee_code");

            migrationBuilder.CreateIndex(
                name: "ix_classes_courses_classe_name_start_time_jours_session_course",
                schema: "myuaacademia",
                table: "classes_courses",
                columns: new[] { "classe_name", "start_time", "jours", "session_course", "year_course" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_classes_courses_course_sigle",
                schema: "myuaacademia",
                table: "classes_courses",
                column: "course_sigle");

            migrationBuilder.CreateIndex(
                name: "ix_classes_courses_employee_code",
                schema: "myuaacademia",
                table: "classes_courses",
                column: "employee_code");

            migrationBuilder.CreateIndex(
                name: "ix_classes_courses_taught_by_start_time_jours_session_course_y",
                schema: "myuaacademia",
                table: "classes_courses",
                columns: new[] { "taught_by", "start_time", "jours", "session_course", "year_course" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_courses_employee_code",
                schema: "myuaacademia",
                table: "courses",
                column: "employee_code");

            migrationBuilder.CreateIndex(
                name: "ix_courses_program_title",
                schema: "myuaacademia",
                table: "courses",
                column: "program_title");

            migrationBuilder.CreateIndex(
                name: "ix_employees_created_by_code",
                schema: "myuaacademia",
                table: "employees",
                column: "created_by_code");

            migrationBuilder.CreateIndex(
                name: "ix_employees_contracts_contract_code",
                schema: "myuaacademia",
                table: "employees_contracts",
                column: "contract_code");

            migrationBuilder.CreateIndex(
                name: "ix_employees_contracts_emp_code",
                schema: "myuaacademia",
                table: "employees_contracts",
                column: "emp_code",
                unique: true,
                filter: "\"is_contract_over\" = false");

            migrationBuilder.CreateIndex(
                name: "ix_programs_employee_code",
                schema: "myuaacademia",
                table: "programs",
                column: "employee_code");

            migrationBuilder.CreateIndex(
                name: "ix_user_courses_c_course_id",
                schema: "myuaacademia",
                table: "user_courses",
                column: "c_course_id");

            migrationBuilder.CreateIndex(
                name: "ix_user_courses_permanent_code",
                schema: "myuaacademia",
                table: "user_courses",
                column: "permanent_code");

            migrationBuilder.CreateIndex(
                name: "ix_user_program_enrollments_title",
                schema: "myuaacademia",
                table: "user_program_enrollments",
                column: "title");

            migrationBuilder.CreateIndex(
                name: "ix_users_employee_code",
                schema: "myuaacademia",
                table: "users",
                column: "employee_code");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "bills",
                schema: "myuaacademia");

            migrationBuilder.DropTable(
                name: "bulletins",
                schema: "myuaacademia");

            migrationBuilder.DropTable(
                name: "employees_contracts",
                schema: "myuaacademia");

            migrationBuilder.DropTable(
                name: "student_files",
                schema: "myuaacademia");

            migrationBuilder.DropTable(
                name: "user_courses",
                schema: "myuaacademia");

            migrationBuilder.DropTable(
                name: "user_program_enrollments",
                schema: "myuaacademia");

            migrationBuilder.DropTable(
                name: "contracts",
                schema: "myuaacademia");

            migrationBuilder.DropTable(
                name: "classes_courses",
                schema: "myuaacademia");

            migrationBuilder.DropTable(
                name: "users",
                schema: "myuaacademia");

            migrationBuilder.DropTable(
                name: "classes",
                schema: "myuaacademia");

            migrationBuilder.DropTable(
                name: "courses",
                schema: "myuaacademia");

            migrationBuilder.DropTable(
                name: "programs",
                schema: "myuaacademia");

            migrationBuilder.DropTable(
                name: "employees",
                schema: "myuaacademia");
        }
    }
}
