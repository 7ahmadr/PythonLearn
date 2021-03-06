app.controller("jsHomeController", function ($scope, $rootScope, $route, $location, PyService) {

    //if (localStorage.getItem("token") !== null && localStorage.getItem("token") !== '') {
    //    window.open('/course/index', '_self');
    //}
    if (localStorage.getItem("fullname") === null || localStorage.getItem("fullname") === '')
        $("#navlink_Logout").hide();
    else {
        $('#navlink_Login').hide();
        $('#navlink_Signup').hide();
    }

    $scope.loading = true;
    loadAll();
    $("#pyFooter").show();
    $("#pyHeader").show();

    function loadAll() {
        var list = PyService.GetAllPath();


        list.then(
            function (cs) {
                if (cs.data.state === "YES") {
                    $scope.Paths = cs.data.path;
                    $scope.Courses = cs.data.course;
                }
                else {
                    alert(cs.data.msg);
                }
                $scope.loading = false;
                window.setTimeout(function () { SeeMore() }, 500);
            },
            function (error) {
                $scope.error = 'نمایش با شکست مواجه شد', error;
            }
        );
    }



    $scope.GoToFirstLesson = function (SID) {
        var GetLesson = PyService.GoToFirstLesson(SID);

        GetLesson.then(
            function (d) {
                if (d.data.state === "YES") {
                    sessionStorage.CID = d.data.data;
                    window.location = '/Course/Index';
                    //$rootScope.$emit("GoToLessons", {});
                }
            }
        );
    };


    $scope.GoToSignUp = function () {
        $location.path('/User/SignUpForm');
    };

    $scope.GoToLogin = function () {
        $location.path('/User/LoginForm');
    };

    $scope.GoToPath = function () {
        $location.path('/Path/Index');
    };

    $scope.StartPath = function (id) {
        localStorage.setItem('ActivePath', id);
        window.open('/Course/Index', '_self')
    }
});

