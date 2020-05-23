using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace QuizAllOverMyFaceApi.Migrations
{
    public partial class AddedGuidColumnToTeamInviteTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Quizzes_QuizHosts_QuizHostId",
                table: "Quizzes");

            migrationBuilder.AddColumn<Guid>(
                name: "Guid",
                table: "TeamInvites",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AlterColumn<int>(
                name: "QuizHostId",
                table: "Quizzes",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Quizzes_QuizHosts_QuizHostId",
                table: "Quizzes",
                column: "QuizHostId",
                principalTable: "QuizHosts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Quizzes_QuizHosts_QuizHostId",
                table: "Quizzes");

            migrationBuilder.DropColumn(
                name: "Guid",
                table: "TeamInvites");

            migrationBuilder.AlterColumn<int>(
                name: "QuizHostId",
                table: "Quizzes",
                type: "int",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddForeignKey(
                name: "FK_Quizzes_QuizHosts_QuizHostId",
                table: "Quizzes",
                column: "QuizHostId",
                principalTable: "QuizHosts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
