using QuizAllOverMyFaceApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAllOverMyFaceApi.Services.Interfaces
{
    public interface IQuizHostService
    {
        Task<QuizHost> GetOrCreateQuizHost(string hostName);
    }
}
