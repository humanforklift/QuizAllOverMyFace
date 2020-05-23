using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAllOverMyFaceApi.Models
{
    public class Round
    {
        public int Id { get; set; }
        public string Category { get; set; }
        public int NumberOfQuestions { get; set; }
        public List<Question> Questions { get; set; }

        public Guid QuizId { get; set; }
        public Quiz Quiz { get; set; }
    }
}
