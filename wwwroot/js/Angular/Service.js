
app.service("PyService", function ($http) {

    this.GetAllCourses = function () {
        return $http.get("/Course/GetAllCourse");
    };

    this.GetTopSeasons = function () {
        return $http.get("/Course/GetTopSeasons");
    };

    this.GoToFirstLesson = function (SID) {
        return $http({
            url: '/Course/GoToFirstLesson/',
            method: 'GET',
            params: { SID: SID }
        });
    };


    this.AddUser = function (FirstName, LastName, Username, Password, Mobile) {
        return $http({
            url: '/User/AddUser/',
            method: 'POST',
            params: {
                FirstName: FirstName,
                LastName: LastName,
                Username: Username,
                Password: Password,
                Mobile: Mobile
            }
        });
    };


    this.Login = function (Username, Password) {
        return $http({
            url: '/User/Login/',
            method: 'POST',
            params: {
                Username: Username,
                Password: Password
            }
        });
    };


    this.LoginGoogle = function (provider) {
        return $http({
            url: '/User/GetExternalLogin/',
            method: 'GET',
            dataType: 'jsonp',
            params: {
                provider: provider
            }
        });
    };


    this.SendNewPasswordMail = function (EMail) {
        return $http({
            url: '/User/SendNewPasswordMail/',
            method: 'GET',
            params: {
                EMail: EMail
            }
        });
    };


    this.GetAllPath = function () {
        return $http({
            url: '/Path/GetAllPath/',
            method: 'POST'
        });
    };

    this.GetAllPathDet = function (PathID) {
        return $http({
            url: '/Path/GetAllPathDet/',
            method: 'POST',
            params: {
                PID: PathID
            }
        });
    };

    this.GetAllPathCourse = function (SID) {
        return $http({
            url: '/Path/GetAllPathCourse/',
            method: 'POST',
            params: {
                SID: SID
            }
        });
    };

    this.GetAllPathMission = function (CID) {
        return $http({
            url: '/Path/GetAllPathMission/',
            method: 'POST',
            params: {
                CID: CID
            }
        });
    };
});


appCourse.service("PyCourseService", function ($http) {
    this.GetAll = function () {
        //return $http.get("/Course/GetAll");
        return $http({
            url: '/Course/GetAll/',
            method: 'GET',
            params: {
                Token: localStorage.getItem("token")
            }
        });
    };


    this.GetLessons = function (CID) {
        return $http({
            url: '/Course/GetLessons/',
            method: 'GET',
            params: {
                CID: CID,
                Token: localStorage.getItem("token")
            }
        });
    };


    this.CompileCode = function (code, LID, CheckAnswer) {
        return $http({
            url: '/Course/CompileCode/',
            method: 'GET',
            params: { Code: code, LID: LID, CheckAnswer: CheckAnswer }
        });
    };


    this.GetOutput = function (submissionId) {
        //var xmlHttp = new XMLHttpRequest();
        //xmlHttp.open("GET", 'https://681f2cb5.compilers.sphere-engine.com/api/v4/submissions/' + submissionId + '/output?access_token=d6cd6e3cd57540d0cc16a8fe42bb6a7f', false); // false for synchronous request
        //xmlHttp.send(null);
        //return xmlHttp.responseText;

        $http({
            headers: {
                'Access-Control-Allow-Origin':"*",
                'Content-Type': 'application/json; charset=utf-8'
            },
            method: 'POST',
            url: 'https://681f2cb5.compilers.sphere-engine.com/api/v4/submissions/200810274/output?access_token=d6cd6e3cd57540d0cc16a8fe42bb6a7f'
        }).then(function (response) {
            console.log(response);
        }, function (error) {
            console.log(error);
        });

        //$http.get('https://681f2cb5.compilers.sphere-engine.com/api/v4/submissions/' + submissionId + '/output?access_token=d6cd6e3cd57540d0cc16a8fe42bb6a7f')
        //$http({
        //    url: 'https://681f2cb5.compilers.sphere-engine.com/api/v4/submissions/' + submissionId + '/output?access_token=d6cd6e3cd57540d0cc16a8fe42bb6a7f',
        //    method: 'POST',
        //    headers: {
        //        'Content-Type': 'application/json; charset=utf-8'
        //    }
        //    //responseType: 'arraybuffer'
        //}).then(function (response) {
        //    alert(response.data);
        //});
    };

    this.GetNextCourseID = function (CID, SID) {
        return $http({
            url: '/Course/GetNextCourseID/',
            method: 'GET',
            params: { CID: CID, SID: SID }
        });
    };


    this.ChangePassword = function (Username, OldPass, NewPass) {
        return $http({
            url: '/User/ChangePassword/',
            method: 'POST',
            params: {
                Username: Username,
                OldPass: OldPass,
                NewPass: NewPass
            }
        });
    };
});
