using QuizAllOverMyFaceApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAllOverMyFaceApi.Services.Interfaces
{
    public interface IRoundService
    {
        Task AddRoundToQuiz(RoundViewModel viewModel);
        Task<RoundViewModel> GenerateEmptyRound(string quizId);
    }
}
