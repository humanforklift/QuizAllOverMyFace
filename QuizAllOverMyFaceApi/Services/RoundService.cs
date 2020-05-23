using Microsoft.EntityFrameworkCore;
using QuizAllOverMyFaceApi.Models;
using QuizAllOverMyFaceApi.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAllOverMyFaceApi.Services
{
    public class RoundService : IRoundService
    {
        private readonly QuizAllOverMyFaceContext _context;

        public RoundService(QuizAllOverMyFaceContext context)
        {
            _context = context;
        }

        public async Task<RoundViewModel> GenerateEmptyRound(string quizId)
        {          
            var round = new Round
            {
                QuizId = new Guid(quizId),
                NumberOfQuestions = 0
            };

            _context.Rounds.Add(round);
            await _context.SaveChangesAsync();

            return new RoundViewModel { Id = round.Id };
        }

        public async Task AddRoundToQuiz(RoundViewModel viewModel)
        {
            var round = await _context.Rounds.SingleOrDefaultAsync(r => r.Id == viewModel.Id);

            round.Category = viewModel.Subject;
            round.NumberOfQuestions = viewModel.Questions.Count;
            round.Questions = viewModel.Questions.Select(q => new Question
            {
                RoundId = viewModel.Id,
                Wording = q.QuestionText,
                PointValue = q.PointValue,
                QuestionNumber = q.QuestionNumber
            }).ToList();

            await _context.SaveChangesAsync();
        }
    }
}
