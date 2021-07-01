app.controller("jsPathCourseController", function ($scope, $rootScope, $route, $location, PyService) {
    var SID = location.pathname.split("/Path/IndexPathCourse/").pop();
    loadAll(SID);
    $scope.loading = true;
    $("#pyFooter").show();
    $("#pyHeader").show();

    function loadAll(SID) {
        window.scrollTo(0, 0);
        var list = PyService.GetAllPathCourse(SID);
        list.then(
            function (cs) {
                if (cs.data.state === "YES") {
                    $scope.Courses = cs.data.courses;
                    $scope.Season = cs.data.season;
                    $scope.SeasonOptions = cs.data.season.options.split("##");
                }
                else
                    alert(cs.data.msg);
            },
            function (error) {
                $scope.error = 'نمایش با شکست مواجه شد', error;
            }
        ).finally(function () {
            $scope.loading = false;
        });
    }


    $scope.GoToHomePage = function () {
        $location.path('/Home/Index');
    };

    $scope.GoToMission = function (id) {
        $location.path('/Path/IndexPathMission/' + id);
    };
});