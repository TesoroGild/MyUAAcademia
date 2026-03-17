using MyUAAcademiaB.Models;

namespace MyUAAcademiaB.Interfaces
{
    public interface IClasseInterface
    {
        bool ClasseExists(string classeName);

        /*CREATE*/
        Classes CreateClasse(Classes classe);

        /*READ*/
        ICollection<Classes> GetClasses();
        ICollection<Classes> GetClassesType(string roomType);
        ICollection<Classes> GetRoomsBiggerThanXPlaces(int nbPlaces);
        ICollection<Classes> GetRoomsSmallerThanXPlaces(int nbPlaces);
        ICollection<Classes> GetRoomsWithXPlaces(int nbPlaces);
        Classes GetTheBiggestRoom();
        Classes GetTheSmallestRoom();

        /*UPDATE*/
        Classes UpdateClasse(Classes classe);

        /*DELETE*/
    }
}
