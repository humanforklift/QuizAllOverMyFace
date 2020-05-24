using Microsoft.Extensions.Configuration;
using QuizAllOverMyFaceApi.Models;
using QuizAllOverMyFaceApi.Models.Entities;
using QuizAllOverMyFaceApi.Services.Interfaces;
using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace QuizAllOverMyFaceApi.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly QuizAllOverMyFaceContext _context;

        public EmailService(IConfiguration configuration, QuizAllOverMyFaceContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        public async Task<List<string>> InviteTeams(string quizId, List<string> emailAddresses)
        {
            var errors = new List<string>();
            foreach (var email in emailAddresses)
            {
                var url = await GenerateInviteLink(quizId, email);
                var response = await SendEmail(url, email);

                if (response.StatusCode != HttpStatusCode.Accepted)
                {
                    errors.Add(response.Body.ReadAsStringAsync().Result);
                }
            }
            return errors;
        }

        private async Task<Response> SendEmail(string link, string emailAddress)
        {
            var apiKey = _configuration.GetSection("SENDGRID_API_KEY").Value;
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress("registerQuizTeam@QuizAllOverMyFace.com", "Register Quiz Team");
            var recipient = new EmailAddress(emailAddress);

            var subject = "You've been invited to a quiz :)";
            var plainTextContent = "Please follow the link below to register your team:";
            var htmlContent = $"<a href={link}>{link}</a>";
            var displayRecipients = false;
            var msg = MailHelper.CreateSingleEmail(from, recipient, subject, plainTextContent, htmlContent);
            return await client.SendEmailAsync(msg);
        }

        private async Task<string> GenerateInviteLink(string quizId, string emailAddress)
        {
            var url = $"{_configuration.GetValue<string>("UI_BASE_URL")}register-for-quiz";
            var guid = Guid.NewGuid();

            var teamInvite = new TeamInvite
            {
                EmailAddress = emailAddress,
                QuizId = quizId,
                Guid = guid,
                HasTeamRegistered = false
            };

            _context.TeamInvites.Add(teamInvite);
            await _context.SaveChangesAsync();

            url = $"{url}/{quizId}/{guid}";
            return url;
        }

        //private async Task EnsureDuplicateInvitesNotSent()
        //{

        //}
    }
}
