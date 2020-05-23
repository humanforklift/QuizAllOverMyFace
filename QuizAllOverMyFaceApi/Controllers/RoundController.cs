using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuizAllOverMyFaceApi.Models;
using QuizAllOverMyFaceApi.Services.Interfaces;

namespace QuizAllOverMyFaceApi.Controllers
{
    [Route("api/Round")]
    [ApiController]
    public class RoundController : ControllerBase
    {
        private readonly QuizAllOverMyFaceContext _context;
        private readonly IRoundService _roundService;
        private readonly IQuizService _quizService;

        public RoundController(QuizAllOverMyFaceContext context, IRoundService roundService, IQuizService quizService)
        {
            _context = context;
            _roundService = roundService;
            _quizService = quizService;
        }

        [HttpPost("GenerateEmptyRound")]
        public async Task<RoundViewModel> GenerateEmptyRound([FromBody] string quizId)
        {
            if (! await _quizService.QuizGuidIsValid(quizId))
            {
                throw new Exception("Quiz does not exist");
            }
            
            return await _roundService.GenerateEmptyRound(quizId);
        }

        //TODO - look at changing return type to viewModel instead of entity
        [HttpPost("AddRound")]
        public async Task<ActionResult> AddRound([FromBody] RoundViewModel viewModel)
        {
            await _roundService.AddRoundToQuiz(viewModel);

            return Ok();
        }
    }
}
