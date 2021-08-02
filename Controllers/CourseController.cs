using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PythonLearn.Data;
using PythonLearn.Data.Context;
using PythonLearn.Data.Infrastructure;
using System.Web.Http;
using PythonLearn.Compiler;
using PythonLearn.Authentication.Permissions;
using PythonLearn.Authentication.Services;
using static PythonLearn.Authentication.Permissions.Permissions;
using System.IdentityModel.Tokens.Jwt;
using PythonLearn.Authentication.Controllers;
using PythonLearn.Authentication.Extensions;

namespace PythonLearn.Controllers
{
    public class CourseController : Controller
    {
        #region Cnt
        private readonly UnitOfWork<PyContext> _context;
        public CourseController(UnitOfWork<PyContext> context)
        {
            _context = context;
        }
        #endregion


        public IActionResult Index()
        {
            return View("IndexCourse");
        }


        public IActionResult CourseList()
        {
            return View("CourseList");
        }

        public IActionResult Lessons(int id = 0, int lid = 0)
        {
            return View("IndexLessons");
        }


        public JsonResult GetAllCourse()
        {
            var List = _context.CourseRepository.GetAll();
            return Json(List);
        }


        public JsonResult GetTopSeasons()
        {
            try
            {
                var List = _context.SeasonRepository.GetAll().OrderBy(s => s.LID).ThenBy(s => s.Number).Take(6);
                return Json(new { state = "YES", data = List });
            }
            catch (Exception ex)
            {
                return Json(new { state = "NO", data = "خطا در بارگذاری دوره ها" + Environment.NewLine + ex.Message });
            }
        }


        public JsonResult GetAll(string Token, string EMail)
        {
            try
            {
                //*****************  اگر کاربر فعال باشد باید چک کنیم که پرمیشن هایش اکسپایر نشده باشند  ***********
                Data.User user = null;
                int UID = 0;
                string TimeLeft = "";
                pyExtension pyEx = new pyExtension();
                if (!string.IsNullOrEmpty(EMail))
                {
                    user = GetUserByEmail(EMail);
                    UID = user.ID;
                }
                List<string> PermissionList = PermissionsController.GetPermissionList(Token, UID);

                #region FillAllLists
                var PathList = _context.PathRepository.GetAll();
                var CourseList = _context.CourseRepository.GetAll();    //GetCourseListWithPermissions(); //
                var SeasonList = _context.SeasonRepository.GetAll();
                var LevelList = _context.LevelRepository.GetAll();
                #endregion

                string NowDate = pyEx.GetPersianDate(DateTime.Now);

                if (PermissionList.Count > 0 && PermissionList[0] != "NotAuthenticate" && !string.IsNullOrEmpty(PermissionList[0]))
                    foreach (string p in PermissionList)
                    {
                        var UserPay = _context.UserPaymentRepository.GetMany(u => u.PathName == p && u.UID == UID).Last();
                        int xMonth = UserPay.Month;
                        if (xMonth == 0) continue;
                        string xDate = UserPay.XDate;
                        string PName = (from pth in PathList where pth.Permission == p select pth.Name).SingleOrDefault();
                        TimeLeft += "زمان باقی مانده تا پایان اشتراک " + "«<b>" + PName + "</b>»"
                            + ": <strong>" + (pyEx.DateDayDifference(xDate, NowDate, xMonth)).ToString() + " روز " + "</strong><br/>";
                    }

                #region Return All
                return Json(new
                {
                    state = "YES",
                    data = new
                    {
                        Path = PathList,
                        Level = LevelList,
                        Season = SeasonList,
                        Course = CourseList,
                        Permission = PermissionList,
                        TimeLeft = TimeLeft
                    }
                });
                #endregion
            }
            catch (Exception ex)
            {
                return Json(new { state = "NO", data = "خطا در بارگذاری درسنامه ها" + Environment.NewLine + ex.Message });
            }

        }


        private object GetCourseListWithPermissions()
        {
            return (from c in _context.CourseRepository.GetAll()
                    join s in _context.SeasonRepository.GetAll() on c.SID equals s.ID
                    join l in _context.LevelRepository.GetAll() on s.LID equals l.ID
                    join p in _context.PathRepository.GetAll() on l.PID equals p.ID
                    select new
                    {
                        id = c.ID,
                        sid = c.SID,
                        name = c.Name,
                        number = c.Number,
                        desc = c.Desc,
                        isfree = c.IsFree,
                        permission = p.Permission
                    }).ToList();
        }


