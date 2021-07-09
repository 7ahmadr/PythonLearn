using Microsoft.AspNetCore.Http;
using PythonLearn.Data;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace PythonLearn.Controllers
{
    internal class pyExtension
    {
        public string SendMail(string ToMail, string Title, string Subject, string MailText)
        {
            return MailKit.MailKit.SendMail("info@pythoncoding.ir", "$pythoncoding.ir#7", "mail.pythoncoding.ir",
                                                false, 25, ToMail, Title, Subject, MailText);
        }



        public string NewPasswordMailText(User user, string newPassword)
        {
            return "<div style='font-family: tahoma; direction:rtl'>" +
                                user.FirstName + " " + user.LastName + " عزیز " +
                                " رمز عبور جدید شما عبارت است از:" + "<br/>" +
                                "<span style='color:darkblue; font-weight:bold'>" + newPassword + "</span>" + "<br/>" +
                                "بابت استفاده از وبسایت python coding از شما سپاسگذاریم." +
                                "</div>";
        }


        public string ActivationMailText(User user, HttpRequest request)
        {
            string RootUrl = GetRootUrl(request);
            string AfterRoot = "/api/user/activeuser/" + user.Username + "/" + user.UniqueID.ToString();
            string ActiveRoot = RootUrl + AfterRoot;
            return "<div style='font-family: tahoma; direction:rtl'>" +
                                user.FirstName + " " + user.LastName + " عزیز " +
                                " به وبسایت PythonCoding خوش آمدید" + "<br/>" +
                                "لطفا روی لینک زیر کلیک کنید تا حساب کاربری شما فعال شود:" + "<br/>" +
                                "<a href='" + ActiveRoot + "'>فعالسازی حساب کاربری</a>";
        }


        private static string GetRootUrl(HttpRequest request)
        {
            var host = request.Host.ToUriComponent();
            var pathBase = request.PathBase.ToUriComponent();
            return $"{request.Scheme}://{host}{pathBase}";
        }


        public string PersianDate(DateTime d)
        {
            PersianCalendar pc = new PersianCalendar();
            var day = pc.GetDayOfMonth(d);
            var month = pc.GetMonth(d);
            var strMonth = (month.ToString().Length > 1) ? month.ToString() : "0" + (month.ToString());
            var strDay = (day.ToString().Length > 1) ? day.ToString() : "0" + (day.ToString());

            return string.Format("{0}/{1}/{2}", pc.GetYear(d), strMonth, strDay);
        }
    }
}
