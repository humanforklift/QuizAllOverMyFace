using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAllOverMyFaceApi.Models
{
    public class ChuckNorrisFact
    {
        public string Type { get; set; }

        public Value Value { get; set; }

    }

    public class Value
    {
        public int Id { get; set; }
        public string Joke { get; set; }
        public string[] Categories { get; set; }
    }
}