        public ActionResult GetLessons(int CID, string Token, string EMail)
        {
            try
            {
                //*****************  اگر کاربر فعال باشد باید چک کنیم که پرمیشن هایش اکسپایر نشده باشند  ***********
                Data.User user = null;
                int UID = 0;
                if (!string.IsNullOrEmpty(EMail))
                {
                    user = GetUserByEmail(EMail);
                    UID = user.ID;
                }

                List<string> PermissionList = PermissionsController.GetPermissionList(Token, UID);
                var Course = _context.CourseRepository.Get(c => c.ID == CID);
                var IsFree = Course.IsFree;
                int SID = Course.SID;
                int LevelID = _context.SeasonRepository.Get(c => c.ID == SID).LID;
                int PID = _context.LevelRepository.Get(c => c.ID == LevelID).PID;

                var LessonPermission = _context.PathRepository.Get(p => p.ID == PID).Permission;
                if (PermissionsController.HasPermission(PermissionList, LessonPermission) == false && IsFree == false)
                    return Json(new { state = "NO", data = "اجازه دسترسی به این درسنامه برای شما وجود ندارد." });


                var List = _context.LessonRepository.GetMany(l => l.CID == CID);
                var FileList = _context.FileHtmlRepository.GetAll();
                var JoinList = GetLessonPackage(List, FileList, Course);
                return Json(new { state = "YES", data = JoinList, SID = SID });
            }
            catch (Exception ex)
            {
                return Json(new { state = "NO", data = "خطا در بارگذاری درس ها" + Environment.NewLine + ex.Message });
            }
        }


        //private void SaveUserLastLesson(ref Data.User user, int lid, int cid)
        //{
        //    user.CID = cid;
        //    user.LID = lid;
        //    _context.UserRepository.Update(user);
        //    _context.Commit();
        //}


        private static IEnumerable<object> GetLessonPackage(IEnumerable<Lesson> List, IEnumerable<Data.Entity.FileHtml> FileList, Course course)
        {
            return (from l in List
                    join f in FileList
                        on l.FileHtml equals f.ID into grouping
                    from f in grouping.DefaultIfEmpty()
                    select new
                    {
                        id = l.ID,
                        cid = l.CID,
                        cname = course.Name,
                        cdesc = course.Desc,
                        name = l.Name,
                        number = l.Number,
                        content = l.Content,
                        instruction = l.Instruction,
                        result = l.Result,
                        desc = l.Desc,
                        defaultCode = l.DefaultCode,
                        correctCode = l.CorrectCode,
                        hasCompiler = l.HasCompiler,
                        hint = l.Hint,
                        fileHtml = (f is null) ? null : f.Html,
                        fileName = (f is null) ? null : f.Name,
                        fileHtml2 = (f is null) ? null : f.Html2,
                        fileName2 = (f is null) ? null : f.Name2,
                    }).ToList();
        }

        public JsonResult GoToFirstLesson(int SID)
        {
            try
            {
                Course course = _context.CourseRepository.Get(c => c.SID == SID && c.Number == 1);
                if (course is null)
                    return Json(new { state = "NO", data = "درسنامه ای در این فصل وجود ندارد." });
                int CID = _context.CourseRepository.Get(c => c.SID == SID && c.Number == 1).ID;
                return Json(new { state = "YES", data = CID });
            }
            catch (Exception ex)
            {
                return Json(new { state = "NO", data = "خطا در بارگذاری درسنامه" + Environment.NewLine + ex.Message });
            }
        }


        public JsonResult CompileCode(string Code, int LID = -1, bool CheckAnswer = false)
        {
            try
            {
                pyCompiler c = new pyCompiler();
                string Exp = "";
                if (LID != -1)
                {
                    string hasExp = CheckException(Code, LID);
                    if (!string.IsNullOrEmpty(hasExp))
                        Exp = Environment.NewLine + CheckException(Code, LID);
                    var TopCode = _context.LessonRepository.Get(l => l.ID == LID).TopHiddenCode;
                    if (TopCode != null)
                        Code = TopCode + Environment.NewLine + Code;
                }

                //string ClientID = _context.API_ParamsRepository.GetAll().First().ClientId;
                //string ClientSecret = _context.API_ParamsRepository.GetAll().First().ClientSecret;
                //string Language = _context.API_ParamsRepository.GetAll().First().Language;
                //string VersionIndex = _context.API_ParamsRepository.GetAll().First().VersionIndex;

                FuncResult ans = c.Run(Code, "", Exp);      //c.Run(Code, CheckVarsValue(LID, CheckAnswer, Code), Exp); پاک نشود

                if (ans.State == "NO")
                    ans.Data += CheckErrorException(ans.Data);

                return Json(ans);
            }
            catch (Exception ex)
            {
                return Json(new { state = "NO", data = ex.Message });
            }

        }


        private Data.User GetUserByEmail(string EMail)
        {
            Data.User user = _context.UserRepository.Get(u => u.Username == EMail);
            return user;
        }


