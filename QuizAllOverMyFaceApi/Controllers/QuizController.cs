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
    [Route("api/Quiz")]
    [ApiController]
    public class QuizController : ControllerBase
    {
        private readonly QuizAllOverMyFaceContext _context;
        private readonly IQuizService _quizService;

        public QuizController(QuizAllOverMyFaceContext context, IQuizService quizService)
        {
            _context = context;
            _quizService = quizService;
        }

        [HttpGet("HealthCheck")]
        public ActionResult<string> HealthCheck()
        {
            return "API up and running";
        }

        [HttpGet("GetExistingQuiz")]
        public async Task<Quiz> GetExistingQuiz([FromBody] string quizName)
        {
            return await _quizService.GetExistingQuiz(quizName);
        }

        [HttpPost("CreateQuiz")]
        public async Task<Quiz> CreateQuiz([FromBody] QuizViewModel viewModel)
        {
            return await _quizService.CreateNewQuiz(viewModel);
        }

        [HttpPost("ValidateGuid")]
        public async Task<bool> ValidateQuizGuid([FromBody] string guid)
        {
            return await _quizService.ValidateQuizGuid(guid);
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }

        [HttpGet("Nonsense")]
        public InviteTeamViewModel Nonsense()
        {
            return new InviteTeamViewModel();
        }
    }
}
