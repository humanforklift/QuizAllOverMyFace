using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAllOverMyFaceApi.SignalR
{
    public interface IQuizHub
    {
        Task SendMessage(string message);

        Task SendRoundName(string name);

        Task SendQuestion1(string question);

        Task SendQuestion2(string question);

        Task SendQuestion3(string question);

        Task SendQuestion4(string question);

        Task SendQuestion5(string question);

        Task SendQuestion6(string question);

        Task SendQuestion7(string question);

        Task SendQuestion8(string question);

        Task SendQuestion9(string question);

        Task SendQuestion10(string question);
    }
}
