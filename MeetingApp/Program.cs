using MeetingApp.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using MeetingApp.Models.Domain;
using MeetingApp.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.OpenApi.Models;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

// Mody the AddSwaggerGen() call like so...
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "AscendionAPI", Version = "v1" });
    options.AddSecurityDefinition(JwtBearerDefaults.AuthenticationScheme, new OpenApiSecurityScheme
    {
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = JwtBearerDefaults.AuthenticationScheme
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = JwtBearerDefaults.AuthenticationScheme
                },
                Scheme = "Oauth2",
                Name = JwtBearerDefaults.AuthenticationScheme,
                In = ParameterLocation.Header
            },
            new List<string>()
        }
    });
});


builder.Services.AddSwaggerGen();


builder.Services.AddDbContext<ApplicationDbContext>(options=>options.UseSqlite("Data Source=app.db"));

//builder.Services.AddIdentityCore<IdentityUser>()
//    .AddRoles<IdentityRole>()
//    .AddTokenProvider<DataProtectorTokenProvider<IdentityUser>>("AscendionAPI")
//    .AddDefaultTokenProviders();

// Add JWT authentication
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>();
        options.TokenValidationParameters = new TokenValidationParameters
        {
            AuthenticationType = "Jwt",
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JwtSettings:Issuer"],

            ValidAudience = builder.Configuration["JwtSettings:Audience"],
            // or try this if the above does not work
            // ValidAudiences = new[] { builder.Configuration["Jwt:Audience"] }

            //IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.SecretKey))
        };



        // Customize the token retrieval
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                // Extract token directly from the Authorization header
                var token = context.Request.Headers["Authorization"].FirstOrDefault();
                if (!string.IsNullOrEmpty(token))
                {
                    context.Token = token.Substring(7); // Set the token without "Bearer" prefix
                }
                return Task.CompletedTask;
            }
        };
    });


// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", builder =>
    {
        builder.WithOrigins("http://localhost:4200") // Replace with your Angular app's URL
               .AllowAnyHeader()
               .AllowAnyMethod();
    });
});





var app = builder.Build();

app.UseCors("AllowAngularApp");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Enable authentication
app.UseAuthentication(); 

app.UseAuthorization();

app.MapControllers();

app.Run();
