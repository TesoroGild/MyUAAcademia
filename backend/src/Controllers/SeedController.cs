using Microsoft.AspNetCore.Mvc;

namespace MyUAAcademiaB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeedController : ControllerBase
    {
        private readonly Seed _seedService;

        public SeedController(Seed seedService)
        {
            _seedService = seedService;
        }

        /*CREATE*/
        [HttpPost("seeddata")]
        [ProducesResponseType(200, Type = typeof(Seed))]
        [ProducesResponseType(400)]
        public IActionResult SeedDatabase()
        {
            _seedService.SeedDataContext();
            return Ok("Seeding completed.");
        }

    }
}
