namespace MyUAAcademiaB.Dto
{
    public class StudentProgramDecisionDto
    {
        public string PermanentCode { get; set; }
        public List<ProgramDecisionDto> FinalDecisions { get; set; }
    }

    public class ProgramDecisionDto
    {
        public string Title { get; set; }
        public bool IsAccepted { get; set; }
    }
}
