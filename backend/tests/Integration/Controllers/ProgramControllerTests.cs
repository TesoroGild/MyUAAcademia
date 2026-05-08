using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Moq;
using MyUAAcademiaB.Dto;
using MyUAAcademiaB.Interfaces;
using MyUAAcademiaB.Models;
using Microsoft.Extensions.DependencyInjection;
using System.Net;
using System.Net.Http.Json;
using Microsoft.Extensions.Configuration;


namespace tests.Integration.Controllers
{
    public class ProgramControllerTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;
        private readonly Mock<IProgramInterface> _programInterfaceMock = new();
        private readonly Mock<IUserProgramInterface> _userProgramInterfaceMock = new();

        public ProgramControllerTests(WebApplicationFactory<Program> factory)
        {
            _client = factory.WithWebHostBuilder(builder =>
            {
                builder.ConfigureAppConfiguration((context, config) =>
                {
                    config.AddInMemoryCollection(new Dictionary<string, string>
                    {
                        ["LOCAL_FRONTEND_URL"] = "http://localhost:5173"
                    });
                });

                builder.ConfigureServices(services =>
                {
                    services.AddScoped<IProgramInterface>(_ => _programInterfaceMock.Object);
                    services.AddScoped<IUserProgramInterface>(_ => _userProgramInterfaceMock.Object);
                });
            }).CreateClient();
        }

        // ── POST /api/Program/program ─────────────────────────────────────────

