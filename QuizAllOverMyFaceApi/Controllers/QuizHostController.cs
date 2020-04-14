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
    [Route("api/QuizHost")]
    [ApiController]
    public class QuizHostController : ControllerBase
    {

        private readonly IQuizHostService _quizHostService;
        public QuizHostController(IQuizHostService quizHostService)
        {
            _quizHostService = quizHostService;
        }

        [HttpGet("GetOrCreateHost")]
        public async Task<QuizHost> GetOrCreateQuizHost([FromBody] string hostName)
        {
            return await _quizHostService.GetOrCreateQuizHost(hostName);
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
