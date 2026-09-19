using FluentAssertions;
using MyUAAcademiaB.Models;
using MyUAAcademiaB.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace tests.Unit.Services
{
    public class EmployeeServiceTests
    {
        private readonly EmployeeService _sut = new();

        [Fact]
        public void GenerateCode_StartsWithFirst3LettersOfLastName_Uppercased()
        {
            var result = _sut.GenerateCode("dupont", "marie", new DateOnly(1990, 6, 15), 'F', "professor", new DateOnly(2020, 1, 1));
            result.Should().StartWith("DUP");
        }

        [Fact]
        public void GenerateCode_ContainsFirstLetterOfFirstName_Uppercased()
        {
            var result = _sut.GenerateCode("dupont", "marie", new DateOnly(1990, 6, 15), 'F', "professor", new DateOnly(2020, 1, 1));
            result.Should().Contain("M");
        }

        // ── Année de naissance — day += 62 si >= 2000 ────────────────────────

        [Fact]
        public void GenerateCode_AddsSixtyTwoToDay_WhenBornAfter2000()
        {
            var result = _sut.GenerateCode("dupont", "marie", new DateOnly(2001, 6, 15), 'F', "professor", new DateOnly(2020, 1, 1));
            result.Should().Contain("77");
        }

        [Fact]
        public void GenerateCode_DoesNotAddSixtyTwo_WhenBornBefore2000()
        {
            var result = _sut.GenerateCode("dupont", "marie", new DateOnly(1990, 6, 15), 'F', "professor", new DateOnly(2020, 1, 1));
            result.Should().Contain("15");
        }

        [Fact]
        public void GenerateCode_BoundaryYear2000_AddsSixtyTwoToDay()
        {
            var result = _sut.GenerateCode("dupont", "marie", new DateOnly(2000, 6, 15), 'F', "professor", new DateOnly(2020, 1, 1));
            result.Should().Contain("77");
        }

        // ── Sexe → ajout au mois ─────────────────────────────────────────────

        [Theory]
        [InlineData('F', 6, 39)]  // 6 + 33 = 39
        [InlineData('M', 6, 18)]  // 6 + 12 = 18
        [InlineData('O', 6, 11)]  // 6 + 5  = 11
        [InlineData('-', 6, 77)]  // 6 + 71 = 77
        public void GenerateCode_AddsCorrectValueToMonth_BySexe(char sexe, int month, int expectedMonth)
        {
            var result = _sut.GenerateCode("dupont", "marie", new DateOnly(1990, month, 15), sexe, "professor", new DateOnly(2020, 1, 1));
            result.Should().Contain(expectedMonth.ToString("D2"));
        }

        // ── Job → suffixe ────────────────────────────────────────────────────

        [Theory]
        [InlineData("director", "DG")]
        [InlineData("admin", "AD")]
        [InlineData("professor", "PF")]
        [InlineData("other", "EMP")]
        [InlineData("DIRECTOR", "DG")]   // case insensitive
        [InlineData("PROFESSOR", "PF")]   // case insensitive
        public void GenerateCode_AppendsCorrectJobSuffix(string job, string expectedSuffix)
        {
            var result = _sut.GenerateCode("dupont", "marie", new DateOnly(1990, 6, 15), 'M', job, new DateOnly(2020, 1, 1));
            result.Should().Contain(expectedSuffix);
        }

        // ── Séniorité ────────────────────────────────────────────────────────

        [Fact]
        public void GenerateCode_AppendsSeniority_AsYearsSinceStartingDate()
        {
            var startingDate = new DateOnly(DateTime.Today.Year - 5, 1, 1);
            var result = _sut.GenerateCode("dupont", "marie", new DateOnly(1990, 6, 15), 'M', "admin", startingDate);
            result.Should().EndWith("5");
        }

        [Fact]
        public void GenerateCode_AppendZeroSeniority_WhenStartedThisYear()
        {
            var startingDate = new DateOnly(DateTime.Today.Year, 1, 1);
            var result = _sut.GenerateCode("dupont", "marie", new DateOnly(1990, 6, 15), 'M', "admin", startingDate);
            result.Should().EndWith("0");
        }

        // ── Test de code complet ──────────────────────────────────────────────
        // Vérifie le résultat final bout en bout pour un cas connu

        [Fact]
        public void GenerateCode_ReturnsExpectedFullCode_ForKnownInput()
        {
            // Arrange
            // lastName: "dupont" → DUP
            // firstName: "marie" → M
            // birthDay: 1990-06-15, sexe M → day=15, month=6+12=18, year=1990
            // job: professor → PF
            // startingDate: 5 ans d'ancienneté
            var startingDate = new DateOnly(DateTime.Today.Year - 5, 1, 1);
            var expected = $"DUPM15181990PF5";

            // Act
            var result = _sut.GenerateCode("dupont", "marie", new DateOnly(1990, 6, 15), 'M', "professor", startingDate);

            // Assert
            result.Should().Be(expected);
        }
    }
}
