function logout () {
  fetch ('/bin/logout', 
                  {
                    method : 'POST', 
                    headers : {
                                'Content-Type' : 'application/json'
                              }
                  }
              )
              .then (response => response.json())
            .then (
              function (data) {
                goToLogin() ; 
              }
            ) ; 

}

function goToLogin() {
  window.open ('/maint/login.html', '_top') ; 
}

function goToMain() {
  window.open ('/maint/categories.html', '_top') ; 
}


function login () {
  
      fetch ('/bin/login', 
          {
            method : 'POST', 
            headers : {
                        'Content-Type' : 'application/json'
                      }, 
            body : JSON.stringify (Object.fromEntries((new FormData(document.getElementById ("myform"))).entries()))
          }
      )
      .then (response => response.json())
    .then (
      function (data) {
        console.log (data) ; 
        if (data.message == 'failed') {
          alert ('Courriel ou mot de passe invalide.') ; 
        } else {
          goToMain() ; 
        }
      }
    ) ; 
}

function verifyLogin() {
  fetch ('/bin/check-login', 
          {
            method :'POST', 
            headers : {
              'Content-Type' : 'application/json'
            }
          }
      )
      .then (response => response.json())
      .then (
        function (data) {
          if (!data.logged_in) {
            goToLogin () ; 
            return false ;
          } else {
            return true ; 
          }
        }
      ) ; 
}