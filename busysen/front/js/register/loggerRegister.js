let ajax_inscritpion = (function(){

    function postLog(email,mdp) {
        $.ajax({
            type: "POST",
            url: "/register/",
            data: {
                login: email,
                mdp : mdp
            },
            //Affichage des différentes informations en fonction du success ou non de la requete ajax
            success: (data) => {
                /*
                let tt = document.getElementById('err');
                let text = document.getElementById('valide'); 
                let text1 = document.getElementById('erreur_mdp');
                let text2 = document.getElementById('erreur_name');
                let text3 = document.getElementById('erreur_diff');
                let text4 = document.getElementById('erreur_correct');
                text.innerHTML = " ";
                text1.innerHTML = " ";
                text2.innerHTML = " ";
                text3.innerHTML = " ";
                text4.innerHTML = " ";
                
                if(data == 'inscrit') {
                   
                    text.innerHTML = "Incription validée";
                    
                    console.log(data);
                    window.location.href ="/";
                }
                if(data == 'existe_login') {
                    text2.innerHTML = "Le username est déjà pris";
                    console.log(data);
                }
                if(data == 'existe_mdp') {
                    text1.innerHTML = "Le mot de passe est déjà pris";
                    console.log(data);
                }
                if(data == 'differents') {
                    text3.innerHTML = "Les mots de passe sont différents";
                    console.log(data);
                }
                if(data == 'null') {
                    text4.innerHTML = "Merci de remplir correctement l'inscription";
                    console.log(data);
                }
                */
            },
        }); 
    }

    return{ 
        sendInscription(email,mdp){ 
            postLog(email,mdp);
        } 
    } 
})();