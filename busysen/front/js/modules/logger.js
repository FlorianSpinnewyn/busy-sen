let logger = (function(){

    function postLog(username, mp) {
        console.log(username, mp);
        $.ajax({
            type: "POST",
            url: "/login/",
            data: {
                login: username,
                password: mp
            },
            success: (data) => {
                let text1 = document.getElementById('erreur');
                if(data == 'wrong_mdp') {
                    text1.innerHTML = "Votre mot de passe est incorrect";
                }
                else if(data == 'wrong_email') {
                    text1.innerHTML = "Votre email est incorrect";
                }else {
                    window.location.href = "/index";
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