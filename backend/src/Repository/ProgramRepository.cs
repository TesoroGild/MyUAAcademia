using MyUAAcademiaB.Data;
using MyUAAcademiaB.Interfaces;
using MyUAAcademiaB.Models;

namespace MyUAAcademiaB.Repository
{
    public class ProgramRepository : IProgramInterface
    {
        private readonly DataContext _context;
        public ProgramRepository(DataContext context)
        {
            _context = context;
        }

        public bool ProgramExist(string title)
        {
            return _context.Programs.Any(p => p.Title == title);
        }

        /*CREATE*/
        public Programs CreateProgram(Programs programToCreate)
        {
            _context.Add(programToCreate);
            _context.SaveChanges();
            return programToCreate;
        }

        /*READ*/
        public string GetGrade(string title)
        {
            return _context.Programs.Where(p => p.Title.ToLower().Trim() == title.ToLower().Trim())
                .Select(g => g.Grade)
                .FirstOrDefault();
        }

        public ICollection<Programs> GetPrograms()
        {
            return _context.Programs.OrderBy(p => p.ProgramName)
                .ToList();
        }

        public ICollection<Programs> GetProgramsByGrade(string grade)
        {
            return _context.Programs.Where(p => p.Grade == grade)
                .ToList();
        }

        public ICollection<Programs> GetPrograms(List<string> titles)
        {
            return _context.Programs
                .Where(p => titles.Contains(p.Title))
                .ToList();
        }


        /*UPDATE*/
        /*DELETE*/
    }
}
