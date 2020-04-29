using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using QuizAllOverMyFaceApi.SignalR;

namespace QuizAllOverMyFaceApi.Controllers
{
    [Route("api/QuizHub")]
    [ApiController]
    public class QuizHubController : ControllerBase
    {
        private readonly IQuizHub _quizHub;

        public QuizHubController(IQuizHub quizHub)
        {
            _quizHub = quizHub;
        }

        [HttpGet("Test")]
        public string Test()
        {
            return "This works";
        }

        [HttpPost("SetMessage")]
        public async Task SetClientMessage([FromBody] JsonElement json)
        {
            var message = JsonSerializer.Serialize(json.GetProperty("message"));
            await _quizHub.SendMessage(message.ToString());
        }

        [HttpPost("SetRoundName")]
        public async Task SetQuizHubRoundName([FromBody] string name)
        {
            await _quizHub.SendRoundName(name);
        }
    }
}
