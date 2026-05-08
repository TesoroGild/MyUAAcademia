using FluentAssertions;
using MyUAAcademiaB.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace tests.Unit.Services
{
    public class UserServiceTests
    {
        private readonly UserService _sut = new();

        // ── GenerateEmail ─────────────────────────────────────────────────────

        [Fact]
        public void GenerateEmail_ReturnsCorrectFormat()
        {
            var result = _sut.GenerateEmail("marie", "dupont");
            result.Should().Be("marie.dupont@myua.ca");
        }

        [Fact]
        public void GenerateEmail_IsLowercase()
        {
            var result = _sut.GenerateEmail("MARIE", "DUPONT");
            result.Should().Be("marie.dupont@myua.ca");
        }

        [Fact]
        public void GenerateEmail_ReplacesSpacesWithUnderscore_InFirstName()
        {
            var result = _sut.GenerateEmail("marie claire", "dupont");
            result.Should().Be("marie_claire.dupont@myua.ca");
        }

        [Fact]
        public void GenerateEmail_ContainsDomainMyua()
        {
            var result = _sut.GenerateEmail("marie", "dupont");
            result.Should().EndWith("@myua.ca");
        }

        // ── SetFirstPassword ──────────────────────────────────────────────────

        [Fact]
        public void SetFirstPassword_ReturnsCorrectFormat()
        {
            var result = _sut.SetFirstPasssword("dupont", "marie");
            result.Should().Be("DUPhelloyouMA");
        }

        [Fact]
        public void SetFirstPassword_FirstThreeLettersOfLastName_AreUppercased()
        {
            var result = _sut.SetFirstPasssword("dupont", "marie");
            result.Should().StartWith("DUP");
        }

        [Fact]
        public void SetFirstPassword_LastTwoLettersOfFirstName_AreUppercased()
        {
            var result = _sut.SetFirstPasssword("dupont", "marie");
            result.Should().EndWith("MA");
        }

        [Fact]
        public void SetFirstPassword_ContainsHelloyou()
        {
            var result = _sut.SetFirstPasssword("dupont", "marie");
            result.Should().Contain("helloyou");
        }

        // ── GeneratePermanentCode ─────────────────────────────────────────────

        [Fact]
        public void GeneratePermanentCode_StartsWithFirst3LettersOfLastName_Uppercased()
        {
            var result = _sut.GeneratePermanentCode("dupont", "marie", new DateOnly(1990, 6, 15), 'M', new Random(42));
            result.Should().StartWith("DUP");
        }

        [Fact]
        public void GeneratePermanentCode_ContainsFirstLetterOfFirstName_Uppercased()
        {
            var result = _sut.GeneratePermanentCode("dupont", "marie", new DateOnly(1990, 6, 15), 'M', new Random(42));
            result[3].Should().Be('M');
        }

        [Fact]
        public void GeneratePermanentCode_AddsSixtyTwoToDay_WhenBornAfter2000()
        {
            var result = _sut.GeneratePermanentCode("dupont", "marie", new DateOnly(2001, 6, 15), 'M', new Random(42));
            result.Should().Contain("77");
        }

        [Fact]
        public void GeneratePermanentCode_DoesNotAddSixtyTwo_WhenBornBefore2000()
        {
            var result = _sut.GeneratePermanentCode("dupont", "marie", new DateOnly(1990, 6, 15), 'M', new Random(42));
            result.Should().Contain("15");
        }

        [Theory]
        [InlineData('F', 6, 56)]
        [InlineData('M', 6, 31)]
        [InlineData('O', 6, 16)]
        [InlineData('-', 6, 81)]
        public void GeneratePermanentCode_AddsCorrectValueToMonth_BySexe(char sexe, int month, int expectedMonth)
        {
            var result = _sut.GeneratePermanentCode("dupont", "marie", new DateOnly(1990, month, 15), sexe, new Random(42));
            result.Should().Contain(expectedMonth.ToString("D2"));
        }

        [Fact]
        public void GeneratePermanentCode_EndsWith2DigitNumber_FromRandom()
        {
            var result = _sut.GeneratePermanentCode("dupont", "marie", new DateOnly(1990, 6, 15), 'M', new Random(42));
            var lastTwo = result.Substring(result.Length - 2);
            int.TryParse(lastTwo, out int number).Should().BeTrue();
            number.Should().BeInRange(10, 99);
        }

        [Fact]
        public void GeneratePermanentCode_WithFixedSeed_ReturnsDeterministicResult()
        {
            var result1 = _sut.GeneratePermanentCode("dupont", "marie", new DateOnly(1990, 6, 15), 'M', new Random(42));
            var result2 = _sut.GeneratePermanentCode("dupont", "marie", new DateOnly(1990, 6, 15), 'M', new Random(42));

            result1.Should().Be(result2);
        }
    }
}
