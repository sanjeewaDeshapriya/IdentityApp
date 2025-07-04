using Api.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<Api.Data.Context>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentityCore<User>(Options =>
{
    
    Options.Password.RequireDigit = false;
    Options.Password.RequiredLength = 6;
    Options.Password.RequireLowercase = false;
    Options.Password.RequireUppercase = false;
    Options.Password.RequireNonAlphanumeric = false;
   
    Options.SignIn.RequireConfirmedAccount = true;
}).
    AddRoles<IdentityRole>()
  .AddRoleManager<IdentityRole>()
  .AddEntityFrameworkStores<Api.Data.Context>()
  .AddSignInManager<SignInManager<User>>()
  .AddUserManager<UserManager<User>>()

  .AddDefaultTokenProviders();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
