using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace QuizAllOverMyFaceApi.Controllers
{
    [Route("api/Quiz")]
    [ApiController]
    public class QuizController : ControllerBase
    {
        // GET: api/StartNewQuiz
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/StartNewQuiz/5
        [HttpGet("{id}", Name = "Get")]
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/StartNewQuiz
        [HttpPost("StartNew")]
        public Guid Post()
        {
            var quizId = Guid.NewGuid();
            return quizId;
        }

        // PUT: api/StartNewQuiz/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
