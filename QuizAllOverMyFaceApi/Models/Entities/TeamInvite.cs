using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAllOverMyFaceApi.Models.Entities
{
    public class TeamInvite
    {
        public int Id { get; set; }
        public string QuizId { get; set; }
        public Guid Guid { get; set; }
        public string EmailAddress { get; set; }
        public bool HasTeamRegistered { get; set; }
    }
}
