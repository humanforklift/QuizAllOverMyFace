using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAllOverMyFaceApi.Models
{
    public class Answer
    {
        public int Id { get; set; }
        public int QuestionNumber { get; set; }
        public string AnswerString { get; set; }
    }
}
