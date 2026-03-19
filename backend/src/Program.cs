//tu as change les studentId de bill par permanentcode
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using MyUAAcademiaB;
using MyUAAcademiaB.Data;
using MyUAAcademiaB.Helper;
using MyUAAcademiaB.Interfaces;
using MyUAAcademiaB.Repository;
using MyUAAcademiaB.Services;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);
var frontendUrl = builder.Configuration["FRONTEND_URL"];
var httpPass = builder.Configuration["HTTPS_PASS"];
var httpFile = builder.Configuration["HTTPS_FILE"];
var port = builder.Configuration["PORT"];

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenLocalhost(int.Parse(port), listenOptions =>
    {
        listenOptions.UseHttps(httpFile, httpPass);
    });
});


// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddTransient<Seed>();

//Object Cycle Error
builder.Services.AddControllers().AddJsonOptions(x =>
    x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

//Auto Mappwer
builder.Services.AddAutoMapper(cfg => { }, typeof(MappingProfiles));

//Repository
builder.Services.AddScoped<IBillInterface, BillRepository>();
builder.Services.AddScoped<IBulletinInterface, BulletinRepository>();
builder.Services.AddScoped<IEmployeeInterface, EmployeeRepository>();
builder.Services.AddScoped<IClasseInterface, ClasseRepository>();
builder.Services.AddScoped<IClasseCourseInterface, ClasseCourseRepository>();
builder.Services.AddScoped<ICourseInterface, CourseRepository>();
builder.Services.AddScoped<IProgramInterface, ProgramRepository>();
builder.Services.AddScoped<IUserInterface, UserRepository>();
builder.Services.AddScoped<IUserCourseInterface, UserCourseRepository>();
builder.Services.AddScoped<IUserProgramInterface, UserProgramRepository>();

//Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IBillService, BillService>();
builder.Services.AddScoped<IBulletinService, BulletinService>();
builder.Services.AddScoped<IClasseCourseService, ClasseCourseService>();
builder.Services.AddScoped<IEmployeeService, EmployeeService>();
builder.Services.AddScoped<ISchoolReportService, SchoolReportService>();
builder.Services.AddScoped<IFileService, FileService>();
builder.Services.AddScoped<IUserProgramService, UserProgramService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<JwtService>();
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Issuer"],
            ValidAudience = builder.Configuration["Issuer"],//builder.Configuration["Audience"),
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Key"]))
        };

        // Permet de lire le JWT depuis le cookie SESSION_ID
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                if (context.Request.Cookies.ContainsKey("SESSION_ID"))
                {
                    context.Token = context.Request.Cookies["SESSION_ID"];
                }
                return Task.CompletedTask;
            },
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine($"Auth failed: {context.Exception.Message}");
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                Console.WriteLine("Token validé avec succès");
                return Task.CompletedTask;
            }

        };
    });
builder.Services.AddAuthorization();


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "MYUAA API",
        Version = "v1"
    });

    //c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    //{
    //    Description = "Collez ici votre token JWT (ex: Bearer 12345abcdef)",
    //    Name = "Authorization",
    //    In = ParameterLocation.Header,
    //    Type = SecuritySchemeType.ApiKey,
    //    Scheme = "Bearer"
    //});

    //c.AddSecurityRequirement(new OpenApiSecurityRequirement {
    //{
    //    new OpenApiSecurityScheme {
    //        Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
    //    },
    //    new string[] { }
    //}});
});

// Configurer CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", builder =>
    {
        builder.WithOrigins(frontendUrl)
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials();
    });
});

var connectionString = builder.Configuration["DefaultConnection"]
                       ?? builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<DataContext>(options =>
{
    options.UseSqlServer(connectionString);
});

builder.Logging.AddConsole();
builder.Logging.AddDebug();

var app = builder.Build();

if (args.Length == 1 && args[0].ToLower() == "seeddata")
    SeedData(app);

void SeedData(IHost app)
{
    var scopedFactory = app.Services.GetService<IServiceScopeFactory>();
    using (var scope = scopedFactory.CreateScope())
    {
        var service = scope.ServiceProvider.GetService<Seed>();
        service.SeedDataContext();
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "MYUAA API v1");
    });
}

app.UseHttpsRedirection();
app.UseCors("AllowSpecificOrigin");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "Uploads")
    ),
    RequestPath = "/Uploads"
});
app.Run();
