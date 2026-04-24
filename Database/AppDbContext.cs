using Microsoft.EntityFrameworkCore;

namespace Movie_Ticket.Database
{
  public class AppDbContext : DbContext
  {
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }
  }
}
