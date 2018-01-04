$(document).ready(function (){
	
    $("div#warning").hide();
    $("#register").hide();

    var $goToReg = $("button#goToReg"),
        $btnReg = $("#btnReg"),
        $btnReturn = $("#btnReturn");

    //if click the signIn button verify the username and password
    $('button#btnSignIn').mousedown(function () {
        verify()
    });

    //if press enter verify the username and password
    $(document).keydown(function (event) {
        if (event.keyCode == 13) {
            verify()
        }
    });
	
    function verify() {
        var userName = $("input#username").val();
        var passWord = $("input#password").val();

        $.ajax({
            url: 'login/verify',
            type: 'POST',
            data: JSON.stringify({"username": userName, "password": passWord}),
            dataType: 'json',
            contentType: "application/json;charset=UTF-8",
            success: function (res) {
                if (res) {
                    var sessId =res.sessionId;
                    var curUser = res.userName;
                    $("div#warning").hide();
                    if(res.checkFlag && sessId!=null){
                        $(window.location).attr('href', 'home.html?user='+curUser+'&sessionId='+sessId);
                    }else{
                        $("div#warning").show();
                    }
                }else{
                    $("div#warning").show();
                }
            },
            error: function () {
                alert("login faild!");
            }
        });
    }

    $goToReg.mousedown(function(){
        $("#sign_in").hide();
        $("#register").show();
    });

    $btnReturn.mousedown(function(){
        $("#register").hide();
        $("#sign_in").show();
    });

    $btnReg.mousedown(function(){

        $('#target_2').validationEngine();//init form validation

        var usernameReg = $("input#usernameReg").val();
        var passwordReg = $("input#passwordReg").val();

        if(usernameReg==null||usernameReg==""||usernameReg==undefined||passwordReg==null||passwordReg==""||passwordReg==undefined){
            console.log("must input value!");

        }else{
            $.ajax({
                url: 'user/create',
                type: 'POST',
                data: JSON.stringify({"name": usernameReg, "passw": passwordReg}),
                dataType: 'json',
                contentType: "application/json;charset=UTF-8",
                success: function (res) {
                    console.log("register return value:" + res);
                    if (res != 0) {
                        $("#register").hide();
                        $("#sign_in").show();
                    } else {
                        alert("User is existed! try another one");
                    }
                },
                error: function () {
                    console.log("register faild!");
                }
            });
        }
    });
});
