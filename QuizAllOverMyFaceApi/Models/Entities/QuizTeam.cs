using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAllOverMyFaceApi.Models
{
    public class QuizTeam
    {
        public int Id { get; set; }
        public string EmailAddress { get; set; }
        public string TeamName { get; set; }
        public int Points { get; set; }

    }
}
