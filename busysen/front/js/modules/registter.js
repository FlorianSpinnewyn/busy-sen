let registter = (function(){

    function postLog(username, mp) {
        console.log(username, mp);
        $.ajax({
            type: "POST",
            url: "/register/",
            data: {
                login: username,
                passorwd: mp
            },
            success: () => {
                window.location.href = "/index";
            },
        });
    }

    return {
        sendLogin(username, mp) {
            postLog(username,mp);
        }
    }
})();