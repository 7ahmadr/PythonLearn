using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
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


        public IActionResult OnlinePayCallBack(int id)
        {
            if (HttpContext.Request.Query["Status"] != "" &&
    HttpContext.Request.Query["Status"].ToString().ToLower() == "ok" &&
    HttpContext.Request.Query["Authority"] != "")
            {
                var sdf = "";
                //string authority = HttpContext.Request.Query["Authority"].ToString();
                //var payment = new ZarinpalSandbox.Payment(12000);
                //var res = payment.Verification(authority).Result;
                //if (res.Status == 100)
                //{
                //    ViewBag.code = res.RefId;
                //    return View();
                //}

            }

            return NotFound();
        }
    }
}
