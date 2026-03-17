namespace MyUAAcademiaB.Dto
{
    public class BillDto
    {
        public required DateTime DateOfIssue { get; set; }

        public required DateTime DeadLine { get; set; }

        public DateTime? DateOfPaiement { get; set; }

        public double? Amount { get; set; }
        public double? AmountPaid { get; set; }
        public double? GeneralExpenses { get; set; }
        public double? SportsAdministrationFees { get; set; }
        public double? DentalInsurance { get; set; }
        public double? InsuranceFees { get; set; }
        public double? RefundsAndAdjustments { get; set; }

        public string SessionStudy { get; set; }

        public string YearStudy { get; set; }

        public string PermanentCode { get; set; }
    }
}
