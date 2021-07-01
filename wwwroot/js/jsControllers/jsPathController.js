app.controller("jsPathController", function ($scope, $rootScope, $route, $location, PyService) {
    loadAll();
    $scope.loading = true;
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


    $scope.GoToPathDet = function (index) {
        $location.path('/Path/IndexPathDet/' + index.toString());
    };

    $scope.GoToMission = function (id) {
        $location.path('/Path/IndexPathMission/' + id);
    };
});