using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAllOverMyFaceApi.Migrations
{
    public partial class UpdatedRoundClassToDefineRelationshipWithQuizClass : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Rounds_Quizzes_QuizId",
                table: "Rounds");

            migrationBuilder.AlterColumn<Guid>(
                name: "QuizId",
                table: "Rounds",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Rounds_Quizzes_QuizId",
                table: "Rounds",
                column: "QuizId",
                principalTable: "Quizzes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Rounds_Quizzes_QuizId",
                table: "Rounds");

            migrationBuilder.AlterColumn<Guid>(
                name: "QuizId",
                table: "Rounds",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid));

            migrationBuilder.AddForeignKey(
                name: "FK_Rounds_Quizzes_QuizId",
                table: "Rounds",
                column: "QuizId",
                principalTable: "Quizzes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
