app.controller("jsSignUpController", function ($scope, $rootScope, $route, $location, PyService) {
    ClearForm();
    $("#pyFooter").hide();
    $("#pyHeader").hide();
    KeyShortcutSignUp();

    $scope.AddUser = function () {
        $scope.loading = true;
        var CallService = PyService.AddUser($scope.FirstName.trim(), $scope.LastName.trim(), $scope.Username.trim(),
            $scope.Password.trim(), $scope.Mobile.trim());
        CallService.then(
            function (cs) {
                if (cs.data.state === "YES") {
                    //AlertSuccess("کاربر گرامی ثبت نام شما در سایت با موفقیت انجام شد و ایمیلی حاوی لینک فعالسازی برای شما ارسال گردید. لطفا جهت فعال کردن حساب کاربری به ایمیل خود مراجعه کنید.", "حله");
                    ClearForm();
                    localStorage.setItem('token', cs.data.token);
                    localStorage.setItem('email', cs.data.email);
                    localStorage.setItem('fullname', cs.data.name);
                    window.open('/Course/Index', '_self');
                }
                else {
                    AlertFail(cs.data.msg);
                }
                $scope.loading = false;

            },
            function (error) {
                $scope.error = 'نمایش با شکست مواجه شد', error;
            }
        );
    };


    function ClearForm() {
        $scope.FirstName = "";
        $scope.LastName = "";
        $scope.Username = "";
        $scope.Password = "";
        $scope.Mobile = "";
        $scope.PassRate = "";
    }


    $scope.GoToLogin = function () {
        $location.path('/User/LoginForm');
    };


    $scope.CheckPassRate = function (pass) {
        var score = SetPasswordRate(scorePassword(pass));
        $scope.PassRate = score;
    };


    $scope.CheckValidation = function () {
        if ($scope.FirstName === '' || $scope.FirstName === undefined) return false;
        if ($scope.LastName === '' || $scope.LastName === undefined) return false;
        if ($scope.ValidateEMail($scope.Username) === false) return false;
        if ($scope.ValidateMobile($scope.Mobile) === false) return false;
        if ($scope.Password === '' || $scope.Password === undefined) return false;

        //if ($scope.PassRate === 'ضعیف' || $scope.PassRate === 'بسیار ضعیف' || $scope.PassRate === "") return false;

        return true;
    };


    $scope.ValidateMobile = function (Mobile) {
        return ValidateMobile(Mobile);
    };

    $scope.ValidateEMail = function (EMail) {
        return ValidateEMail(EMail);
    };
});


function KeyShortcutSignUp() {
    $("#div_Signup").keydown(function (e) {
        var charCode = (e.which) ? e.which : event.keyCode;
        if (charCode === 13) {
            e.preventDefault();
            if (!document.getElementById('btn_Signup').disabled)
                $("#btn_Signup").click();
        }
    });
}