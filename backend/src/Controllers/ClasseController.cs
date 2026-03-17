using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MyUAAcademiaB.Dto;
using MyUAAcademiaB.Interfaces;
using MyUAAcademiaB.Models;
using System.Collections.Generic;

namespace MyUAAcademiaB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClasseController : ControllerBase
    {
        private readonly IClasseInterface _classeInterface;
        private readonly IMapper _mapper;

        public ClasseController(IClasseInterface classeInterface, IMapper mapper)
        {
            _classeInterface = classeInterface;
            _mapper = mapper;
        }

        /*CREATE*/
        [HttpPost("classes")]
        [ProducesResponseType(200, Type = typeof(Classes))]
        [ProducesResponseType(400)]
        public IActionResult CreateCourse([FromBody] ClasseDto classeTocreate)
        {
            if (classeTocreate == null) return BadRequest(ModelState);

            var classeExist = _classeInterface.ClasseExists(classeTocreate.ClasseName);

            if (classeExist)
            {
                ModelState.AddModelError("", "Le classe existe déjà.");
                return StatusCode(422, ModelState);
            }

            if (!ModelState.IsValid) return BadRequest(ModelState);

            var classeMap = _mapper.Map<Classes>(classeTocreate);
            var classeCreated = _classeInterface.CreateClasse(classeMap);

            if (classeCreated == null)
            {
                ModelState.AddModelError("", "Erreur lors de la création d'une classe.");
                return StatusCode(500, ModelState);
            }

            return Ok(classeCreated);
        }

        /*READ*/
        [HttpGet("classes")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<ClasseDto>))]
        public IActionResult GetClasses()
        {
            var classes = _classeInterface.GetClasses();
            var classesMap = _mapper.Map<List<ClasseDto>>(classes);

            if (!ModelState.IsValid) return BadRequest(ModelState);

            return Ok(classesMap);
        }

        [HttpPost("classes-type")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Classes>))]
        public IActionResult GetClassesType([FromBody] string roomType)
        {
            if (roomType == null || roomType == "")
            {
                return BadRequest("Invalid room type.");
            }

            var classesType = _classeInterface.GetClassesType(roomType);

            if (!ModelState.IsValid) return BadRequest(ModelState);

            return Ok(classesType);
        }

        [HttpGet("classes-the-biggest")]
        [ProducesResponseType(200, Type = typeof(ClasseDto))]
        public IActionResult GetTheBiggestRoom()
        {
            var theBiggestClasse = _classeInterface.GetTheBiggestRoom();
            var biggestMap = _mapper.Map<ClasseDto>(theBiggestClasse);

            if (!ModelState.IsValid) return BadRequest(ModelState);

            return Ok(biggestMap);
        }

        [HttpGet("classes-the-smallest")]
        [ProducesResponseType(200, Type = typeof(ClasseDto))]
        public IActionResult GetTheSmallestRoom()
        {
            var theSmallestClasse = _classeInterface.GetTheSmallestRoom();
            var smallestMap = _mapper.Map<ClasseDto>(theSmallestClasse);

            if (!ModelState.IsValid) return BadRequest(ModelState);

            return Ok(smallestMap);
        }

        [HttpPost("classes-with-places")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Classes>))]
        public IActionResult GetRoomsWithXPlaces([FromBody] int nbPlaces)
        {
            if (nbPlaces < 0)
            {
                return BadRequest("Invalid number of places.");
            }

            var classesWithXPlaces = _classeInterface.GetRoomsWithXPlaces(nbPlaces);

            if (!ModelState.IsValid) return BadRequest(ModelState);

            return Ok(classesWithXPlaces);
        }

        [HttpPost("classes-with-more-places")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Classes>))]
        public IActionResult GetRoomsBiggerThanXPlaces([FromBody] int nbPlaces)
        {
            if (nbPlaces < 0)
            {
                return BadRequest("Invalid number of places.");
            }

            var classesBiggerThanXPlaces = _classeInterface.GetRoomsBiggerThanXPlaces(nbPlaces);

            if (!ModelState.IsValid) return BadRequest(ModelState);

            return Ok(classesBiggerThanXPlaces);
        }

        [HttpPost("classes-with-less-places")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Classes>))]
        public IActionResult GetRoomsSmallerThanXPlaces([FromBody] int nbPlaces)
        {
            if (nbPlaces < 0)
            {
                return BadRequest("Invalid number of places.");
            }

            var classesSmallerThanXPlaces = _classeInterface.GetRoomsSmallerThanXPlaces(nbPlaces);

            if (!ModelState.IsValid) return BadRequest(ModelState);

            return Ok(classesSmallerThanXPlaces);
        }

        /*UPDATE*/
        [HttpPut("classes")]
        [ProducesResponseType(200, Type = typeof(Classes))]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public IActionResult UpdateClasse([FromBody] ClasseDto classeToUpdate, string newClasseName)
        {
            if (classeToUpdate == null) return BadRequest(ModelState);

            if (!_classeInterface.ClasseExists(classeToUpdate.ClasseName))
            {
                ModelState.AddModelError("", "La classe n'existe pas.");
                return StatusCode(400, ModelState);
            }

            classeToUpdate.ClasseName = newClasseName;
            var classeMap = _mapper.Map<Classes>(classeToUpdate);
            var classe = _classeInterface.UpdateClasse(classeMap);

            if (classe == null)
            {
                ModelState.AddModelError("", "Erreur lors de la mise à jour de la classe.");
                return StatusCode(500, ModelState);
            }

            return Ok(classe);
        }
    }
}
