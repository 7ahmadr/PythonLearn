app.controller("jsPathMissionController", function ($scope, $rootScope, $route, $location, PyService) {
    var SID = location.pathname.split("/Path/IndexPathMission/").pop();
    loadAll(SID);
    $scope.loading = true;
    $("#pyFooter").show();
    $("#pyHeader").show();


    function loadAll(SID) {
        window.scrollTo(0, 0);
        var list = PyService.GetAllPathMission(SID);
        list.then(
            function (cs) {
                if (cs.data.state === "YES") {
                    $scope.Lessons = cs.data.lessons;
                    $scope.Course = cs.data.course;
                    $scope.CourseOptions = cs.data.course.options.split("##");
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
});