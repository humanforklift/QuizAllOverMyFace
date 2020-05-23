using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAllOverMyFaceApi.Models
{
    public class QuestionViewModel
    {
        public string QuestionText { get; set; }
        public int PointValue { get; set; }
        public int QuestionNumber { get; set; }
    }
}
