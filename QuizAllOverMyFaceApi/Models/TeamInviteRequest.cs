using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAllOverMyFaceApi.Models
{
    public class TeamInviteRequest
    {
        public string QuizId { get; set; }
        public List<string> EmailAddresses { get; set; }
    }
}
