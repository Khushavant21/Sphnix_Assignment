// Models/CubeDbContext.cs

using Microsoft.EntityFrameworkCore;

namespace CubeStore.Models
{
    public class CubeDbContext : DbContext
    {
        public CubeDbContext(DbContextOptions<CubeDbContext> options) : base(options) { }

        public DbSet<Cube> Cubes { get; set; }
    }
}
