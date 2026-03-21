using Microsoft.EntityFrameworkCore;
using MyUAAcademiaB.Data;
using MyUAAcademiaB.Dto;
using MyUAAcademiaB.Interfaces;
using MyUAAcademiaB.Models;

namespace MyUAAcademiaB.Repository
{
    public class ContractRepository : IContractInterface
    {
        private readonly DataContext _context;
        public ContractRepository(DataContext context)
        {
            _context = context;
        }


        /*BOOL*/



        //CREATE
        public Contracts CreateContract(Contracts contractToCreate)
        {
            _context.Add(contractToCreate);
            _context.SaveChanges();
            return contractToCreate;
        }


        //READ
        public ICollection<Contracts> GetContracts()
        {
            return [.. _context.Contracts.OrderBy(p => p.Code)];
        }


        //UPDATE



        //DELETE
    }
}
