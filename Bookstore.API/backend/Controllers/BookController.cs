using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BookstoreApi.Data;
using BookstoreApi.Models;

namespace BookstoreApi.Controllers
{
    [Route("Book")]
    public class BookController : Controller
    {
        private BookDbContext _context;

        public BookController(BookDbContext context) => _context = context;

        [HttpGet("AllBooks")]
        public IEnumerable<Book> GetBooks()
        {
            var books = _context.Books.ToList();

            return books;
        }

        [HttpGet("FunctionalBooks")]
        public IEnumerable<Book> GetFunctionalBooks()
        {
            var books = _context.Books.Where(b => b.Title != null).ToList(); // Adjust condition as needed
            return books;
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
