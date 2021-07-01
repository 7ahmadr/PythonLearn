
var app = angular.module("PyApp", ["ngRoute", "ui"]);
app.config(["$routeProvider", "$locationProvider", function ($routeProvider, $locationProvider) {

    $routeProvider.when("/", {
        templateUrl: "/Htmls/HomePage.html",
        controller: "jsHomeController"
    });

    $routeProvider.when("/User/SignUpForm", {
        templateUrl: "/Htmls/SignUp.html",
        controller: "jsSignUpController"
    });

    $routeProvider.when("/User/LoginForm", {
        templateUrl: "/Htmls/Login.html",
        controller: "jsLoginController"
    });

    $routeProvider.when("/Path/Index", {
        templateUrl: "/Htmls/Path/Path.html",
        controller: "jsPathController"
    });

    $routeProvider.when("/Path/IndexPathDet/:id", {
        templateUrl: "/Htmls/Path/PathDet.html",
        controller: "jsPathDetController"
    });

    $routeProvider.when("/Path/IndexPathCourse/:sid", {
        templateUrl: "/Htmls/Path/PathCourse.html",
        controller: "jsPathCourseController"
    });

    $routeProvider.when("/Path/IndexPathMission/:sid", {
        templateUrl: "/Htmls/Path/PathMission.html",
        controller: "jsPathMissionController"
    });

    //$routeProvider.when("/Course/Index", {
    //    templateUrl: "/Htmls/CourseList.html",
    //    controller: "jsCourseController"
    //});


    $routeProvider.otherwise({
        redirectTo: "/"
    });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

}]);




var appCourse = angular.module("PyCourseApp", ["ngRoute", "ui"]);

appCourse.factory("CourseID", function () {
    return { value: 0 };
});

appCourse.factory("loading", function () {
    return { value: false };
});

appCourse.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {

    $routeProvider.when("/Payment/Index", {
        templateUrl: "/Htmls/Payment/Payment.html",
        controller: "jsPaymentController"
    });

    $routeProvider.when("/course/index", {
        templateUrl: "/Htmls/CourseList.html",
        controller: "jsCourseController"
    });

    //$routeProvider.when("/Courses", {
    //    templateUrl: "Course/CourseList",
    //    controller: "jsCourseController"
    //});

    //$routeProvider.when("Course/Index", {
    //    templateUrl: "Course/CourseList",
    //    controller: "jsCourseController"
    //});

    //$routeProvider.when("/Courses", {
    //    templateUrl: "Course/Index",
    //    controller: "jsCourseController"
    //});

    $routeProvider.when("/Course/Lessons/:id/:lid", {
        templateUrl: "/Htmls/Lessons.html",
        controller: "jsLessonController"
    });

    $routeProvider.otherwise({
        redirectTo: "/course/index"
    });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

}]);