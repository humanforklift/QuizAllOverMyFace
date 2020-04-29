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
        private readonly IEmailService _emailService;

        public QuizController(QuizAllOverMyFaceContext context, IQuizService quizService, IEmailService emailService)
        {
            _context = context;
            _quizService = quizService;
            _emailService = emailService;
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

        [HttpPost("RegisterTeam")]
        public async Task<QuizTeam> RegisterQuizTeam([FromBody] string teamName)
        {
            return await _quizService.RegisterQuizTeam(teamName);
        }

        [HttpGet("ChuckNorrisFact")]
        public async Task<string> GetChuckNorrisFact()
        {
            return await _quizService.GetChuckNorrisFact();
        }

        [HttpPost("InviteTeam")]
        public async Task<ActionResult> InviteTeams([FromBody] TeamInviteRequest request)
        {
            var errors = await _emailService.InviteTeams(request.QuizId, request.EmailAddresses);

            if (errors.Count > 0)
            {
                throw new Exception("There was an error inviting teams");
            }

            return Ok();
        }

        [HttpGet("Nonsense")]
        public InviteTeamViewModel Nonsense()
        {
            return new InviteTeamViewModel();
        }
    }
}
