using FluentAssertions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using MyUAAcademiaB.Dto;
using MyUAAcademiaB.Interfaces;
using MyUAAcademiaB.Models;
using System.Net;
using System.Net.Http.Json;

namespace tests.Integration.Controllers
{
    public class ContractControllerTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;
        private readonly Mock<IContractInterface> _contractInterfaceMock = new();

        public ContractControllerTests(WebApplicationFactory<Program> factory)
        {
            _client = factory.WithWebHostBuilder(builder =>
            {
                builder.UseEnvironment("Testing");
                builder.ConfigureAppConfiguration((context, config) =>
                {
                    // Injecter les valeurs manquantes pour le contexte de test
                    config.AddInMemoryCollection(new Dictionary<string, string>
                    {
                        ["LOCAL_FRONTEND_URL"] = "http://localhost:5173"
                    });
                });

                builder.ConfigureServices(services =>
                {
                    services.AddScoped<IContractInterface>(_ => _contractInterfaceMock.Object);
                });
            }).CreateClient();
        }

        // ── POST /api/Contract ────────────────────────────────────────────────

        [Fact]
        public async Task CreateContract_Returns200_WhenContractIsValid()
        {
            // Arrange
            var contractDto = new ContractTCDto
            {
                Availability = "ASAP",
                BaseSalary = "90000",
                Department = "Informatique",
                Description = "Lorem ipsum dolor sit amet",
                Faculty = "Sciences",
                JobTitle = "Chargé du programme",
                MaximumWage = 110000,
                MinimumWage = 80000,
                NumberOfHours = 24,
                StartingDate = new DateOnly(2026, 5, 5),
                TypeOfEmployment = "Temps plein",
                TypeOfOffer = "Permanent",
                WorkShift = "Temps partiel"
            };

            _contractInterfaceMock
                .Setup(x => x.CreateContract(It.IsAny<Contracts>()))
                .Returns(new Contracts());

            // Act
            var response = await _client.PostAsJsonAsync("/api/Contract", contractDto);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        [Fact]
        public async Task CreateContract_Returns400_WhenContractIsNull()
        {
            // Act
            var response = await _client.PostAsJsonAsync<ContractTCDto>("/api/Contract", null);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        [Fact]
        public async Task CreateContract_Returns500_WhenInterfaceReturnsNull()
        {
            // Arrange — le repository échoue
            var contractDto = new ContractTCDto
            {
                Availability = "Immédiate",
                BaseSalary = "65000",
                Department = "Informatique",
                Description = "Lorem ipsum dolor sit amet",
                Faculty = "Sciences",
                JobTitle = "Démonstrateur",
                MaximumWage = 90000,
                MinimumWage = 60000,
                NumberOfHours = 24,
                StartingDate = new DateOnly(2026, 6, 11),
                TypeOfEmployment = "Temps plein",
                TypeOfOffer = "Permanent",
                WorkShift = "Temps partiel"
            };

            _contractInterfaceMock
                .Setup(x => x.CreateContract(It.IsAny<Contracts>()))
                .Returns((Contracts)null);

            // Act
            var response = await _client.PostAsJsonAsync("/api/Contract", contractDto);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.InternalServerError);
        }

        //Il manque beaucoup de cas
        [Theory]
        [InlineData("Temps plein", "1")]
        [InlineData("Temps partiel", "2")]
        public async Task CreateContract_GeneratesCorrectEmploymentCode(string typeOfEmployment, string expectedCode)
        {
            // Arrange
            Contracts capturedContract = null;

            _contractInterfaceMock
                .Setup(x => x.CreateContract(It.IsAny<Contracts>()))
                .Callback<Contracts>(c => capturedContract = c)
                .Returns(new Contracts());

            var contractDto = new ContractTCDto
            {
                Availability = "ASAP",
                BaseSalary = "90000",
                Department = "Informatique",
                Description = "Lorem ipsum dolor sit amet",
                Faculty = "Sciences",
                JobTitle = "Chargé du programme",
                MaximumWage = 110000,
                MinimumWage = 80000,
                NumberOfHours = 24,
                StartingDate = new DateOnly(2026, 5, 5),
                TypeOfEmployment = typeOfEmployment,
                TypeOfOffer = "Permanent",
                WorkShift = "Temps partiel"
            };

            // Act
            await _client.PostAsJsonAsync("/api/Contract", contractDto);

            // Assert — le code généré commence par le bon code emploi
            capturedContract.Code.Should().StartWith(expectedCode);
        }

        // ── GET /api/Contract ─────────────────────────────────────────────────

        [Fact]
        public async Task GetContracts_Returns200_WithListOfContracts()
        {
            // Arrange
            var contracts = new List<Contracts>
            {
                new Contracts { Code = "11091100" },
                new Contracts { Code = "12092100" },
            };

            _contractInterfaceMock
                .Setup(x => x.GetContracts())
                .Returns(contracts);

            // Act
            var response = await _client.GetAsync("/api/Contract");
            var result = await response.Content.ReadFromJsonAsync<List<Contracts>>();

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            result.Should().HaveCount(2);
        }

        [Fact]
        public async Task GetContracts_Returns200_WithEmptyList_WhenNoContractsExist()
        {
            // Arrange
            _contractInterfaceMock
                .Setup(x => x.GetContracts())
                .Returns(new List<Contracts>());

            // Act
            var response = await _client.GetAsync("/api/Contract");
            var result = await response.Content.ReadFromJsonAsync<List<Contracts>>();

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            result.Should().BeEmpty();
        }
    }
}