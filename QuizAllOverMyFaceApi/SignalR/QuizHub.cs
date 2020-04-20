using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAllOverMyFaceApi.SignalR
{
    public class QuizHub : Hub, IQuizHub
    {
        protected IHubContext<QuizHub> _context;

        public QuizHub(IHubContext<QuizHub> context)
        {
            _context = context;
        }

        public async Task SendMessage(string message)
        {
            await _context.Clients.All.SendAsync("setClientMessage", message);
        }

        public async Task SendRoundName(string name)
        {
            await Clients.All.SendAsync("setRoundName", name);
        }

        public async Task SendQuestion1(string question)
        {
            await Clients.All.SendAsync("setQuestion1", question);
        }

        public async Task SendQuestion2(string question)
        {
            await Clients.All.SendAsync("setQuestion2", question);
        }

        public async Task SendQuestion3(string question)
        {
            await Clients.All.SendAsync("setQuestion3", question);
        }

        public async Task SendQuestion4(string question)
        {
            await Clients.All.SendAsync("setQuestion4", question);
        }

        public async Task SendQuestion5(string question)
        {
            await Clients.All.SendAsync("setQuestion5", question);
        }

        public async Task SendQuestion6(string question)
        {
            await Clients.All.SendAsync("setQuestion6", question);
        }

        public async Task SendQuestion7(string question)
        {
            await Clients.All.SendAsync("setQuestion7", question);
        }

        public async Task SendQuestion8(string question)
        {
            await Clients.All.SendAsync("setQuestion8", question);
        }

        public async Task SendQuestion9(string question)
        {
            await Clients.All.SendAsync("setQuestion9", question);
        }

        public async Task SendQuestion10(string question)
        {
            await Clients.All.SendAsync("setQuestion10", question);
        }
    }
}
