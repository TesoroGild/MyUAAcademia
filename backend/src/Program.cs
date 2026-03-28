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
using System.Security.Claims;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);
var frontendUrl = builder.Configuration["FRONTEND_URL"];

// 1. Config Kestrel (port, HTTP vs HTTPS)
builder.WebHost.ConfigureKestrel(options =>
{
    var port = int.Parse(Environment.GetEnvironmentVariable("PORT") ?? "8080");

    if (builder.Environment.IsDevelopment())
    {
        var httpPass = builder.Configuration["HTTPS_PASS"];
        var httpFile = builder.Configuration["HTTPS_FILE"];

        options.ListenLocalhost(port, listenOptions =>
        {
            listenOptions.UseHttps(httpFile, httpPass);
        });
    }
    else
    {
        options.Listen(System.Net.IPAddress.Any, port);
    }
});

// 2. Controllers + JSON
builder.Services.AddControllers().AddJsonOptions(x =>
    x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

// 3. AutoMapper
builder.Services.AddAutoMapper(cfg => { }, typeof(MappingProfiles));

// Add services to the container.
//builder.Services.AddTransient<Seed>();

// 4. Repositories
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
builder.Services.AddScoped<IContractInterface, ContractRepository>();

// 5. Services
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

// 6. Auth JWT
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            RoleClaimType = ClaimTypes.Role,
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Issuer"],
            ValidAudience = builder.Configuration["Issuer"],//builder.Configuration["Audience"]),
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Key"]))
        };

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


// 7. Swagger
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

// 8. CORS (un seul bloc, une seule politique)
//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowSpecificOrigin", builder =>
//    {
//        builder.WithOrigins(frontendUrl)
//               .AllowAnyHeader()
//               .AllowAnyMethod()
//               .AllowCredentials();
//    });
//});
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(frontendUrl)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// 9. Base de données
builder.Services.AddDbContext<DataContext>(options =>
{
    if (builder.Environment.IsDevelopment())
    {
        options.UseSqlServer(
            builder.Configuration.GetConnectionString("DefaultConnection"),
            x => x.MigrationsAssembly("MyUAAcademiaB")
        );
    }
    else
    {
        var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
        var uri = new Uri(databaseUrl);
        var userInfo = uri.UserInfo.Split(':');
        var npgsqlConn = $"Host={uri.Host};Port={uri.Port};Database={uri.AbsolutePath.TrimStart('/')};Username={userInfo[0]};Password={userInfo[1]}";

        options.UseNpgsql(npgsqlConn, x =>
        {
            x.MigrationsAssembly("MyUAAcademiaB");
            x.MigrationsHistoryTable("__EFMigrationsHistory", "myuaacademia");
        }).UseSnakeCaseNamingConvention();
    }
});

// 10. Logging
builder.Logging.AddConsole();
builder.Logging.AddDebug();

// ══════════════════════════════════════════
var app = builder.Build(); // séparation config / pipeline
// ══════════════════════════════════════════

// Seed
//if (args.Length == 1 && args[0].ToLower() == "seeddata")
//    SeedData(app);

//void SeedData(IHost app)
//{
//    var scopedFactory = app.Services.GetService<IServiceScopeFactory>();
//    using var scope = scopedFactory.CreateScope();
//    scope.ServiceProvider.GetService<Seed>().SeedDataContext();
//}

// 11. Swagger UI
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "MYUAA API v1");
});

// 12. Uploads (statique, avant les controllers)
var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
if (!Directory.Exists(uploadsPath))
{
    Directory.CreateDirectory(uploadsPath);
}

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsPath),
    RequestPath = "/Uploads"
});

// 13. CORS (avant auth — pour gérer le preflight OPTIONS)
app.UseCors();

// 14. Auth (dans le bon ordre : d'abord identifier, ensuite autoriser)
app.UseAuthentication();
app.UseAuthorization();

// 15. Controllers
app.MapControllers();

// 16. HTTPS redirection (en dev uniquement, car en prod c'est géré par le reverse proxy)
if (app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// 17. Envoie des migrations vers postgreSQL en prod
if (!app.Environment.IsDevelopment()) // Si on est sur Railway
{
    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<DataContext>();
        db.Database.Migrate();
    }
}

app.Run();
