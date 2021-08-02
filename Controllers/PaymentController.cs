using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PythonLearn.Data;
using PythonLearn.Data.Context;
using PythonLearn.Data.Infrastructure;

namespace PythonLearn.Controllers
{
    public class PaymentController : Controller
    {

        #region Cnt
        private readonly UnitOfWork<PyContext> _context;

        public PaymentController(UnitOfWork<PyContext> context)
        {
            _context = context;
        }
        #endregion


        public IActionResult Index()
        {
            return View("IndexPayment");
        }


        public IActionResult PaymentCompeleted()
        {
            return View();
        }


        public IActionResult PaymentFailed()
        {
            return View();
        }


        public IActionResult PaymentAlreadyDone()
        {
            return View();
        }


        public JsonResult GetAllPricing()
        {
            try
            {
                List<Pricing> Pr = _context.PricingRepository.GetAll();
                List<Path> Pth = _context.PathRepository.GetAll();
                List<Coupon> Cpn = _context.CouponRepository.GetAll();                  
                return Json(new
                {
                    state = "YES",
                    data = new { pricing = Pr, path = Pth, coupon = Cpn }
                });
            }
            catch (Exception ex)
            {

                return Json(new
                {
                    state = "NO",
                    msg = "نمایش تعرفه ها با خطا مواجه شد " + Environment.NewLine + ex.Message
                });
            }

        }
    }
}