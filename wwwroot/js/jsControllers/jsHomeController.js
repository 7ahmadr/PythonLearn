app.controller("jsHomeController", function ($scope, $rootScope, $route, $location, PyService) {

    if (localStorage.getItem("token") !== null && localStorage.getItem("token") !== '') {
        window.open('/course/index', '_self');
    }

    loadAll();
    $("#pyFooter").show();
    $("#pyHeader").show();

    function loadAll() {
        var list = PyService.GetTopSeasons();


        list.then(
            function (cs) {
                if (cs.data.state === "YES") {
                    $scope.Seasons = cs.data.data;
                }
                else {
                    alert(cs.data.data);
                }
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
});