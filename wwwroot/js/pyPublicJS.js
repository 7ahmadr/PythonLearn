var IsLogin = false;
if (localStorage.getItem("email") !== "" && localStorage.getItem("email") !== null) {
    IsLogin = true;
}

function AlertPrimary(msg, btnText = 'بریم', rtl = true) {
    $.confirm({
        title: 'PythonCoding',
        icon: 'zmdi zmdi-check',
        content: msg,
        lrt: true,
        type: 'blue',
        typeAnimated: true,
        animationSpeed: 200, // 0.2 seconds
        buttons: {
            tryAgain: {
                text: btnText,
                btnClass: 'btn-blue',
            }
        }
    });
}


function AlertFail(msg) {
    $.confirm({
        title: 'PythonCoding',
        icon: 'zmdi zmdi-close-circle',
        content: msg,
        rtl: true,
        type: 'red',
        typeAnimated: true,
        animationSpeed: 200,
        buttons: {
            tryAgain: {
                text: 'فهمیدم',
                btnClass: 'btn-red',
            }
        }
    });
}


function AlertSuccess(msg, btnText) {
    if (typeof btnText === "undefined") {
        btnText = "برو بریم";
    }
    $.confirm({
        title: 'PythonCoding',
        icon: 'zmdi zmdi-close-circle',
        content: msg,
        rtl: true,
        type: 'green',
        typeAnimated: true,
        animationSpeed: 200,
        buttons: {
            tryAgain: {
                text: btnText,
                btnClass: 'btn-green',
            }
        }
    });
}


function AlertDark(msg, btnText = 'بریم', rtl = true) {
    $.confirm({
        title: 'PythonCoding',
        icon: 'zmdi zmdi-check',
        content: msg,
        rtl: rtl,
        type: 'dark',
        typeAnimated: true,
        animationSpeed: 200,
        buttons: {
            tryAgain: {
                text: btnText,
                btnClass: 'btn-dark'
            }
        }
    });
    $(".jconfirm-content").css("text-align", "left !important");
}



//************************************************************



function scorePassword(pass) {
    var score = 0;
    if (!pass)
        return score;

    // award every unique letter until 5 repetitions
    var letters = new Object();
    for (var i = 0; i < pass.length; i++) {
        letters[pass[i]] = (letters[pass[i]] || 0) + 1;
        score += 5.0 / letters[pass[i]];
    }

    // bonus points for mixing it up
    var variations = {
        digits: /\d/.test(pass),
        lower: /[a-z]/.test(pass),
        upper: /[A-Z]/.test(pass),
        nonWords: /\W/.test(pass)
    };

    variationCount = 0;
    for (var check in variations) {
        variationCount += (variations[check] === true) ? 1 : 0;
    }
    score += (variationCount - 1) * 15;     //10    AR7

    return parseInt(score);
}


function ValidateEMail(email) {
    //if (email === '') return true;
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}


function ValidateMobile(mobile) {
    if (mobile === '' || mobile === undefined) return true;
    if (mobile.substring(0, 2) !== "09") return false;
    var phoneno = /^\d{11}$/;
    if (mobile.match(phoneno))
        return true;
    else
        return false;
}


function SetPasswordRate(score) {
    if (score > 80)
        return "عالی";
    else if (score > 60)
        return "خوب";
    else if (score >= 30)
        return "ضعیف";
    else if (score === 0)
        return "";
    else
        return "خیلی ضعیف";
}
//************************************************************



function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}


function ScrollDivDown(id) {
    $(id).animate({
        scrollTop: 12000//$(id).height()	//$(id).offset().top//$(id)[0].scrollHeight
    }, 500);
    //$(id).scrollTop($(id)[0].scrollHeight);
    //var objDiv = document.getElementById(id);
    //objDiv.scrollTop = objDiv.scrollHeight;
}


window.mobileCheck = function () {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};


function PublicLogOut() {
    localStorage.setItem('token', '');
    localStorage.setItem('fullname', '');
    localStorage.setItem('email', '');
    window.open('/User/LoginForm', '_self');
}

//***************  برای بعد از خریداری اشتراک  **************
function PublicSilentLogOut() {
    localStorage.setItem('token', '');
    localStorage.setItem('fullname', '');
    localStorage.setItem('email', '');
}




function SeeMore() {
    var showChar = 400;
    var ellipsestext = "...";
    var moretext = "بیشتر";
    var lesstext = "کمتر";
    $('.more').each(function () {
        var content = $(this).html();

        if (content.length > showChar) {

            var c = content.substr(0, showChar);
            var h = content.substr(showChar - 1, content.length - showChar);

            var html = c + '<span class="moreellipses">' + ellipsestext + '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink">' + moretext + '</a></span>';

            $(this).html(html);
        }

    });

    $(".morelink").click(function () {
        if ($(this).hasClass("less")) {
            $(this).removeClass("less");
            $(this).html(moretext);
        } else {
            $(this).addClass("less");
            $(this).html(lesstext);
        }
        $(this).parent().prev().toggle();
        $(this).prev().toggle();
        return false;
    });
}


