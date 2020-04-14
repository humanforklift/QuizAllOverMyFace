using Microsoft.Extensions.DependencyInjection;
using QuizAllOverMyFaceApi.Services;
using QuizAllOverMyFaceApi.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizAllOverMyFaceApi
{
    public static class DependencyInjection
    {
        public static IServiceCollection RegisterServices(this IServiceCollection services)
        {
            services.AddScoped<IQuizService, QuizService>();
            services.AddScoped<IQuizHostService, QuizHostService>();

            return services;
        }
    }
}
