﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using QuizAllOverMyFaceApi.Models;

namespace QuizAllOverMyFaceApi.Migrations
{
    [DbContext(typeof(QuizAllOverMyFaceContext))]
    partial class QuizAllOverMyFaceContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "3.1.3")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("QuizAllOverMyFaceApi.Models.Answer", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("AnswerString")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("QuestionNumber")
                        .HasColumnType("int");

                    b.Property<int?>("TeamAnswerId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("TeamAnswerId");

                    b.ToTable("Answers");
                });

            modelBuilder.Entity("QuizAllOverMyFaceApi.Models.Question", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("PointValue")
                        .HasColumnType("int");

                    b.Property<int>("QuestionNumber")
                        .HasColumnType("int");

                    b.Property<int>("RoundId")
                        .HasColumnType("int");

                    b.Property<string>("Wording")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("RoundId");

                    b.ToTable("Questions");
                });

            modelBuilder.Entity("QuizAllOverMyFaceApi.Models.Quiz", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("HostId")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("NumberOfRounds")
                        .HasColumnType("int");

                    b.Property<int?>("QuizHostId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("QuizHostId");

                    b.ToTable("Quizzes");
                });

            modelBuilder.Entity("QuizAllOverMyFaceApi.Models.QuizHost", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("UserName")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("QuizHosts");
                });

            modelBuilder.Entity("QuizAllOverMyFaceApi.Models.QuizTeam", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("EmailAddress")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Points")
                        .HasColumnType("int");

                    b.Property<Guid?>("QuizId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("TeamName")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("QuizId");

                    b.ToTable("QuizTeams");
                });

            modelBuilder.Entity("QuizAllOverMyFaceApi.Models.Round", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Category")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("NumberOfQuestions")
                        .HasColumnType("int");

                    b.Property<Guid?>("QuizId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.HasIndex("QuizId");

                    b.ToTable("Rounds");
                });

            modelBuilder.Entity("QuizAllOverMyFaceApi.Models.TeamAnswer", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("RoundId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("TeamAnswers");
                });

            modelBuilder.Entity("QuizAllOverMyFaceApi.Models.Answer", b =>
                {
                    b.HasOne("QuizAllOverMyFaceApi.Models.TeamAnswer", null)
                        .WithMany("Answers")
                        .HasForeignKey("TeamAnswerId");
                });

            modelBuilder.Entity("QuizAllOverMyFaceApi.Models.Question", b =>
                {
                    b.HasOne("QuizAllOverMyFaceApi.Models.Round", null)
                        .WithMany("Questions")
                        .HasForeignKey("RoundId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("QuizAllOverMyFaceApi.Models.Quiz", b =>
                {
                    b.HasOne("QuizAllOverMyFaceApi.Models.QuizHost", null)
                        .WithMany("ExistingQuizzes")
                        .HasForeignKey("QuizHostId");
                });

            modelBuilder.Entity("QuizAllOverMyFaceApi.Models.QuizTeam", b =>
                {
                    b.HasOne("QuizAllOverMyFaceApi.Models.Quiz", null)
                        .WithMany("Teams")
                        .HasForeignKey("QuizId");
                });

            modelBuilder.Entity("QuizAllOverMyFaceApi.Models.Round", b =>
                {
                    b.HasOne("QuizAllOverMyFaceApi.Models.Quiz", null)
                        .WithMany("Rounds")
                        .HasForeignKey("QuizId");
                });
#pragma warning restore 612, 618
        }
    }
}
