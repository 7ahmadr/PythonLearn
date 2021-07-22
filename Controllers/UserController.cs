using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using PythonLearn.Data;
using Microsoft.AspNetCore.Mvc;
using PythonLearn.Authentication.Permissions;
using PythonLearn.Authentication.Services;
using static PythonLearn.Authentication.Permissions.Permissions;
using PythonLearn.Data.Infrastructure;
using PythonLearn.Data.Context;
using User = PythonLearn.Data.User;
using System.Transactions;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using PythonLearn.Models;

namespace PythonLearn.Controllers
{
    [Authorize]
    public class UserController : Controller
    {

        #region Cnt
        private readonly IUserService _userService;
        private readonly UnitOfWork<PyContext> _context;
        private readonly pyExtension _pyExtention = new pyExtension();
        public UserController(IUserService userService, UnitOfWork<PyContext> context)
        {
            _userService = userService;
            _context = context;
        }
        #endregion



        public ActionResult SignUpForm()
        {
            return View("SignUp");
        }


        public IActionResult LoginForm()
        {
            return View("Login");
        }


        [AllowAnonymous]
        public ActionResult Login(string Username, string Password, bool IsExternal = false)
        {
            try
            {
                var User = _userService.Authenticate(Username.ToLower(), Password);
                if (User == null)
                    return Json(new { state = "NO", msg = "نام کاربری یا رمز عبور وارد شده اشتباه است." });

                else if (IsExternal == true)
                    return RedirectToAction("Index", "Course");

                else if (User.Active == false)
                    return Json(new { state = "NO", msg = "حساب کاربری شما فعالسازی نشده است. لطفا به ایمیل خود مراجعه کنید." });


                return Json(new { state = "YES", token = User.Token, name = User.FirstName + " " + User.LastName, email = User.Username });
            }
            catch (Exception ex)
            {
                return Json(new { state = "NO", msg = ex.Message });
            }
        }


        public ActionResult AddUser(string FirstName, string LastName, string Username, string Password, string Mobile, bool IsExternal = false)
        {
            try
            {
                Username = Username.ToLower();
                if (_userService.ExistUser(Username) != null)
                    if (IsExternal == false)
                        return Json(new { state = "NO", msg = "ایمیل وارد شده قبلا در سایت ثبت شده است." });
                    else
                        return Login(Username, Password, IsExternal);

                User newUser = _userService.AddUser(FirstName, LastName, Username, Password, Mobile, true);
                _context.UserRepository.Insert(newUser);
                _context.Commit();
                //if (IsExternal == false)
                //{
                //    string MailText = _pyExtention.ActivationMailText(newUser, HttpContext.Request);
                //    if (_pyExtention.SendMail(Username, "Python Coding", "فعالسازی حساب کاربری", MailText) != "1")
                //        return Json(new { state = "NO", msg = "فرآیند ارسال ایمیل ناموفق بود." });
                //}
                return Login(Username, Password, IsExternal); //Json(new { state = "YES" });
            }
            catch (Exception ex)
            {
                return Json(new { state = "NO", msg = ex.Message });
            }
        }


        public ActionResult SendNewPasswordMail(string EMail)
        {
            using (TransactionScope tran = new TransactionScope())
            {
                try
                {
                    User user = _userService.ExistUser(EMail);
                    if (user == null)
                        return Json(new { state = "NO", msg = "ایمیل وارد شده در سایت ثبت نشده است." });

                    string newPassword = GenerateRandom.GenerateRandom.RandomString(8);
                    string MailText = _pyExtention.NewPasswordMailText(user, newPassword);

                    User newUserInfo = _userService.ChangePassword(EMail, newPassword);
                    if (newUserInfo == null)
                        return Json(new { state = "NO", msg = "عملیات تغییر رمز عبور با خطا مواجه شد." });

                    _context.UserRepository.Update(user);
                    _context.Commit();

                    if (_pyExtention.SendMail(EMail, "Python Coding", "رمز عبور جدید", MailText) != "1")
                    {
                        tran.Dispose();
                        return Json(new { state = "NO", msg = "فرآیند ارسال ایمیل ناموفق بود." });
                    }

                    tran.Complete();
                    return Json(new { state = "YES" });
                }

                catch (Exception ex)
                {
                    tran.Dispose();
                    return Json(new { state = "NO", msg = ex.Message });
                }
            }
        }



        public IActionResult ChangePassword(string Username, string OldPass, string NewPass)
        {
            try
            {
                User user = _userService.ExistUser(Username);
                if (user == null)
                    return Json(new { state = "NO", msg = "کاربری با ایمیل " + Username + "یافت نشد." });

                if (_userService.CheckPassword(user.Password, OldPass) == true)
                {
                    if (_userService.ChangePassword(Username, NewPass) == null)
                        return Json(new { state = "NO", msg = "عملیات تغییر رمز عبور موفقیت آمیز نبود" });
                }
                else
                    return Json(new { state = "NO", msg = "رمز عبور فعلی وارد شده صحیح نمی باشد" });

                _context.UserRepository.Update(user);
                _context.Commit();
                return Json(new { state = "YES" });

            }
            catch (Exception ex)
            {
                return Json(new { state = "NO", msg = ex.Message });
            }
        }


        //[Microsoft.AspNetCore.Mvc.HttpPost("ActiveUser")]
        [AllowAnonymous]
        public IActionResult ActiveUser(string EMail, string Pass)
        {
            User user = _userService.ExistUser(EMail);
            if (user == null)
                return Json(new { state = "NO", msg = "کاربری با ایمیل " + EMail + " یافت نشد." });
            else if (user.Password != Pass)
                return Json(new { state = "NO", msg = "لینک ارسال شده معتبر نمی باشد." });
            else
                //active
                return null;
        }
    }
}