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
                List<Data.Course> AllCourse = _context.CourseRepository.GetAll();
                return Json(new { state = "YES", path = AllPath, course = AllCourse });
            }
            catch (Exception ex)
            {
                return Json(new { state = "NO", msg = ex.Message });
            }
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
                return Json(new { state = "YES", lessons = Lessons, course = Course, season = Season });
            }
            catch (Exception ex)
            {
                return Json(new { state = "NO", msg = ex.Message });
            }
        }
    }
}