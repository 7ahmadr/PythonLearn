app.controller("jsLoginController", function($scope, $rootScope, $route, $location, PyService) {
    $scope.ForgotPassword = false;
    ClearForm();
    $("#pyFooter").hide();
    $("#pyHeader").hide();

    $scope.Login = function () {
        $scope.loading = true;
        var CallService = PyService.Login($scope.Username, $scope.Password);
        CallService.then(
            function (cs) {
                if (cs.data.state === "YES") {
                    ClearForm();
                    localStorage.setItem('token', cs.data.token);
                    localStorage.setItem('fullname', cs.data.name);
                    localStorage.setItem('email', cs.data.email);
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


    $scope.LoginGoogle = function() {
        var CallService = PyService.LoginGoogle("Google");
        CallService.then(
            function(cs) {
                alert("done");
            },
            function(error) {
                $scope.error = 'نمایش با شکست مواجه شد', error;
            }
        );
    };


    $scope.SendNewPasswordMail = function () {
        $scope.loading = true;
        var CallService = PyService.SendNewPasswordMail($scope.Username);
        CallService.then(
            function (cs) {
                $scope.loading = false;
                if (cs.data.state === "YES") {
                    AlertSuccess("رمز عبور جدید به ایمیل شما ارسال شد.");
                }
                else {
                    AlertFail(cs.data.msg);
                }
            },
            function (error) {
                $scope.error = 'نمایش با شکست مواجه شد', error;
            }
        );
    };


    $scope.testLogin = function () {
        var CallService = PyService.testLogin();
        CallService.then(
            function () {
                alert("done");
            }
        );
    };

    function ClearForm() {
        $scope.Username = "";
        $scope.Password = "";
    }


    $scope.GoToSignUp = function () {
        $location.path('/User/SignUpForm');
    };

    $scope.NeedNewPassword = function () {
        $scope.ForgotPassword = true;
    };

    $scope.BackToLogin = function () {
        $scope.ForgotPassword = false;
    };


    $scope.CheckValidation = function () {
        if ($scope.Username === '') return false;
        if ($scope.Password === '') return false;
        if ($scope.ValidateEMail($scope.Username) === false) return false;
        return true;
    };


    $scope.ValidateEMail = function (EMail) {
        return ValidateEMail(EMail);
    };
});