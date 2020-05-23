using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAllOverMyFaceApi.Models
{
    public class RoundViewModel
    {
        public int Id { get; set; }
        public string Subject { get; set; }
        public List<QuestionViewModel> Questions { get; set; }
        public int? QuizId { get; set; }
    }
}
