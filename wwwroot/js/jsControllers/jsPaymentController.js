appCourse.controller("jsPaymentController", function ($scope, $location, PyCourseService, $sce) {
    $("#CourseFooter").hide();
    $("#btn_changePass").hide();
    if (localStorage.getItem('email') === null || localStorage.getItem('email') === "")
        window.open(`/User/LoginForm`, '_self');

    $scope.PathIndex = null;
    loadAllPricing();
    function loadAllPricing() {
        var list = PyCourseService.GetAllPricing();
        list.then(
            function (cs) {
                if (cs.data.state === "YES") {
                    $scope.Pricings = cs.data.data.pricing;
                    $scope.Paths = cs.data.data.path;

                    if (localStorage.getItem("fullname") !== null && localStorage.getItem("fullname") !== '') {
                        $('#btn_Login').hide();
                    }
                }
                else {
                    alert(cs.data.msg);
                }
            },
            function (error) {
                $scope.error = 'نمایش با شکست مواجه شد', error;
            }
        );

    }



    $scope.CurrencyFormat = function (x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    $scope.PayForLesson = function (priceIndex) {
        if ($scope.PathIndex === null) {
            AlertPrimary("لطفا یک دوره را برای خرید انتخاب کنید.", "باشه");
            return;
        }
        let Cost = Number($scope.Pricings[priceIndex].cost - $scope.Pricings[priceIndex].off);
        let Month = Number($scope.Pricings[priceIndex].month);
        GoToPaymentPage($scope.PathIndex, Cost, Month);
    };
});


function GoToPaymentPage(PathID, Cost, Month) {
    let EMail = localStorage.getItem('email');
    window.open(`/api/payment/PayForLesson/${PathID}/${EMail}/${Cost}/${Month}`, '_self');
}
