﻿appCourse.controller("jsCourseController", function ($scope, $rootScope, $route, $location, PyCourseService, $sce, $timeout) {
    $scope.loading = true;
    $scope.PassRate = "";        //***  برای وقتی کاربر بخواد رمز تغییییر بده  ***
    SetUI();

    if (localStorage.getItem('ActivePath') !== null)
        $scope.ActivePath = localStorage.getItem('ActivePath');
    else
        $scope.ActivePath = 0;

    $("[id=csNav]").show();
    $("#pyFooter").show();
    $("#pyHeader").show();
    loadAll();
    function loadAll() {
        var list = PyCourseService.GetAll();
        list.then(
            function (cs) {
                if (cs.data.state === "YES") {
                    $scope.Courses = cs.data.data.course;
                    $scope.Seasons = cs.data.data.season;
                    $scope.Levels = cs.data.data.level;
                    $scope.Paths = cs.data.data.path;
                    $scope.Permissions = cs.data.data.permission;
                    $scope.TimeLeft = cs.data.data.timeLeft;

                    $timeout(function () {
                        $scope.ChangeActivePath($scope.ActivePath, $scope.Paths[$scope.ActivePath].id);
                    }, 100);

                    if (localStorage.getItem("fullname") === null || localStorage.getItem("fullname") === '') {
                        $("#btn_logOut").hide();
                        $("#btn_changePass").hide();
                        $scope.FullName = 'کاربر مهمان';
                    }
                    else {
                        $scope.FullName = localStorage.getItem("fullname");
                        $('#btn_Login').hide();
                        $("#btn_changePass").show();
                    }
                }
                else {
                    alert(cs.data.data);
                }
            },
            function (error) {
                $scope.error = 'نمایش با شکست مواجه شد', error;
            }
        ).finally(function () {
            if (typeof sessionStorage.CID !== 'undefined' && (sessionStorage.CID !== 0) && (sessionStorage.CID !== '0')) {
                var CID = sessionStorage.CID;
                sessionStorage.CID = 0;
                $scope.GoToLessons(CID);
                return;
            }
            $scope.loading = false;
        });
    }



    $scope.GoToLessons = function (CID, PathPermission, IsFree) {
        if ($scope.HasPermission(PathPermission, IsFree) === false) {
            //AlertFail("لطفا جهت دسترسی به این درس اقدام به تهیه اشتراک کنید: اگر حساب کاربری ندارید، ابتدا یک حساب کاربری ساخته و سپس از نوار منو روی گزینه تهیه اشتراک کلیک کنید.");
            window.open("/Path/IndexPathMission/" + CID, '_self');
            return;
        }
        $location.path("/Course/Lessons/" + CID + "/1/");
    };


    $scope.ContinueCourse = function () {
        if (localStorage.getItem("CourseID") !== null && localStorage.getItem("LessonID") !== null) {
            let CID = localStorage.getItem("CourseID");
            let LID = localStorage.getItem("LessonID");
            $location.path("/Course/Lessons/" + CID + "/" + LID + "/");
        }
        else
            $location.path("/Course/Lessons/" + $scope.Courses[0].id + "/1/");
    };


    $scope.ReturnInt = function (ActivePath) {
        return Number(Number(ActivePath) + 1);
    };


    $scope.HasPermission = function (PathPermission, IsFree) {
        if (IsFree === true) return true;
        for (var i = 0; i < $scope.Permissions.length; i++)
            if ($scope.Permissions[i].indexOf(PathPermission) !== -1)
                return true;
        return false;
    };


    $scope.LogOut = function () {
        localStorage.setItem('token', '');
        localStorage.setItem('fullname', '');
        localStorage.setItem('email', '');
        $scope.GoToLogin();
    };

    $scope.GoToLogin = function () {
        window.open('/User/LoginForm', '_self');
        //$location.path('/User/LoginForm');
    };


    $scope.CheckPassRate = function (pass) {
        var score = SetPasswordRate(scorePassword(pass));
        $scope.PassRate = score;
    };


    $scope.ChangePassValidation = function () {
        if ($scope.OldPass === '' || $scope.OldPass === undefined) return false;
        if ($scope.NewPass === '' || $scope.NewPass === undefined) return false;
        if ($scope.NewPassRepeat === '' || $scope.NewPassRepeat === undefined) return false;
        if ($scope.NewPassRepeat !== $scope.NewPass) return false;
        if ($scope.PassRate === 'ضعیف' || $scope.PassRate === 'بسیار ضعیف' || $scope.PassRate === "") return false;

        return true;
    };


    $scope.ChangePassword = function () {
        var call = PyCourseService.ChangePassword(localStorage.getItem('email'), $scope.OldPass, $scope.NewPass);
        call.then(
            function (cs) {
                if (cs.data.state === "YES") {
                    AlertSuccess("رمز عبور شما با موفقیت تغییر کرد.");
                    ClearChangePassModal();
                }
                else
                    AlertFail(cs.data.msg);
            },
            function (error) {
                $scope.error = 'نمایش با شکست مواجه شد', error;
            }
        );
    };


    $scope.ReturnHtml = function (htm) {
        return $sce.trustAsHtml(htm);
    };

    $scope.ChangeActivePath = function (index, PID) {
        $scope.ActivePath = index;
        localStorage.setItem('ActivePath', index);
        let LId = $scope.GetFirstLevelOfPath($scope.Levels, PID);
        $('#tab' + LId).click();
    };


    $scope.GetFirstLevelOfPath = function (Levels, PID) {
        let min = 0;
        for (i = 0; i < Levels.length; i++) {
            if (Levels[i].pid === PID) {
                min = Levels[i].id;
                break;
            }
        }
        return min;
    };


    function SetUI() {
        $("[id=csNav]").show();
        $("#CourseFooter").show();
        $(".pyCH_Nav").css("background-color", "#ffffff");
        $(".pyCH_Logo").show();
        $(".pyCH_CoursePage").addClass("pyHidden");
    }

    function ClearChangePassModal() {
        $scope.OldPass = '';
        $scope.NewPass = '';
        $scope.NewPassRepeat = '';
        $scope.ShowChangePassModal = false;
        $("#btn_closeChangePass").click();
    }
});
