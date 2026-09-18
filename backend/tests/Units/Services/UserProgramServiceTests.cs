using FluentAssertions;
using MyUAAcademiaB.Dto;
using MyUAAcademiaB.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace tests.Unit.Services
{
    public class UserProgramServiceTests
    {
        private readonly UserProgramService _sut = new();

        // Helper — crée un DTO vide pour chaque test
        private UserProgramEnrollmentDto NewDto() => new UserProgramEnrollmentDto();

        [Fact]
        public void SetEstimatedDates_SetsEnrollmentDate_ToToday()
        {
            var dto = NewDto();
            var result = _sut.setEstimatedDates(dto, "Baccalauréat");
            result.EnrollmentDate.Should().Be(DateOnly.FromDateTime(DateTime.Now));
        }

        [Theory]
        [InlineData("Doctorat", 4)]
        [InlineData("Baccalauréat", 3)]
        [InlineData("Master", 2)]
        [InlineData("Certificat", 2)]
        public void SetEstimatedDates_SetsCorrectEndDateEstimate_ByGrade(string grade, int expectedYears)
        {
            var dto = NewDto();
            var today = DateOnly.FromDateTime(DateTime.Now);

            var result = _sut.setEstimatedDates(dto, grade);

            result.EndDateEstimate.Should().Be(today.AddYears(expectedYears));
        }

        [Fact]
        public void SetEstimatedDates_UnknownGrade_ThrowsArgumentException()
        {
            // Aucun if ne matche → EndDateEstimate reste à sa valeur par défaut
            var dto = NewDto();
            Action act = () => _sut.setEstimatedDates(dto, "GradeInconnu");
            act.Should().Throw<ArgumentException>().WithMessage("Grade non reconnu : GradeInconnu");
        }

        [Fact]
        public void SetEstimatedDates_ReturnsSameDto_NotANewObject()
        {
            // Vérifie que la méthode modifie et retourne le même objet
            // et non une copie — important pour éviter des bugs de référence
            var dto = NewDto();
            var result = _sut.setEstimatedDates(dto, "Master");
            result.Should().BeSameAs(dto);
        }
    }
}
