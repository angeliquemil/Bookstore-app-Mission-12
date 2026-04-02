using Bookstore.Controllers;
using Microsoft.EntityFrameworkCore;

namespace Bookstore.Data;

public class BookDbContext: DbContext
{
    public BookDbContext(DbContextOptions<BookDbContext> options) : base(options)
    {
    }
    
    public DbSet<Book> Books { get; set; }
}