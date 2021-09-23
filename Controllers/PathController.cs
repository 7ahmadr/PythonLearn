using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PythonLearn.Data.Context;
using PythonLearn.Data.Infrastructure;

namespace PythonLearn.Controllers
{
    public class PathController : Controller
    {
        #region Cnt
        private readonly UnitOfWork<PyContext> _context;
        public PathController(UnitOfWork<PyContext> context)
        {
            _context = context;
        }
        #endregion


        public IActionResult Index()
        {
            return View("IndexPaths");
        }


        public IActionResult IndexPathDet(int id)
        {
            return View("IndexPathDet");
        }


        public IActionResult IndexPathCourse(int id)
        {
            return View("IndexPathCourse");
        }


        public IActionResult IndexPathMission(int id)
        {
            return View("IndexPathMission");
        }


        public IActionResult GetAllPath()
        {
            try
            {
                List<Data.Path> AllPath = _context.PathRepository.GetAll();
                return Json(new { state = "YES", path = AllPath, course = GetCourseList() });
            }
            catch (Exception ex)
            {
                return Json(new { state = "NO", msg = ex.Message + Environment.NewLine + " بارگذاری دروس با خطا مواجه شد. لطفا دوباره تلاش کنید" });
            }
        }


        private object GetCourseList()
        {
            return (from c in _context.CourseRepository.GetAll()
                    join s in _context.SeasonRepository.GetAll() on c.SID equals s.ID
                    join l in _context.LevelRepository.GetAll() on s.LID equals l.ID
                    join p in _context.PathRepository.GetAll() on l.PID equals p.ID
                    select new
                    {
                        id = c.ID,
                        pid = p.ID,
                        name = c.Name,
                        number = c.Number,
                        desc = c.Desc,
                        isfree = c.IsFree,
                    }).ToList();
        }


        public IActionResult GetAllPathDet(int PID)
        {
            try
            {
                Data.Path PathDet = _context.PathRepository.Get(p => p.ID == PID);
                var Seasons = _context.SeasonRepository.GetAll();
                var Levels = _context.LevelRepository.GetAll();

                List<Data.Season> PathSeasons = (from s in Seasons
                                                 join l in Levels on s.LID equals l.ID
                                                 where l.PID == PID
                                                 select s).ToList();
                return Json(new { state = "YES", pathdet = PathDet, pathseasons = PathSeasons });
            }
            catch (Exception ex)
            {
                return Json(new { state = "NO", msg = ex.Message });
            }
        }



        public IActionResult GetAllPathCourse(int SID)
        {
            try
            {
                Data.Season Season = _context.SeasonRepository.Get(s => s.ID == SID);
                var Courses = _context.CourseRepository.GetMany(c => c.SID == SID);
                return Json(new { state = "YES", season = Season, courses = Courses });
            }
            catch (Exception ex)
            {
                return Json(new { state = "NO", msg = ex.Message });
            }
        }


        public IActionResult GetAllPathMission(int CID)
        {
            try
            {
                var Lessons = from l in _context.LessonRepository.GetMany(c => c.CID == CID)
                              select new { l.Name, l.Desc };
                var Course = _context.CourseRepository.Get(c => c.ID == CID);
                var Season = _context.SeasonRepository.Get(s => s.ID == Course.SID);
                var Level = _context.LevelRepository.Get(l => l.ID == Season.LID);
                var Path = _context.PathRepository.Get(p => p.ID == Level.PID);
                return Json(new { state = "YES", lessons = Lessons, course = Course, path = Path });
            }
            catch (Exception ex)
            {
                return Json(new { state = "NO", msg = ex.Message });
            }
        }
    }
}