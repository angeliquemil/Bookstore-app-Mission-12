using BookstoreApi.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddDbContext<BookDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("BookstoreConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .SetIsOriginAllowed(IsAllowedOrigin)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

static bool IsAllowedOrigin(string? origin)
{
    if (string.IsNullOrEmpty(origin) || !Uri.TryCreate(origin, UriKind.Absolute, out var uri))
    {
        return false;
    }

    if (uri.Host == "localhost" && (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps))
    {
        return true;
    }

    if (uri.Host.EndsWith(".azurestaticapps.net", StringComparison.OrdinalIgnoreCase) &&
        uri.Scheme == Uri.UriSchemeHttps)
    {
        return true;
    }

    return false;
}

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
}

app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();

app.Run();

internal class BookDbContext : DbContext
{
    public BookDbContext(DbContextOptions<BookDbContext> options) : base(options)
    {
    }

    public object Books { get; internal set; }
}