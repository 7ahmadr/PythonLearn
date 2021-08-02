using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;
using System.Web.Http;
using Microsoft.AspNetCore.Mvc;
using PythonLearn.Data;
using PythonLearn.Data.Context;
using PythonLearn.Data.Infrastructure;
using PythonLearn.Models;

namespace PythonLearn.Controllers
{
    public class HomeController : Controller
    {
        #region Cnt
        private readonly UnitOfWork<PyContext> _context;

        public HomeController(UnitOfWork<PyContext> context)
        {
            _context = context;
        }
        #endregion

        public ActionResult Index()
        {
            return View();
        }


        public IActionResult HomePage()
        {
            return View();
        }


        public IActionResult Privacy()
        {
            return View();
        }


        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

    }
}
