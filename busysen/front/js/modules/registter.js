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
            success: (data) => {
                let text1 = document.getElementById('erreur');
                if(data == 'already_exist') {
                    text1.innerHTML = "Cet email est déjà utilisée";
                }
                else {
                    window.location.href = "/index/0";
                }
            },
        });
    }

    return {
        sendLogin(username, mp) {
            postLog(username,mp);
        }
    }
})();