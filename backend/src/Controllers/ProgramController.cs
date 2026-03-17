using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MyUAAcademiaB.Dto;
using MyUAAcademiaB.Interfaces;
using MyUAAcademiaB.Models;
using MyUAAcademiaB.Services;

namespace MyUAAcademiaB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProgramController : ControllerBase
    {
        private readonly IProgramInterface _programInterface;
        private readonly IUserProgramInterface _userProgramInterface;
        private readonly IMapper _mapper;

        public ProgramController(IProgramInterface programInterface, IMapper mapper, IUserProgramInterface userProgramInterface)
        {
            _programInterface = programInterface;
            _mapper = mapper;
            _userProgramInterface = userProgramInterface;
        }

        /*CREATE*/
        [HttpPost("program")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Programs>))]
        [ProducesResponseType(400)]
        public IActionResult CreateProgram([FromBody] ProgramDto programTocreate)
        {
            if (programTocreate == null) return BadRequest(ModelState);

            var titleExist = _programInterface.ProgramExist(programTocreate.Title);

            if (titleExist)
            {
                ModelState.AddModelError("", "Le programme existe déjà.");
                //422?
                return StatusCode(422, ModelState);
            }

            if (!ModelState.IsValid) return BadRequest(ModelState);

            var programMap = _mapper.Map<Programs>(programTocreate);
            var programCreated = _programInterface.CreateProgram(programMap);

            if (programCreated == null)
            {
                ModelState.AddModelError("", "Erreur lors de la création du programme.");
                return StatusCode(500, ModelState);
            }

            return Ok(programCreated);
        }

        /*READ*/
        [HttpGet("{permanentcode}")]
        [ProducesResponseType(200)]
        public IActionResult GetStudentPrograms(string permanentcode)
        {
            //retourner isEnrolled et HasFinished
            var programs1 = _userProgramInterface.GetStudentPrograms(permanentcode);
            var programs2 = _programInterface.GetPrograms(programs1.Select(p => p.Title).ToList());
            var programsMap = _mapper.Map<List<ProgramDto>>(programs2);
            for (int i = 0; i < programsMap.Count; i++)
            {
                programsMap[i].IsEnrolled = programs1.FirstOrDefault(p => p.Title == programsMap[i].Title).IsEnrolled;
                programsMap[i].HasFinished = programs1.FirstOrDefault(p => p.Title == programsMap[i].Title).HasFinished;
            }

            if (!ModelState.IsValid) return BadRequest(ModelState);

            return Ok(programsMap);
        }

        [HttpGet("programs")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<ProgramDto>))]
        public IActionResult GetPrograms()
        {
            var programs = _programInterface.GetPrograms();
            var programsMap = _mapper.Map<List<ProgramDto>>(programs);

            if (!ModelState.IsValid) return BadRequest(ModelState);

            return Ok(programsMap);
        }

        [HttpGet("programs/{grade}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<ProgramDto>))]
        public IActionResult GetProgramsByGrade(string grade)
        {
            var programs = _programInterface.GetProgramsByGrade(grade);
            var programsMap = _mapper.Map<List<ProgramDto>>(programs);

            if (!ModelState.IsValid) return BadRequest(ModelState);

            return Ok(programsMap);
        }

        /*UPDATE*/
        


        /*DELETE*/
    }
}
