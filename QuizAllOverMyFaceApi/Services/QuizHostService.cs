using Microsoft.EntityFrameworkCore;
using QuizAllOverMyFaceApi.Models;
using QuizAllOverMyFaceApi.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAllOverMyFaceApi.Services
{
    public class QuizHostService : IQuizHostService
    {
        private readonly QuizAllOverMyFaceContext _context;

        public QuizHostService(QuizAllOverMyFaceContext context)
        {
            _context = context;
        }

        public async Task<QuizHost> GetOrCreateQuizHost(string hostName)
        {
            var host = await _context.QuizHosts.SingleOrDefaultAsync(h => h.UserName == hostName);

            if (host == null)
            {
                host = await CreateQuizHost(hostName);
            }

            return host;
        }

        private async Task<QuizHost> CreateQuizHost(string hostName)
        {
            var host = new QuizHost
            {
                UserName = hostName
            };

            _context.QuizHosts.Add(host);
            await _context.SaveChangesAsync();

            return host;
        }
    }
}
