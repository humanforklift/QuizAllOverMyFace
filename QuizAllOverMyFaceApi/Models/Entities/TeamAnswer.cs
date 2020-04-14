using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAllOverMyFaceApi.Models
{
    public class TeamAnswer
    {
        public int Id { get; set; }
        public int RoundId { get; set; }
        public List<Answer> Answers{ get; set; }
    }
}
