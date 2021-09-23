using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PythonLearn.Authentication;
using PythonLearn.Authentication.Services;
using PythonLearn.Data;
using PythonLearn.Data.Context;
using PythonLearn.Data.Infrastructure;
using PythonLearn.Models;
using Zarinpal;

namespace PythonLearn.Controllers
{
    [Microsoft.AspNetCore.Mvc.Route("api/payment")]
    [ApiController]
    public class PaymentApiController : Controller
    {

        #region Cnt
        private readonly IUserService _userService;
        private readonly UnitOfWork<PyContext> _context;
        private readonly SignInManager<ExternalUser> _signInManager;
        private readonly string _MerchantID = "89fc41f1-0241-4dc7-b086-ab8dd701a757";

        public PaymentApiController(IUserService userService, UnitOfWork<PyContext> context, SignInManager<ExternalUser> signInManager)
        {
            _userService = userService;
            _context = context;
            _signInManager = signInManager;
        }
        #endregion



        [Microsoft.AspNetCore.Mvc.HttpGet("PayForLesson/{PID}/{EMail}/{Cost}/{Month}/{UserCoupon}/{CouponCost}")]
        public IActionResult PayForLesson(int PID, string EMail, int Cost, int Month, string UserCoupon, int CouponCost)
        {
            //var payment = new Payment(Cost);      //for sandbox
            var payment = new Payment(_MerchantID, Cost);

            EMail = EMail.ToLower();
            User u = _context.UserRepository.Get(u => u.Username.ToLower() == EMail);
            if (u is null)
                return RedirectToAction("PaymentFailed", "Payment");

            Path p = _context.PathRepository.Get(p => p.ID == PID);
            string PathName = p.Name;
            string PathPerm = p.Permission;
            string Mobile = u.Mobile;

            if (u.Permissions.ToString().Contains(PathPerm))
                return RedirectToAction("PaymentAlreadyDone", "Payment");

            var res = payment.PaymentRequest($"پرداخت فاکتور  جهت ثبت نام در دوره {PathName}",
                $"https://pythoncoding.ir/api/payment/OnlinePaymentCallBack/{u.ID}/{PID}/{PathPerm}/{Cost}/{Month}/{UserCoupon}/{CouponCost}", EMail, u.Mobile);
            if (res.Result.Status == 100)
            {
                return Redirect("https://zarinpal.com/pg/StartPay/" + res.Result.Authority);
            }
            else
            {
                return RedirectToAction("PaymentFailed", "Payment");
            }
        }


        [Microsoft.AspNetCore.Mvc.HttpGet("OnlinePaymentCallBack/{UID}/{PID}/{PathPerm}/{Cost}/{Month}/{UserCoupon}/{CouponCost}")]
        public IActionResult OnlinePaymentCallBack(int UID, int PID, string PathPerm, int Cost, int Month, string UserCoupon, int CouponCost)
        {
            if (HttpContext.Request.Query["Status"] != "" &&
                HttpContext.Request.Query["Status"].ToString().ToLower() == "ok" &&
                HttpContext.Request.Query["Authority"] != "" && UID != 0)
            {
                string authority = HttpContext.Request.Query["Authority"].ToString();
                //var payment = new Payment(Cost);      //For sandbox
                var payment = new Payment(_MerchantID, Cost);

                var res = payment.Verification(authority).Result;
                if (res.Status == 100)
                {
                    User user = _context.UserRepository.Get(u => u.ID == UID);
                    if (user == null)
                        return RedirectToAction("PaymentFailed", "Payment");


                    if (user.Permissions.ToString() == "")
                        user.Permissions = PathPerm;
                    else
                        user.Permissions = user.Permissions + "," + PathPerm;

                    _context.UserRepository.Update(user);
                    AddUserPayment(UID, PID, Cost, Month, PathPerm);
                    if (CouponCost > 0) UpdateCoupon(UserCoupon);
                    _context.Commit();

                    return RedirectToAction("PaymentCompeleted", "Payment");
                }
            }
            return RedirectToAction("PaymentFailed", "Payment");
        }


        private bool AddUserPayment(int UID, int PID, int Cost, int Month, string PathPerm)
        {
            pyExtension px = new pyExtension();
            UserPayment up = new UserPayment();
            up.Cost = Cost;
            up.Month = Month;
            up.PathName = PathPerm;
            up.UID = UID;
            up.PathID = PID;
            up.XDate = px.PersianDate(DateTime.Now);
            up.XTime = DateTime.Now.ToString("HH:mm:ss tt");
            _context.UserPaymentRepository.Insert(up);
            return true;
        }


        private bool UpdateCoupon(string UserCoupon)
        {
            var Coupon = _context.CouponRepository.Get(c => c.Name == UserCoupon);
            Coupon.Count -= 1;
            _context.CouponRepository.Update(Coupon);
            return true;
        }

        ////**********************  برای زمانی که کاربر اشتراک میخرد که نیاز به لاگین دوباره برای تهیه توکن جدید است  ***********
        //public ActionResult LoginWithoutPassword(string Username)
        //{
        //    try
        //    {
        //        var User = _userService.Authenticate(Username, null);
        //        if (User == null)
        //            return Json(new { state = "NO", msg = "نام کاربری یا رمز عبور وارد شده اشتباه است." });

        //        return Json(new { state = "YES", token = User.Token, name = User.FirstName + " " + User.LastName, email = User.Username });
        //    }
        //    catch (Exception ex)
        //    {
        //        return Json(new { state = "NO", msg = ex.Message });
        //    }
        //}
        ////**********************  برای زمانی که کاربر اشتراک میخرد که نیاز به لاگین دوباره برای تهیه توکن جدید است  ***********

    }

}
