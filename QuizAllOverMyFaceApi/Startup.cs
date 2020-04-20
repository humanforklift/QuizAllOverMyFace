using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using QuizAllOverMyFaceApi.Models;
using QuizAllOverMyFaceApi.SignalR;

namespace QuizAllOverMyFaceApi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            var connection = Configuration.GetConnectionString("QuizAllOverMyFace");

            services.AddDbContext<QuizAllOverMyFaceContext>(opt =>
                opt.UseSqlServer(connection));


            services.AddSignalR();

            services.AddControllers();

            services.RegisterServices();

            // Register Swagger services
            services.AddSwaggerDocument();

            services.AddCors(options =>
            {
                options.AddDefaultPolicy(builder =>
                {
                    //builder.WithOrigins("http://localhost:3000")
                    //.AllowAnyMethod()
                    //.AllowAnyHeader();
                    builder.AllowAnyMethod()
                    .AllowAnyHeader()
                    .SetIsOriginAllowed((host) => true)
                    .AllowCredentials();


                    builder.WithOrigins("https://quizallovermyface.z8.web.core.windows.net/")
                    .AllowAnyMethod()
                    .AllowAnyHeader();
                });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IHostApplicationLifetime hostApplicationLifetime)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseCors();

            app.UseRouting();

            app.UseAuthorization();


            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHub<QuizHub>("/quiz");

                endpoints.MapControllers();
            });

            hostApplicationLifetime.ApplicationStarted.Register(() =>
            {
                var serviceProvider = app.ApplicationServices;
                var quizHub = (IHubContext<QuizHub>)serviceProvider.GetService(typeof(IHubContext<QuizHub>));
            });

            app.UseOpenApi();
            app.UseSwaggerUi3();
        }
    }
}
