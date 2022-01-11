let logger = (function(){

    function postLog(username, mp) {
        console.log(username, mp);
        $.ajax({
            type: "POST",
            url: "/login/",
            data: {
                login: username,
                passorwd: mp
            },
            success: () => {
                //IF FONCTION ELLIOT TRUE ALORS
                window.location.href = "/index";
                //ELSE
                //REDIRECT ./LOGIN + message erreur
            },
        });
    }

    return {
        sendLogin(username, mp) {
            postLog(username,mp);
        }
    }
})();