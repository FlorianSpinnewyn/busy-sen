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