        private string CheckException(string Code, int LID)
        {
            string Desc = "";
            var row = _context.LessonExpRepository.Get(e => e.LID == LID && e.Code.Trim() == Code.Trim());
            if (row != null) Desc = "** " + row.Desc;
            return Desc;
        }


        private string CheckErrorException(string Err)
        {
            string Desc = "";
            var row = _context.ErrorExpRepository.Get(e => Err.Contains(e.Error));
            if (row != null) Desc = Environment.NewLine + "** " + row.Desc;
            return Desc;
        }


        public JsonResult GetNextCourseID(int CID, int SID)
        {
            try
            {
                var curNumber = _context.CourseRepository.Get(c => c.ID == CID).Number;
                var NextCourse = _context.CourseRepository.Get(c => c.Number > curNumber && c.SID == SID, cc => cc.Number);
                int lesCount = 0;
                int NextCID = 0;

                if (NextCourse is null)
                {
                    //****************  دوره های این فصل تمام شدن
                }
                else
                {
                    NextCID = NextCourse.ID;
                    lesCount = _context.LessonRepository.GetMany(l => l.CID == NextCID).Count();
                }


                while (lesCount == 0)
                {
                    curNumber += 1;
                    NextCourse = _context.CourseRepository.Get(c => c.Number > curNumber && c.SID == SID, cc => cc.Number);
                    if (NextCourse is null)
                    {
                        //**************  باید به فصل بعدی برویم  *********************
                        var NextSeason = _context.CourseRepository.Get(c => c.SID > SID, cc => cc.SID);

                        if (NextSeason is null)
                        {
                            return Json(new { state = "Finish" });
                        }

                        SID = NextSeason.SID;
                        curNumber = -1;     //چون در ابتدای وایل یه دونه اضافه میشه
                    }
                    else
                    {
                        NextCID = NextCourse.ID;
                        lesCount = _context.LessonRepository.GetMany(l => l.CID == NextCID).Count();
                    }
                }

                return Json(new { state = "YES", data = NextCID });
            }
            catch (Exception ex)
            {
                return Json(new { state = "NO", data = "خطا در بارگذاری درس ها" + Environment.NewLine + ex.Message });
            }
        }


        private string CheckVarsValue(int LID, bool CheckAnswer, string Code)
        {
            string VarsValue = "";
            if (LID != -1)      // && CheckAnswer == true
            {
                var CorrectVars = _context.LessonRepository.Get(l => l.ID == LID).CorrectVars;
                VarsValue = GetAllVarsValue(Code, CorrectVars);
            }
            return VarsValue;
        }

        //, user_variables[key] ,'\ncorrect answer: ',key, ':' , correct_code[key]
        private static string GetAllVarsValue(string UserCode, string CorrectVars)
        {
            var Code = @"
import sys # برای نوشتن خروجی آخر کار
#correct variables
correct_code = {" + CorrectVars + @" }

user_variables = {}
correct_values = []

#end of correct variables
"
+ Environment.NewLine + UserCode +
@"

   
tmp = locals().copy()
for k,v in tmp.items():
    if not k.startswith('_') and k!='tmp' and k!='In' and k!='moteghayerhaye____sahih' and k!='Out' and k!= 'read_file' and k!='np' and k!='os' and k!='sys' and k!='name' and k!= 'opened_file' and k!='pprint' and k!='correct_code' and not hasattr(v, '__call__'):        
        if k!='user_variables' and k!='correct_values' :
            user_variables[k] = v
        

def get_status_list(correct_code, user_variables):
    st_list = []
    for key in user_variables:
        if key in correct_code:
            correct_values.append(correct_code[key])
            if correct_code[key] == user_variables[key]:
                st_list.append('pyLS_True')
            else:
                st_list.append('pyLS_False')
        else:
            st_list.append('pyLS_Undefined')
            correct_values.append(' ')
    return st_list


def get_key_list(a_dic): 
    dic_keys = []
    for key in a_dic:
        dic_keys.append(key)
    return dic_keys

def get_value_list(a_dic): 
    dic_values = []
    for key in a_dic:
        dic_values.append(a_dic[key])
    return dic_values

print('##Vars##')
sys.stdout.write('__%__'.join(str(x) for x in get_key_list(user_variables)))
print('##Values##')
sys.stdout.write('__%__'.join(str(x) for x in get_value_list(user_variables)))
print('##Status##')
sys.stdout.write('__%__'.join(str(x) for x in get_status_list(correct_code, user_variables)))
print('\n##Corrects##')
sys.stdout.write('__%__'.join(str(x) for x in correct_values))
print('\n##LessonVarsCount##')
sys.stdout.write(str(len(correct_code)))
";

            return Code;
        }
    }
}