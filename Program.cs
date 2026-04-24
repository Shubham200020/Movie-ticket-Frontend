using Microsoft.EntityFrameworkCore;
using Movie_Ticket.Database;

var builder = WebApplication.CreateBuilder(args);

// PostgreSQL connection



builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

var app = builder.Build();

app.MapGet("/", () => "PostgreSQL Connected 🚀");


app.MapGet("/check-db", async (AppDbContext db) =>
{
  var canConnect = await db.Database.CanConnectAsync();
  return canConnect ? "✅ Connected" : "❌ Failed";
});





app.Run();
