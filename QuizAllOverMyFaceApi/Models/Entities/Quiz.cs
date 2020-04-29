using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAllOverMyFaceApi.Models
{
    public class Quiz
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public int NumberOfRounds { get; set; }
        public List<Round> Rounds { get; set; }
        public List<QuizTeam> Teams { get; set; }

        public int QuizHostId { get; set; }
        public QuizHost QuizHost { get; set; }

    }
}
