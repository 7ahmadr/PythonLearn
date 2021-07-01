using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace PythonLearn.Controllers
{
    public class PaymentController : Controller
    {
        public IActionResult Index()
        {
            return View("IndexPayment");
        }
    }
}