appCourse.controller("jsPaymentController", function ($scope, $location, PyCourseService, $sce) {
    $("#CourseFooter").hide();
    $("#btn_changePass").hide();
    if (localStorage.getItem('email') === null || localStorage.getItem('email') === "")
        window.open(`/User/LoginForm`, '_self');

    $scope.PathIndex = null;
    $scope.UserCoupon = null;
    $scope.UserCouponCost = 0;

    loadAllPricing();
    function loadAllPricing() {
        var list = PyCourseService.GetAllPricing();
        list.then(
            function (cs) {
                if (cs.data.state === "YES") {
                    $scope.Pricings = cs.data.data.pricing;
                    $scope.Paths = cs.data.data.path;
                    $scope.Coupons = cs.data.data.coupon;

                    if (localStorage.getItem("fullname") !== null && localStorage.getItem("fullname") !== '') {
                        $('#btn_Login').hide();
                    }
                    window.setTimeout(function () { SeeMore() }, 500);

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


    $scope.CheckCoupon = function (cpn, coupons) {
        if (coupons === null || cpn === null) return null;
        $scope.UserCouponCost = 0;
        for (var i = 0; i < coupons.length; i++) {
            if (coupons[i].name.toLowerCase() === cpn.toLowerCase()) {
                $scope.UserCouponCost = coupons[i].cost;
                return coupons[i].desc;
            }
        }
        $scope.UserCouponCost = 0;
        return null;
    };


    $scope.PayForLesson = function (priceIndex) {
        if ($scope.PathIndex === null) {
            AlertPrimary("لطفا یک دوره را برای خرید انتخاب کنید.", "باشه");
            return;
        }
        let Cost = Number($scope.Pricings[priceIndex].cost - $scope.Pricings[priceIndex].off - $scope.UserCouponCost);
        let Month = Number($scope.Pricings[priceIndex].month);
        GoToPaymentPage($scope.PathIndex, Cost, Month, $scope.UserCoupon, $scope.UserCouponCost);
    };
});


function GoToPaymentPage(PathID, Cost, Month, UserCoupon, CouponCost) {
    let EMail = localStorage.getItem('email');
    window.open(`/api/payment/PayForLesson/${PathID}/${EMail}/${Cost}/${Month}/${UserCoupon}/${CouponCost}`, '_self');
}
