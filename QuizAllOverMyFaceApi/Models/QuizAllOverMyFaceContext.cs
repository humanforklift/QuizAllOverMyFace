using Microsoft.EntityFrameworkCore;
using QuizAllOverMyFaceApi.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAllOverMyFaceApi.Models
{
    public class QuizAllOverMyFaceContext : DbContext
    {
        public QuizAllOverMyFaceContext()
        {

        }
        
        public QuizAllOverMyFaceContext(DbContextOptions<QuizAllOverMyFaceContext> options) : base(options)
        {
            //Database.EnsureCreated();
        }

        internal DbSet<Quiz> Quizzes { get; set; }
        internal DbSet<QuizHost> QuizHosts { get; set; }
        internal DbSet<QuizTeam> QuizTeams { get; set; }
        internal DbSet<Round> Rounds { get; set; }
        internal DbSet<Question> Questions { get; set; }
        internal DbSet<Answer> Answers { get; set; }
        internal DbSet<TeamAnswer> TeamAnswers { get; set; }
        internal DbSet<TeamInvite> TeamInvites { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<QuizHost>().HasMany(x => x.ExistingQuizzes);
            
            base.OnModelCreating(modelBuilder);
        }
    }
}
