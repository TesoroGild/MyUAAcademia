using AutoMapper;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using MyUAAcademiaB.Dto;
using MyUAAcademiaB.Interfaces;
using MyUAAcademiaB.Models;

namespace MyUAAcademiaB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowSpecificOrigin")]
    public class ContractController : ControllerBase
    {
        public readonly IContractInterface _contractInterface;
        private readonly IMapper _mapper;

        public ContractController(IContractInterface contractInterface, IMapper mapper)
        {
            _contractInterface = contractInterface;
            _mapper = mapper;
        }


        //CREATE
        [HttpPost("")]
        [ProducesResponseType(200, Type = typeof(Contracts))]
        [ProducesResponseType(400)]
        public IActionResult CreateContract([FromBody] ContractTCDto contractToCreate)
        {
            if (contractToCreate == null) return BadRequest(ModelState);

            string codeEmp = contractToCreate.TypeOfEmployment == "Temps plein" ? "1" : "2";

            // 2. Offer (Permanent = 1, Temporaire = 2, Saisonnier = 3, etc.)
            string codeOffer = contractToCreate.TypeOfOffer switch
            {
                "Permanent" => "1",
                "Temporaire" => "2",
                "Saisonnier" => "3",
                "Remplacement" => "4",
                "Stage" => "5",
                _ => "0"
            };

            // 3. Dept (Informatique = 1, Mathématiques = 2, etc.)
            string codeDept = contractToCreate.Department switch
            {
                "Danse" => "01",
                "Chimie" => "02",
                "Communication sociale et publique" => "03",
                "Éducation et pédagogie" => "04",
                "Enseignement" => "05",
                "Finance" => "06",
                "Géographie" => "07",
                "Histoire" => "08",
                "Informatique" => "09",
                "Mathématiques" => "10",
                "Psychologie" => "11",
                "Relations humaines" => "12",
                "Science politique" => "13",
                _ => "00"
            };

            // 4. Faculty (Sciences = 1, Communication = 2, etc.)
            string codeFac = contractToCreate.Faculty switch
            {
                "Arts" => "1",
                "Communication" => "2",
                "Science politique et droit" => "3",
                "Sciences" => "4",
                "Sciences de l’éducation" => "5",
                "Sciences de la gestion" => "6",
                "Sciences humaines" => "7",
                _ => "0"
            };

            string sequence = 100.ToString().PadLeft(3, '0');
            contractToCreate.Code = codeEmp + codeOffer + codeDept + codeFac + sequence;
            var contractMap = _mapper.Map<Contracts>(contractToCreate);
            var contractCreated = _contractInterface.CreateContract(contractMap);

            if (contractCreated == null)
            {
                ModelState.AddModelError("", "Erreur lors de la création du programme.");
                return StatusCode(500, ModelState);
            }

            return Ok(contractCreated);
        }


        //READ
        [HttpGet("")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<Contracts>))]
        public IActionResult GetContracts()
        {
            var contracts = _contractInterface.GetContracts();
            

            if (!ModelState.IsValid) return BadRequest(ModelState);

            return Ok(contracts);
        }


        //UPDATE

        //DELETE
    }
}
