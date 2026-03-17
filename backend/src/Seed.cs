using MyUAAcademiaB.Data;
using System.Diagnostics.Metrics;
using MyUAAcademiaB.Models;
using System.Collections.Generic;
using System.Diagnostics.Contracts;
using static System.Collections.Specialized.BitVector32;
using static System.Runtime.InteropServices.JavaScript.JSType;
using System.Diagnostics;
using System.Reflection;

namespace MyUAAcademiaB
{
    public class Seed
    {
        private readonly DataContext dataContext;

        public Seed(DataContext context)
        {
            this.dataContext = context;
        }
        public void SeedDataContext()
        {
        }
    }
}