        [Fact]
        public async Task CreateProgram_Returns200_WhenProgramIsValid()
        {
            // Arrange
            var programDto = new ProgramDto
            {
                Title = "Nouveau Programme",
                ProgramName = "NP",
                Descriptions = "Lorem ipsum",
                Grade = "Doc",
                Department = "Art",
                Faculty = "Visuel",
                EmployeeCode = "EXIST",
                IsEnrolled = true,
                HasFinished = false
            };

            _programInterfaceMock
                .Setup(x => x.ProgramExist(programDto.Title))
                .Returns(false);

            _programInterfaceMock
                .Setup(x => x.CreateProgram(It.IsAny<Programs>()))
                .Returns(new Programs());

            // Act
            var response = await _client.PostAsJsonAsync("/api/Program/program", programDto);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        [Fact]
        public async Task CreateProgram_Returns400_WhenBodyIsNull()
        {
            var response = await _client.PostAsJsonAsync<ProgramDto>("/api/Program/program", null);
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        [Fact]
        public async Task CreateProgram_Returns400_WhenMissingAttributes()
        {
            // Arrange
            var programDto = new ProgramDto { Title = "Nouveau Programme" };

            _programInterfaceMock
                .Setup(x => x.ProgramExist(programDto.Title))
                .Returns(false);

            // Act
            var response = await _client.PostAsJsonAsync("/api/Program/program", programDto);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        [Fact]
        public async Task CreateProgram_Returns422_WhenProgramAlreadyExists()
        {
            // Arrange
            var programDto = new ProgramDto
            {
                Title = "Ancien Programme",
                ProgramName = "PE",
                Descriptions = "Lorem ipsum",
                Grade = "Bachelor",
                Department = "Sciences",
                Faculty = "SVT",
                EmployeeCode = "EXIST",
                IsEnrolled = true,
                HasFinished = false
            };

            _programInterfaceMock
                .Setup(x => x.ProgramExist(programDto.Title))
                .Returns(true); // ← programme déjà en BD

            // Act
            var response = await _client.PostAsJsonAsync("/api/Program/program", programDto);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.UnprocessableEntity); // 422
        }

        [Fact]
        public async Task CreateProgram_Returns500_WhenCreationFails()
        {
            // Arrange
            var programDto = new ProgramDto
            {
                Title = "Nouveau Programme",
                ProgramName = "NP",
                Descriptions = "Lorem ipsum",
                Grade = "Master",
                Department = "Psychologie",
                Faculty = "Psycho",
                EmployeeCode = "EXIST",
                IsEnrolled = true,
                HasFinished = false
            };

            _programInterfaceMock
                .Setup(x => x.ProgramExist(programDto.Title))
                .Returns(false);

            _programInterfaceMock
                .Setup(x => x.CreateProgram(It.IsAny<Programs>()))
                .Returns((Programs)null); // ← échec BD

            // Act
            var response = await _client.PostAsJsonAsync("/api/Program/program", programDto);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.InternalServerError);
        }

        // ── GET /api/Program/programs ─────────────────────────────────────────

        [Fact]
        public async Task GetPrograms_Returns200_WithListOfPrograms()
        {
            // Arrange
            var programs = new List<Programs>
            {
                new Programs { Title = "Prog1" },
                new Programs { Title = "Prog2" },
            };

            _programInterfaceMock
                .Setup(x => x.GetPrograms())
                .Returns(programs);

            // Act
            var response = await _client.GetAsync("/api/Program/programs");
            var result = await response.Content.ReadFromJsonAsync<List<ProgramDto>>();

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            result.Should().HaveCount(2);
        }

        [Fact]
        public async Task GetPrograms_Returns200_WithEmptyList_WhenNoProgramsExist()
        {
            _programInterfaceMock
                .Setup(x => x.GetPrograms())
                .Returns(new List<Programs>());

            var response = await _client.GetAsync("/api/Program/programs");
            var result = await response.Content.ReadFromJsonAsync<List<ProgramDto>>();

            response.StatusCode.Should().Be(HttpStatusCode.OK);
            result.Should().BeEmpty();
        }

        // ── GET /api/Program/programs/{grade} ─────────────────────────────────

        [Theory]
        [InlineData("Baccalauréat")]
        [InlineData("Master")]
        [InlineData("Doctorat")]
        public async Task GetProgramsByGrade_Returns200_ForValidGrade(string grade)
        {
            // Arrange
            _programInterfaceMock
                .Setup(x => x.GetProgramsByGrade(grade))
                .Returns(new List<Programs> { new Programs { Title = "Test" } });

            // Act
            var response = await _client.GetAsync($"/api/Program/programs/{grade}");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        [Fact]
        public async Task GetProgramsByGrade_Returns200_WithEmptyList_WhenNoMatchingPrograms()
        {
            _programInterfaceMock
                .Setup(x => x.GetProgramsByGrade("GradeInconnu"))
                .Returns(new List<Programs>());

            var response = await _client.GetAsync("/api/Program/programs/GradeInconnu");
            var result = await response.Content.ReadFromJsonAsync<List<ProgramDto>>();

            response.StatusCode.Should().Be(HttpStatusCode.OK);
            result.Should().BeEmpty();
        }

        // ── GET /api/Program/{permanentcode} ──────────────────────────────────

        [Fact]
        public async Task GetStudentPrograms_Returns200_WithEnrollmentInfo()
        {
            // Arrange
            var permanentCode = "DUPM151831902PF5";

            var userPrograms = new List<ProgEnrFinDto>
            {
                new ProgEnrFinDto { Title = "Prog1", IsEnrolled = true, HasFinished = false }
            };

            var programs = new List<Programs>
            {
                new Programs { Title = "Prog1" }
            };

            _userProgramInterfaceMock
                .Setup(x => x.GetStudentPrograms(permanentCode))
                .Returns(userPrograms);

            _programInterfaceMock
                .Setup(x => x.GetPrograms(It.IsAny<List<string>>()))
                .Returns(programs);

            // Act
            var response = await _client.GetAsync($"/api/Program/{permanentCode}");
            var result = await response.Content.ReadFromJsonAsync<List<ProgramDto>>();

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            result.Should().HaveCount(1);
            result![0].IsEnrolled.Should().BeTrue();
            result![0].HasFinished.Should().BeFalse();
        }
    }
}
