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


        // CREATE
        [HttpGet]
        public IActionResult Add()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Add(Book book)
        {
            if (ModelState.IsValid)
            {
                _context.Books.Add(book);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(book);
        }
        // UPDATE
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var book = _context.Books.Find(id);
            return View(book);
        }

        [HttpPost]
        public IActionResult Edit(Book book)
        {
            if (ModelState.IsValid)
            {
                _context.Books.Update(book);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(book);
        }
        // DELETE
        [HttpGet]
        public IActionResult Delete(int id)
        {
            var book = _context.Books.Find(id);
            return View(book);
        }

        [HttpPost, ActionName("Delete")]
        public IActionResult DeleteConfirmed(int id)
        {
            var book = _context.Books.Find(id);
            _context.Books.Remove(book);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

    }
}
