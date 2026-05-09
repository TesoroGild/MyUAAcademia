using FluentAssertions;
using Moq;
using MyUAAcademiaB.Models;
using MyUAAcademiaB.Services;
using AutoMapper;
using MyUAAcademiaB.Interfaces;

namespace tests.Unit.Services
{
    public class BulletinServiceTests
    {
        // ── Setup ─────────────────────────────────────────────────────────────
        // On mock toutes les dépendances du constructeur
        // On ne teste pas ces dépendances ici — elles sont isolées
        private readonly BulletinService _sut; // sut = System Under Test (terme métier)
        private readonly Mock<IBulletinInterface> _bulletinInterfaceMock = new();
        private readonly Mock<IMapper> _mapperMock = new();
        private readonly Mock<IUserCourseInterface> _userCourseInterfaceMock = new();
        private readonly Mock<IClasseCourseInterface> _classeCourseInterfaceMock = new();
        private readonly Mock<ICourseInterface> _courseInterfaceMock = new();
        private readonly Mock<ISchoolReportService> _schoolReportServiceMock = new();

        public BulletinServiceTests()
        {
            _sut = new BulletinService(
                _bulletinInterfaceMock.Object,
                _mapperMock.Object,
                _userCourseInterfaceMock.Object,
                _classeCourseInterfaceMock.Object,
                _courseInterfaceMock.Object,
                _schoolReportServiceMock.Object
            );
        }

        // ── CalculateAverage ──────────────────────────────────────────────────

        [Fact]
        public void CalculateAverage_ReturnsZero_WhenBulletinsIsNull()
        {
            // Arrange — préparer les données
            IEnumerable<Bulletins> bulletins = null;

            // Act — exécuter la méthode
            var result = _sut.CalculateAverage(bulletins);

            // Assert — vérifier le résultat
            result.Should().Be(0.0);
        }

        [Fact]
        public void CalculateAverage_ReturnsZero_WhenBulletinsIsEmpty()
        {
            var result = _sut.CalculateAverage(new List<Bulletins>());
            result.Should().Be(0.0);
        }

        [Fact]
        public void CalculateAverage_ReturnsZero_WhenAllGradesAreNull()
        {
            var bulletins = new List<Bulletins>
            {
                new Bulletins { Grade = null },
                new Bulletins { Grade = null },
            };

            var result = _sut.CalculateAverage(bulletins);
            result.Should().Be(0.0);
        }

        [Fact]
        public void CalculateAverage_ReturnsCorrectAverage_WhenGradesAreValid()
        {
            var bulletins = new List<Bulletins>
            {
                new Bulletins { Grade = 80 },
                new Bulletins { Grade = 90 },
                new Bulletins { Grade = 70 },
            };

            var result = _sut.CalculateAverage(bulletins);

            result.Should().Be(80.0);
        }

        [Fact]
        public void CalculateAverage_IgnoresNullGrades_WhenMixedWithValidGrades()
        {
            var bulletins = new List<Bulletins>
            {
                new Bulletins { Grade = 90 },
                new Bulletins { Grade = null },
                new Bulletins { Grade = 70 },
            };

            var result = _sut.CalculateAverage(bulletins);

            result.Should().Be(80.0);
        }

        // ── SetMention ────────────────────────────────────────────────────────
        // Pattern : [Theory] + [InlineData] = tester plusieurs valeurs
        // sans dupliquer le code — terme métier : "parameterized tests"

        [Theory]
        [InlineData(95, "A+")]
        [InlineData(97, "A+")]
        [InlineData(90, "A")]
        [InlineData(85, "A-")]
        [InlineData(82, "B+")]
        [InlineData(78, "B")]
        [InlineData(75, "B-")]
        [InlineData(72, "C+")]
        [InlineData(68, "C")]
        [InlineData(65, "C-")]
        [InlineData(62, "D+")]
        [InlineData(60, "D")]
        [InlineData(50, "D-")]
        [InlineData(49, "E")]
        [InlineData(0, "E")]
        public void SetMention_ReturnsCorrectMention_ForGrade(double grade, string expectedMention)
        {
            var result = _sut.SetMention(grade);
            result.Should().Be(expectedMention);
        }

        [Theory]
        [InlineData(94.9, "A")]
        [InlineData(89.9, "A-")]
        [InlineData(59.9, "D-")]
        public void SetMention_HandlesBoundaryValues_Correctly(double grade, string expectedMention)
        {
            var result = _sut.SetMention(grade);
            result.Should().Be(expectedMention);
        }
    }
}