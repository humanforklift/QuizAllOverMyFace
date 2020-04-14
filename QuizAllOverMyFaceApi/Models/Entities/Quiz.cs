using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAllOverMyFaceApi.Models
{
    public class Quiz
    {
        public Guid Id { get; set; }
        public int HostId { get; set; }
        public string Name { get; set; }
        public int NumberOfRounds { get; set; }
        public List<Round> Rounds { get; set; }
        public List<QuizTeam> Teams { get; set; }

    }
}
