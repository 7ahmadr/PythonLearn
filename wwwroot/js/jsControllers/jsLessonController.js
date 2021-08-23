appCourse.controller("jsLessonController", function ($scope, $location, PyCourseService, $sce) {
    //KeyShortcuts();
    $scope.ShowMainDiv = true;
    $scope.loading = true;
    SetUI();

    var CourseLesson = location.pathname.split("/Lessons/").pop();
    $scope.CourseID = CourseLesson.substr(0, CourseLesson.indexOf('/'));
    $scope.LessonID = CourseLesson.split("/").pop();

    localStorage.setItem("CourseID", $scope.CourseID);
    localStorage.setItem("LessonID", $scope.LessonID);

    $scope.ShowHint = false;
    $scope.ShowAnswer = false;
    $scope.ShowNextScreen = false;
    $scope.ShowResetDiv = false;
    $("#btn_changePass").hide();
    loadAll($scope.CourseID);

    function loadAll(CID) {
        var list = PyCourseService.GetLessons(CID);
        list.then(
            function (cs) {
                if (cs.data.state === "YES") {
                    $scope.Lessons = cs.data.data;
                    $scope.SID = cs.data.sid;
                    $scope.CID = CID;
                    $scope.GetAnswer(0);
                    $scope.pyConsoleAll = " >>> ";
                    $scope.pyConsoleCode = "";
                    $scope.ShowConsole = 0;


                    if (localStorage.getItem("fullname") !== null && localStorage.getItem("fullname") !== '') {
                        $('#btn_Login').hide();
                    }
                    else {
                        $("#btn_logOut").hide()
                    }
                }
                else {
                    $scope.ShowMainDiv = false;
                    alert(cs.data.data);
                    window.open('/course/Index', '_self');
                }
            },
            function (error) {
                $scope.error = 'نمایش با شکست مواجه شد', error;
            }
        ).finally(function () {
            $scope.loading = false;
            //$scope.SetDesign(0);
            $scope.Pagination($scope.LessonID);
            if ($scope.Lessons[$scope.LessonID - 1].fileHtml === null) {
                $scope.hasFile = 0;
                $scope.fileHtml = "";
            }
            else {
                $scope.hasFile = 1;
                $scope.fileHtml = $scope.Lessons[$scope.LessonID - 1].fileHtml;


                //********  برای وقتی که دو تا فایل داشته باشیم  ***********
                if ($scope.Lessons[$scope.LessonID - 1].fileHtml2 === null) {
                    $scope.hasFile2 = 0;
                    $scope.fileHtml2 = "";
                    $scope.fileName2 = null;
                }
                else {
                    $scope.hasFile2 = 1;
                    $scope.fileHtml2 = $scope.Lessons[$scope.LessonID - 1].fileHtml2;
                    $scope.fileName2 = $scope.Lessons[$scope.LessonID - 1].fileName2;
                }
            }
            $scope.showFile = 0;
            $scope.fileName = $scope.Lessons[$scope.LessonID - 1].fileName;

        });
    }


    $scope.CompileCode = function (code, CheckAnswer) {
        //var ww = PyCourseService.GetOutput("200810274");
        //alert(ww);
        $scope.loading = true;
        var ans = PyCourseService.CompileCode(code, $scope.Lessons[$scope.curLesson].id, CheckAnswer);
        ans.then(
            function (d) {
                if (d.data.state === "YES") {
                    $scope.loading = false;

                    $scope.pyResult = d.data.data;
                    $scope.pyError = 'false';

                    //****************  مربوط به نمایش متغیرهای کد است...پاک نشود  ****************
                    //var VarValues = d.data.vars.split("##Vars##").pop();
                    //var UserValues = VarValues.slice(VarValues.indexOf("##Values##") + 10, VarValues.indexOf("##Status##"));
                    //var UserVars = VarValues.split("##Values##").shift();
                    //var UserStatus = VarValues.slice(VarValues.indexOf("##Status##") + 12, VarValues.indexOf("##Corrects##"));
                    //var Corrects = VarValues.slice(VarValues.indexOf("##Corrects##") + 14, VarValues.length);

                    //UserVars = UserVars.replace(/\n/g, '');      //حذف کاراکتر اینتر از ابتدای رشته
                    //UserVars = UserVars.replace(/'/g, "");
                    //UserVars = UserVars.split("__%__");

                    //UserValues = UserValues.replace(/\n/g, '');
                    //UserValues = UserValues.split("__%__");
                    //UserStatus = UserStatus.split("__%__");
                    //Corrects = Corrects.split("__%__");
                    //$scope.pyUserVars = $scope.CreateVarsHtml(UserVars, UserValues, UserStatus, Corrects);
                    //****************  مربوط به نمایش متغیرهای کد است...پاک نشود  ****************


                    if (CheckAnswer === true) {
                        $scope.CheckAnswer();
                    }
                }
                else {
                    $scope.loading = false;
                    $scope.pyResult = d.data.data;     //"Error: " +
                    $scope.pyError = 'true';
                }
            }
        );
    };


    $scope.CreateVarsHtml = function (UserVars, UserValues, UserStatus, Corrects) {
        if (Corrects[0] === "") return "";          //کد کاربر هیچ متغیری ندارد
        var WholeHtml = "<div style='margin-top: 10px;'>";
        var EachStep = "";
        for (var i = 0; i < UserVars.length; i++) {
            EachStep = "<a spellcheck='false'  href='#' class='pyLS_VarsHeader " + UserStatus[i] + "' data-toggle='collapse' data-target='#item" + i + "'>"
                + "<span class='zmdi zmdi-caret-right  m-l-5'></span> "
                + UserVars[i] +
                "</a> <br/>" +
                "<div spellcheck='false' id = 'item" + i +
                "' class='collapse pyLS_VarsItem " +
                (UserStatus[i] === 'pyLS_False' ? "pyLS_False' > <span class='pyLS_False'> - actual</span>" +
                    "<span class='pyLS_True'> + expected</span> <br/><br/> - " : "'>") + UserValues[i] +
                "<br/> <span class='pyLS_True'>" + (UserStatus[i] !== 'pyLS_True' ? ' + ' + Corrects[i] : "") + "</span>" +
                "</div > <br style='line-height:5px'/>";
            WholeHtml += EachStep;
        }
        WholeHtml += "</div>";
        return WholeHtml;
    };


    $scope.GetAnswer = function (index) {
        $scope.lesAnswer = $scope.Lessons[index].result;
        $scope.lesInstruction = $scope.Lessons[index].instruction;
        $scope.correctCode = $scope.Lessons[index].correctCode;
        $scope.curLesson = index;

        let UserCode = localStorage.getItem($scope.CourseID + "/" + $scope.LessonID);
        if (UserCode !== null)
            $scope.pyCode = UserCode;
        else
            $scope.pyCode = $scope.Lessons[index].defaultCode;

        $scope.pyResult = "";
        if ($scope.Lessons[index].hint === null || $scope.Lessons[index].hint === "")
            $scope.hasHint = 0;//$(".dropup").children().find("#btn_hint").hide();
        else
            $scope.hasHint = 1; //$(".dropup").children().find("#btn_hint").show();

    };


    $scope.lesDisplayHint = function () {
        $scope.ShowHint = true;
        $scope.ShowAnswer = false;
        //$scope.ScrollDivDown("#divLessonBody");
    };

    $scope.lesDisplayAnswer = function () {
        $scope.ShowHint = false;
        $scope.ShowAnswer = true;
        //$scope.ScrollDivDown("#divLessonBody");
    };


    $scope.IsMobile = function () {
        return window.mobileCheck();
    }


    $scope.SetDesign = function (index) {
        if ($scope.Lessons[index].hasCompiler === true) {
            $("#divCompiler").css("display", "block");
            $("#divButtonsImp").css("display", "block");
            $("#divLesson").removeClass("col-sm-12");
            if (window.mobileCheck()) {                //اگر موبایلی بود
                $("#divLesson").addClass("col-sm-12");
                $("#divLesson").css("height", "60vh");
            }
            else {
                $("#divLesson").addClass("col-sm-12");
                $("#divLesson").css("height", "100%");

            }
        }
        else {
            $("#divCompiler").css("display", "none");
            $("#divButtonsImp").css("display", "none");
            $("#divLesson").removeClass("col-sm-6");
            $("#divLesson").addClass("col-sm-12");
            $("#divLesson").addClass("col-lg-12");
        }
    };



    $scope.DisplayAnswer = function (compile) {
        $scope.pyCode = $scope.correctCode;
        if (compile === true)
            $scope.CompileCode($scope.pyCode, false);
    };


    $scope.CheckAnswer = function () {
        if ($scope.pyResult.toString().trim() === $scope.lesAnswer.toString().trim()) {
            //$scope.ClearCompiler();
            if ($scope.curLesson >= $scope.Lessons.length - 1) {
                AlertSuccess('تبریک! این دوره آموزشی به پایان رسید... بریم برای دوره بعدی؟');
                $scope.GetNextCourseID();
            }
            else {
                //AlertPrimary('احسنت! پاسخ شما درست بود. بریم مرحله بعد؟...');
                //$scope.changePage('+');
                $scope.ShowNextScreen = true;
            }
        }
        else {
            AlertFail('متاسفیم! پاسخ شما اشتباه بود. دوباره تلاش کنید...');
        }
    };


    $scope.ClearCompiler = function () {
        $scope.pyCode = '';
        $scope.pyResult = '';
        $scope.pyConsoleAll = " >>> ";
        $scope.pyConsoleCode = "";
        $(".CodeMirror").focus();
    };

    $scope.OpenResetDiv = function () {
        $scope.ShowResetDiv = true;
        document.getElementById("pyLS_LesMain").classList.add("pyLS_LesMainDisable");
        document.getElementById("pyLS_LesMain").classList.remove("pyLS_LesMainEnable");
    };

    $scope.CloseResetDiv = function () {
        $scope.ShowResetDiv = false;
        document.getElementById("pyLS_LesMain").classList.remove("pyLS_LesMainDisable");
        document.getElementById("pyLS_LesMain").classList.add("pyLS_LesMainEnable");
    };

    $scope.GetNextCourseID = function () {
        var newCID = PyCourseService.GetNextCourseID($scope.CID, $scope.SID);
        newCID.then(function (cid) {
            if (cid.data.state === "Finish") {
                AlertSuccess("شما موفق شدید تمامی درسنامه های این سایت را با موفقیت پشت سر بگذارید. اکنون شما یک حرفه ای هستید!");
                return;
            }
            else if (cid.data.state === "NO") {
                AlertFail(cid.data.msg);
                return;
            }
            else {
                $scope.CID = cid.data.data;
                $location.path("/Course/Lessons/" + $scope.CID + "/1");
                //loadAll($scope.CID);
            }
        });

    };

    $scope.SidebarClick = function (index) {
        $location.path('/Course/Lessons/' + $scope.CourseID.toString() + '/' + (index + 1).toString() + '/');
    };



    $scope.ParseLesson = function (content) {
        if (content === null) return;
        content = content.replace(/<!#/g, "<img class='lesImage' src='/LessonPics/");
        content = content.replace(/#!>/g, "' style='max-width:100%;' />");
		
		content = content.replace(/<!!!/g, "<img class='lesImage' src='/LessonPics/");
        content = content.replace(/!!!>/g, "' style='max-width:70%;' />");


        content = content.replace(/<span cm-text="">&#8203;<\/span>/g, "<span>&nbsp;</span>");
        content = content.replace(/<span cm-text="">\u200b<\/span>/g, "<span>&nbsp;</span>");
		content = content.replace(/<span cm-text="">\​<\/span>/g, "<span>&nbsp;</span>");
		content = content.replace(/<span cm-text="">&ZeroWidthSpace;<\/span>/g, "<span>&nbsp;</span>");

		
        content = content.replace(/!تایتل/g, "<span class='pyTitle' >");
        content = content.replace(/!title/g, "<span class='pyTitle' >");
        content = content.replace(/!هایلایت/g, "<span class='pyHighlight' >");
        content = content.replace(/!سبز/g, "<span class='pyHighlightGreen' >");


        content = content.replace(/!پی/g, "<p>");
        content = content.replace(/پی!/g, "</p>");

        content = content.replace(/!هلو/g, "<span class='pyHighlight inline' >");
        content = content.replace(/هلو!/g, "</span>");


        content = content.replace(/!highlight/g, "<span class='pyHighlight' >");
        content = content.replace(/!بولد/g, "<span class='pyBold' >");
        content = content.replace(/!bold/g, "<span class='pyBold' >");
        content = content.replace(/!چپچین/g, "<span class='pyLtr' >");
        content = content.replace(/!chap/g, "<span class='pyLtr' >");

        content = content.replace(/!دیوقرمز/g, "<div class='pyDivRed' >");
        content = content.replace(/!divred/g, "<div class='pyDivRed pyLeftAlign' >");
        content = content.replace(/!دیوابی/g, "<div class='pyDivBlue' >");
        content = content.replace(/!divblue/g, "<div class='pyDivBlue pyLeftAlign' >");
        content = content.replace(/!گریندیو/g, "<div class='pyDivGreen' >");

        content = content.replace(/!رنگ/g, '<span style="color:#');
        content = content.replace(/!color/g, '<span style="color:#');
        content = content.replace(/!backcolor/g, '<span style="background-color:#');
        content = content.replace(/!لینک/g, '<a target="_blank" href="');
        content = content.replace(/!link/g, '<a target="_blank" href="');
        content = content.replace(/!زمینه/g, '<span style="background-color:#');
        content = content.replace(/!سایز/g, '<span style="font-size:');
        content = content.replace(/!size/g, '<span style="font-size:');
        content = content.replace(/!اینستراکت/g, "<span class='pyInstruct' >");
        content = content.replace(/اینستراکت!/g, "</span>");
        content = content.replace(/#!/g, '">');

        content = content.replace(/تایتل!/g, "</span>");
        content = content.replace(/title!/g, "</span>");
        content = content.replace(/هایلایت!/g, "</span>");
        content = content.replace(/سبز!/g, "</span>");
        content = content.replace(/highlight!/g, "</span>");
        content = content.replace(/بولد!/g, "</span>");
        content = content.replace(/bold!/g, "</span>");
        content = content.replace(/چپچین!/g, "</span>");
        content = content.replace(/chap!/g, "</span>");
        content = content.replace(/رنگ!/g, "</span>");
        content = content.replace(/color!/g, "</span>");
        content = content.replace(/backcolor!/g, "</span>");
        content = content.replace(/زمینه!/g, "</span>");
        content = content.replace(/لینک!/g, "</a>");
        content = content.replace(/link!/g, "</a>");
        content = content.replace(/سایز!/g, "</span>");
        content = content.replace(/size!/g, "</span>");

        content = content.replace(/دیوابی!/g, "</div>");
        content = content.replace(/گریندیو!/g, "</div>");
        content = content.replace(/divblue!/g, "</div>");
        content = content.replace(/دیوقرمز!/g, "</div>");
        content = content.replace(/divred!/g, "</div>");

        content = content.replace(/!دیوچپ/g, "<div class='pyDivLtr' >");
        content = content.replace(/دیوچپ!/g, "</div>");

		content = content.replace(/!هلپدیو/g, "<div class='pyDivHelp' >");
		content = content.replace(/هلپدیو!/g, "</div>");



        content = content.replace(/!بیرونبرتی/g, "<p class='birunbarTitle' >");
        content = content.replace(/بیرونبرتی!/g, "</p>");
        return $sce.trustAsHtml(content);
    };


    $scope.ParseFileHtml = function (content) {
        return $sce.trustAsHtml(content);
    };


    $scope.SetNextLines = function (content) {
        return content.replace(/\n/g, "<br/>");
    };


    $scope.ConsoleKeyUp = function (e, content) {
        if (e.keyCode === 13 || e.which === 13) {
            e.preventDefault();
            $scope.pyConsoleCode += '\n' + content.split(/\r?\n/).pop().substr(4);
            //alert($scope.pyConsoleCode);
            var ans = PyCourseService.CompileCode($scope.pyConsoleCode, -1, false);
            ans.then(
                function (d) {
                    var Ans = d.data.data.split(/\r?\n/).pop();
                    if (Ans === "Object reference not set to an instance of an object.")
                        Ans = "";
                    $scope.pyConsoleAll += '\n \t' + Ans + '\n >>>';
                }
            );
        }

        //else if ((e.keyCode === 8 || e.which === 8) || (e.keyCode === 46 || e.which === 46)) {      //backspace and del
        //    e.preventDefault()
        //    alert($('#txt_console').prop('selectionStart'));
        //}
    };


    $scope.ToggleConsole = function () {
        if ($scope.ShowConsole === 1)
            $scope.ShowConsole = 0;
        else {
            $scope.ShowConsole = 1;
        }
    };

    $scope.ToggleShowFile = function () {
        $scope.showFile === 1 ? $scope.showFile = 0 : $scope.showFile = 1, $scope.showFile2 = 0;
    };

    $scope.ToggleShowFile2 = function () {
        $scope.showFile2 === 1 ? $scope.showFile2 = 0 : $scope.showFile2 = 1, $scope.showFile = 0;
    };

    $scope.Pagination = function (parentLiPage) {
        //var $paginationContainer = $(".pagination-container"),
        //    $pagination = $paginationContainer.find('.pagination ul');
        //var Destination = 1;
        //var currentPage = parseInt($(".pagination-container div[data-page]:visible").data('page'));
        //var numPages = $paginationContainer.find("div[data-page]").length;
        //// make sure they aren't clicking the current page
        ////if (parseInt(parentLiPage) !== parseInt(currentPage)) {
        //// hide the current page
        //if (parentLiPage === '+' && currentPage < numPages) {
        //    $paginationContainer.find("div[data-page]:visible").hide();
        //    // next page
        //    $paginationContainer.find("div[data-page=" + (currentPage + 1 > numPages ? numPages : currentPage + 1) + "]").show();
        //    Destination = currentPage + 1;
        //}
        //else if (parentLiPage === '-' && currentPage > 1) {
        //    $paginationContainer.find("div[data-page]:visible").hide();
        //    // previous page
        //    $paginationContainer.find("div[data-page=" + (currentPage - 1 < 1 ? 1 : currentPage - 1) + "]").show();
        //    Destination = currentPage - 1;
        //}
        //else if (parentLiPage !== '-' && parentLiPage !== '+' && Number(parentLiPage) <= numPages) {
        //    $paginationContainer.find("div[data-page]:visible").hide();
        //    // specific page
        //    $paginationContainer.find("div[data-page=" + parseInt(parentLiPage) + "]").show();
        //    Destination = parentLiPage;
        //}
        //else return;
        $(".lesPageNum").css("background-color", "white");
        $("[id=page_btn" + parentLiPage + "]").css("background-color", "#ffd147");
        //document.querySelectorAll("[data-page='3']").style.color = "yellow";
        //$("#lesFooter").children().children().children().find('li[data-page=' + Destination + ']').children().css('background-color', 'red');
        $scope.GetAnswer(parentLiPage - 1);
        $scope.SetDesign(parentLiPage - 1);
        //}
    };


    $scope.changePage = function (newPage) {
        if (newPage === '+')
            newPage = Number($scope.LessonID) + 1;
        else if (newPage === '-')
            newPage = Number($scope.LessonID) - 1;

        if (newPage < 1)
            return;
        else if (newPage > $scope.Lessons.length) {
            AlertPrimary("تبریک! این دوره آموزشی به پایان رسید... برای مرحله بعدی آماده باشید...", "آمادم");
            $scope.CourseID = Number($scope.CourseID) + 1;
            newPage = 1;
        }
        $location.path("/Course/Lessons/" + $scope.CourseID + "/" + newPage);
    };


    $scope.EditorKeyPress = function () {
        let name = $scope.CourseID + "/" + $scope.LessonID;
        localStorage.setItem(name, $scope.pyCode);
    };

    function SetUI() {
        $("[id=csNav]").hide();
        $("#CourseFooter").hide();
        $(".pyCH_Nav").css("background-color", "#353d4f");
        $(".pyCH_Logo").hide();
        $(".pyCH_CoursePage").removeClass("pyHidden");
    }



    window.addEventListener('click', function (e) {
        if (document.getElementById('divSidebar').contains(e.target) || document.getElementById('btnShowSidebar').contains(e.target)) {
            // Clicked in box
        }
        else {
            $("[id=divSidebar]").hide();
            //$scope.ShowSidebar = 0;
            //$scope.ChangeSidebar();// Clicked outside the box
        }
    });
});


appCourse.value('ui.config', {
    codemirror: {
        mode: 'python',
        autofocus: true,
        lineNumbers: true,
        theme: "dracula",
        extraKeys: { "Ctrl-Space": "autocomplete" }
    }//        matchBrackets: true,
});



$("#txt_console").keydown(function (e) {
    if ((e.keyCode === 8 || e.which === 8) || (e.keyCode === 46 || e.which === 46)) {      //backspace and del
        var lastLine = $(this).val().split(/\r?\n/).pop();
        var txt = $(this).val();

        var index = Number(Number(txt.lastIndexOf(lastLine)) + Number(5));
        if ($(this).prop('selectionStart') < index) {
            e.preventDefault();
            e.stopPropagation();
        }
    }
});


function KeyShortcuts() {
    $(document).keydown(function (e) {
        var charCode = (e.which) ? e.which : event.keyCode;
        if (e.ctrlKey && charCode === 116) {        //Ctrl + F5
            e.preventDefault();
            $("#btn_sendAnswer").click();
        }
        else if (charCode === 116) {              //F5
            e.preventDefault();
            $("#btn_runCode").click();
        }
        else if (charCode === 120) {              //F9
            e.preventDefault();
            $("#btn_clearCode").click();
        }
    });
}



