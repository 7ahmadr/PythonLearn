app.controller("jsPathDetController", function ($scope, $rootScope, $route, $location, PyService) {
    var PathID = location.pathname.split("/Path/IndexPathDet/").pop();
    $scope.loading = true;
    $("#pyFooter").show();
    $("#pyHeader").show();

    loadAll(PathID);
    function loadAll(PathID) {
        window.scrollTo(0, 0);
        var list = PyService.GetAllPathDet(PathID);
        list.then(
            function (cs) {
                if (cs.data.state === "YES") {
                    $scope.PathDet = cs.data.pathdet;
                    $scope.PathOptions = cs.data.pathdet.options.split("##");
                    $scope.PathSeasons = cs.data.pathseasons;

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

    $scope.GoToPathCourse = function (SID) {
        $location.path('/Path/IndexPathCourse/' + SID);
    };
});