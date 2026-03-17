using MyUAAcademiaB.Data;
using MyUAAcademiaB.Interfaces;
using MyUAAcademiaB.Models;

namespace MyUAAcademiaB.Repository
{
    public class ClasseRepository : IClasseInterface
    {
        private readonly DataContext _context;
        public ClasseRepository(DataContext context)
        {
            _context = context;
        }

        /*BOOL*/
        public bool ClasseExists(string classeName)
        {
            return _context.Classes.Any(cl => cl.ClasseName == classeName);
        }

        /*CREATE*/
        public Classes CreateClasse(Classes classe)
        {
            _context.Add(classe);
            _context.SaveChanges();
            return classe;
        }

        /*READ*/
        public ICollection<Classes> GetClasses()
        {
            return _context.Classes.OrderBy(cl => cl.ClasseName).ToList();
        }

        public ICollection<Classes> GetClassesType(string roomType)
        {
            return _context.Classes.Where(cl => cl.TypeOfClasse == roomType)
                .ToList();
        }

        public ICollection<Classes> GetRoomsBiggerThanXPlaces(int nbPlaces)
        {
            return _context.Classes.Where(cl => cl.Capacity > nbPlaces)
                .ToList();
        }

        public ICollection<Classes> GetRoomsSmallerThanXPlaces(int nbPlaces)
        {
            return _context.Classes.Where(cl => cl.Capacity < nbPlaces)
                .ToList();
        }

        public ICollection<Classes> GetRoomsWithXPlaces(int nbPlaces)
        {
            return _context.Classes.Where(cl => cl.Capacity == nbPlaces)
                .ToList();
        }

        public Classes GetTheBiggestRoom()
        {
            return _context.Classes.OrderByDescending(cl => cl.Capacity)
                .FirstOrDefault();
        }

        public Classes GetTheSmallestRoom()
        {
            return _context.Classes.OrderBy(cl => cl.Capacity)
                .FirstOrDefault();
        }

        /*UPDATE*/
        public Classes UpdateClasse(Classes classe)
        {
            _context.Classes.Update(classe);
            _context.SaveChanges();
            return classe;
        }

        /*DELETE*/
    }
}
