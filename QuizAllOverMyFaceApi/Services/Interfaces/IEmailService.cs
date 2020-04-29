using SendGrid;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAllOverMyFaceApi.Services.Interfaces
{
    public interface IEmailService
    {
        Task<List<string>> InviteTeams(string quizId, List<string> emailAddresses);
    }
}
