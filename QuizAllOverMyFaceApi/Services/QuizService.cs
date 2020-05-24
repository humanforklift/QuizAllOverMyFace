using Microsoft.EntityFrameworkCore;
using QuizAllOverMyFaceApi.Models;
using QuizAllOverMyFaceApi.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
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

        public async Task<Quiz> GetQuizById(string quizId)
        {
            Guid.TryParse(quizId, out var result);
            if (result != Guid.Empty)
            {
                return await _context.Quizzes.Where(q => q.Id == result)
                    .Include(q => q.Teams)
                    .Include(q => q.Rounds)
                    .SingleOrDefaultAsync();
            }
            return null;
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
                QuizHost = host,
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

        public async Task<QuizTeam> RegisterQuizTeam(string teamName)
        {
            var team = new QuizTeam
            {
                TeamName = teamName
            };

            _context.QuizTeams.Add(team);
            await _context.SaveChangesAsync();

            return team;
        }

        public async Task<string> GetChuckNorrisFact()
        {
            var client = new HttpClient();
            var url = "http://api.icndb.com/jokes/random";

            var response = await client.GetAsync(url);
            
            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                var chuckNorrisFact = Newtonsoft.Json.JsonConvert.DeserializeObject<ChuckNorrisFact>(content);
                return RemoveStringCharacters(chuckNorrisFact.Value.Joke);
            }

            return "Chuck Norris is watching you";
        }

        public async Task<bool> QuizGuidIsValid(string quizId)
        {
            return await _context.Quizzes.AnyAsync(q => q.Id == new Guid(quizId));
        }

        private string RemoveStringCharacters(string original)
        {
            return original.Replace("&quot", "");
        }
    }
}
