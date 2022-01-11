let registter = (function(){

    function postLog(username, mp) {
        console.log(username, mp);
        $.ajax({
            type: "POST",
            url: "/register/",
            data: {
                login: username,
                password: mp
            },
            success: () => {
                //IF FONCTION ELLIOT TRUE ALORS
                window.location.href = "/index";
                //ELSE
                //REDIRECT ./REGISTER + message erreur
            },
        });
    }

    return {
        sendLogin(username, mp) {
            postLog(username,mp);
        }
    }
})();