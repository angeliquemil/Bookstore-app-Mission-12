using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Books.API.Data;

namespace Books.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private BookDbContext _context;

        public Book(BookControllerDbContext temp) => _context = temp;

        [HttpGet("AllProjects")]
        public IEnumerable<Project> GetProjects()
        {
            var something = _context.Projects.ToList();

            return something;
        }

        [HttpGet("FunctionalProjects")]
        public IEnumerable<Project> GetFunctionalProjects()
        {
            var something = _bookcontext.Projects.Where(p => p.ProjectFunctionalityStatus == "Functional").ToList();
            return something;
        }

    }
}