function PlaySound(sound) {
    var audio = new Audio(sound);
    audio.play();
}


function FilterContent(content) {
    content = content.replace(/<!#/g, "<img class='lesImage' src='/LessonPics/");
    content = content.replace(/#!>/g, "' style='max-width:100%;' />");

    content = content.replace(/<!!!/g, "<img class='lesImage' src='/LessonPics/");
    content = content.replace(/!!!>/g, "' style='max-width:70%;' />");


    content = content.replace(/<span cm-text="">&#8203;<\/span>/g, "<span>&nbsp;</span>");
    content = content.replace(/<span cm-text="">\u200b<\/span>/g, "<span>&nbsp;</span>");
    content = content.replace(/<span cm-text="">\​<\/span>/g, "<span>&nbsp;</span>");
    content = content.replace(/<span cm-text="">&ZeroWidthSpace;<\/span>/g, "<span>&nbsp;</span>");


    content = content.replace(/!تایتل/g, "<span class='pyTitle' >");
    content = content.replace(/!title/g, "<span class='pyTitle' >");
    content = content.replace(/!هایلایت/g, "<span class='pyHighlight' >");
    content = content.replace(/!سبز/g, "<span class='pyHighlightGreen' >");


    content = content.replace(/!پی/g, "<p>");
    content = content.replace(/پی!/g, "</p>");

    content = content.replace(/!هلو/g, "<span class='pyHighlight inline' >");
    content = content.replace(/هلو!/g, "</span>");


    content = content.replace(/!highlight/g, "<span class='pyHighlight' >");
    content = content.replace(/!بولد/g, "<span class='pyBold' >");
    content = content.replace(/!bold/g, "<span class='pyBold' >");
    content = content.replace(/!چپچین/g, "<span class='pyLtr' >");
    content = content.replace(/!chap/g, "<span class='pyLtr' >");

    content = content.replace(/!دیوقرمز/g, "<div class='pyDivRed' >");
    content = content.replace(/!divred/g, "<div class='pyDivRed pyLeftAlign' >");
    content = content.replace(/!دیوابی/g, "<div class='pyDivBlue' >");
    content = content.replace(/!divblue/g, "<div class='pyDivBlue pyLeftAlign' >");
    content = content.replace(/!گریندیو/g, "<div class='pyDivGreen' >");

    content = content.replace(/!رنگ/g, '<span style="color:#');
    content = content.replace(/!color/g, '<span style="color:#');
    content = content.replace(/!backcolor/g, '<span style="background-color:#');
    content = content.replace(/!لینک/g, '<a target="_blank" href="');
    content = content.replace(/!link/g, '<a target="_blank" href="');
    content = content.replace(/!زمینه/g, '<span style="background-color:#');
    content = content.replace(/!سایز/g, '<span style="font-size:');
    content = content.replace(/!size/g, '<span style="font-size:');
    content = content.replace(/!اینستراکت/g, "<span class='pyInstruct' >");
    content = content.replace(/اینستراکت!/g, "</span>");
    content = content.replace(/#!/g, '">');

    content = content.replace(/تایتل!/g, "</span>");
    content = content.replace(/title!/g, "</span>");
    content = content.replace(/هایلایت!/g, "</span>");
    content = content.replace(/سبز!/g, "</span>");
    content = content.replace(/highlight!/g, "</span>");
    content = content.replace(/بولد!/g, "</span>");
    content = content.replace(/bold!/g, "</span>");
    content = content.replace(/چپچین!/g, "</span>");
    content = content.replace(/chap!/g, "</span>");
    content = content.replace(/رنگ!/g, "</span>");
    content = content.replace(/color!/g, "</span>");
    content = content.replace(/backcolor!/g, "</span>");
    content = content.replace(/زمینه!/g, "</span>");
    content = content.replace(/لینک!/g, "</a>");
    content = content.replace(/link!/g, "</a>");
    content = content.replace(/سایز!/g, "</span>");
    content = content.replace(/size!/g, "</span>");

    content = content.replace(/دیوابی!/g, "</div>");
    content = content.replace(/گریندیو!/g, "</div>");
    content = content.replace(/divblue!/g, "</div>");
    content = content.replace(/دیوقرمز!/g, "</div>");
    content = content.replace(/divred!/g, "</div>");

    content = content.replace(/!دیوچپ/g, "<div class='pyDivLtr' >");
    content = content.replace(/دیوچپ!/g, "</div>");

    content = content.replace(/!هلپدیو/g, "<div class='pyDivHelp' >");
    content = content.replace(/هلپدیو!/g, "</div>");



    content = content.replace(/!بیرونبرتی/g, "<p class='birunbarTitle' >");
    content = content.replace(/بیرونبرتی!/g, "</p>");
    return content;
}