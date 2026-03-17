using MyUAAcademiaB.Models;

namespace MyUAAcademiaB.Interfaces
{
    public interface IProgramInterface
    {
        //BOOL
        bool ProgramExist(string title);

        //CREATE
        Programs CreateProgram(Programs programToCreate);

        //READ
        string GetGrade(string title);
        ICollection<Programs> GetPrograms();
        ICollection<Programs> GetPrograms(List<string> titles);
        ICollection<Programs> GetProgramsByGrade(string grade);


        //UPDATE

        //DELETE
    }
}
