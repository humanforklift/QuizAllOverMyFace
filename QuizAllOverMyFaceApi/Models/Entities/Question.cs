using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAllOverMyFaceApi.Models
{
    public class Question
    {
        public int Id { get; set; }
        public int RoundId { get; set; }
        public int QuestionNumber { get; set; }
        public int PointValue { get; set; }
        public string Wording { get; set; }
    }
}
