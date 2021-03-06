﻿using QuizAllOverMyFaceApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAllOverMyFaceApi.Services.Interfaces
{
    public interface IQuizService
    {
        Task<Quiz> GetExistingQuiz(string quizName);
        Task<Quiz> CreateNewQuiz(QuizViewModel viewModel);
        Task<bool> ValidateQuizGuid(string guid);
    }
}
