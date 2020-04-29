using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAllOverMyFaceApi.Models
{
    public class QuizHost
    {
        public int Id { get; set; }
        public string UserName { get; set; }

        public List<Quiz> ExistingQuizzes { get; set; }
    }
}
