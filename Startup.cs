using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using PythonLearn.Models;
using PythonLearn.Data.Context;
using PythonLearn.Data.Infrastructure;
using PythonLearn.Data.Entity;
using PythonLearn.Authentication;
using PythonLearn.Authentication.Services;
using Microsoft.AspNetCore.Authorization;
using PythonLearn.Authentication.Permissions;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace PythonLearn
{
    public class Startup
    {
        private readonly IConfiguration Configuration;
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }



        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // configure strongly typed settings objects
            var appSettingsSection = Configuration.GetSection("AppSettings");
            services.Configure<AppSetting>(appSettingsSection);

            // configure jwt authentication
            AppSetting appSet = appSettingsSection.Get<AppSetting>();

            //services.AddIdentity<ExternalUser, IdentityRole>()
            //        .AddEntityFrameworkStores<PyContext>()
            //        .AddDefaultTokenProviders();

            services.pyExternalAuthentication();
            services.pyAuthentication(appSet.Secret);

            services.AddControllersWithViews();
            services.AddControllersWithViews().AddRazorRuntimeCompilation();
            pyConString.Value = Configuration.GetConnectionString("PyConnectionString");

            //Dipendency Injection
            services.AddTransient<UnitOfWork<PyContext>>();
            services.AddScoped<IUserService, UserService>();
            services.AddSingleton<IAuthorizationPolicyProvider, AuthorizationPolicyProvider>();

            //services.AddDbContext <ExternalContext>(options => options.UseSqlServer(pyConString.Value));
            services.AddDbContext<PyContext>();
            //services.AddMvc();


            services.AddCors(o => o.AddPolicy("MyPolicy", builder =>
            {
                builder.AllowAnyOrigin()
                       .AllowAnyMethod()
                       .AllowAnyHeader();
            }));
        }


        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts();
            }
            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}/{lid?}");
            });
        }
    }
}
