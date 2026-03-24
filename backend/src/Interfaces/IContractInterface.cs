using Microsoft.AspNetCore.Mvc;
using MyUAAcademiaB.Dto;
using MyUAAcademiaB.Models;

namespace MyUAAcademiaB.Interfaces
{
    public interface IContractInterface
    {
        /*BOOL*/



        //CREATE
        Contracts CreateContract(Contracts contractToCreate);
        


        //READ
        ICollection<Contracts> GetContracts();


        //UPDATE



        //DELETE
    }
}
