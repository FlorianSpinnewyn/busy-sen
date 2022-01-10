let loggerLogin = (function(){

    function postLog(email,mdp) {
        $.ajax({
            type: "POST",
            url: "/login/",
            data: {
                login: email,
                mdp : mdp
            },
            success: (data) => {

                //Si l'utilisateur s'est bien connecté alors redirection sinon affichage de l'erreur
                /*
                let text1 = document.getElementById('erreur_mdp');
                text1.innerHTML = "";
                if(data == 'ok') {
                    window.location.href = "/leaderboard"; 
                }
                if(data == 'err_mdp' || data == 'err_pseudo' ) {
                    text1.innerHTML = "Votre mot de passe ou votre pseudo est incorrect";
                }
                */
            },
        }); 
    }

    return{ 
        sendLogin(email,mdp){ 
            postLog(email,mdp);
        } 
    } 
})();