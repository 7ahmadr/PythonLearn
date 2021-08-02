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

namespace PythonLearn.Controllers
{
    [Microsoft.AspNetCore.Mvc.Route("api/user")]
    [ApiController]
    public class UserApiController : Controller //ApiController
    {
        #region Cnt
        private readonly IUserService _userService;
        private readonly UnitOfWork<PyContext> _context;
        private readonly SignInManager<ExternalUser> _signInManager;


        public UserApiController(IUserService userService, UnitOfWork<PyContext> context, SignInManager<ExternalUser> signInManager)
        {
            _userService = userService;
            _context = context;
            _signInManager = signInManager;
        }
        #endregion


        [Microsoft.AspNetCore.Mvc.HttpGet("ActiveUser/{EMail}/{UniqueID}")]
        public IActionResult ActiveUser([FromUri]string EMail, [FromUri]string UniqueID)
        {
            User user = _userService.ExistUser(EMail);
            if (user == null)
                return RedirectToAction("Error", "Home");
            else if (user.UniqueID.ToString() != UniqueID)
                return RedirectToAction("Error", "Home");
            else
            {
                user.Active = true;
                _context.UserRepository.Update(user);
                _context.Commit();
                return RedirectToAction("Index", "Course");
            }
        }


        [Microsoft.AspNetCore.Mvc.HttpGet("GetExternalLogin/{provider}")]
        public IActionResult GetExternalLogin(string provider)
        {
            var redirectUrl = Url.RouteUrl("ExternalLogin", Request.Scheme);
            var properties = _signInManager.ConfigureExternalAuthenticationProperties(provider, redirectUrl);// _userService.ExternalAuthenticate(provider, redirectUrl);
            return Challenge(properties, provider);
        }



        [Microsoft.AspNetCore.Mvc.Route("external-login", Name = "ExternalLogin")]
        public async Task<IActionResult> ExternalLogin()
        {
            var result = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            var newUser = new
            {
                Name = result.Principal.FindFirstValue(ClaimTypes.Name),
                Active = true,
                Mobile = result.Principal.FindFirstValue(ClaimTypes.MobilePhone),
                Password = "google",
                Username = result.Principal.FindFirstValue(ClaimTypes.Email),
            };

            var spaceIndex = newUser.Name.IndexOf(" ");
            return RedirectToAction("AddUser", "User",
                new
                {
                    FirstName = newUser.Name.Substring(0, spaceIndex),
                    LastName = newUser.Name.Substring(spaceIndex + 1),
                    Username = newUser.Username,
                    Password = newUser.Password,
                    Mobile = newUser.Mobile,
                    IsExternal = true
                });
        }

    }
}