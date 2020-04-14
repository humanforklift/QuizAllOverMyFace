using Microsoft.EntityFrameworkCore;
using QuizAllOverMyFaceApi.Models;
using QuizAllOverMyFaceApi.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAllOverMyFaceApi.Services
{
    public class QuizService : IQuizService
    {
        private readonly QuizAllOverMyFaceContext _context;
        private readonly IQuizHostService _quizHostService;

        public QuizService(QuizAllOverMyFaceContext context, IQuizHostService quizHostService)
        {
            _context = context;
            _quizHostService = quizHostService;
        }

        public async Task<Quiz> GetExistingQuiz(string quizName)
        {
            return await _context.Quizzes.SingleOrDefaultAsync(q => q.Name == quizName);
        }

        public async Task<Quiz> CreateNewQuiz(QuizViewModel viewModel)
        {
            var host = await _quizHostService.GetOrCreateQuizHost(viewModel.QuizHostName);

            var quiz = new Quiz
            {
                Id = Guid.NewGuid(),
                HostId = host.Id,
                Name = viewModel.QuizName,
                //NumberOfRounds = viewModel.NumberOfRounds
            };

            _context.Quizzes.Add(quiz);
            await _context.SaveChangesAsync();

            return quiz;
        }

        public async Task<bool> ValidateQuizGuid(string guid)
        {
            Guid.TryParse(guid, out var result);
            if (result != Guid.Empty)
            {
                return await _context.Quizzes.AnyAsync(q => q.Id == result);
            }
            return false;            
        }
    }
}
