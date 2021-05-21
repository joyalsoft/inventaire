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
                localStorage.login_key = '' ; 
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
  
  localStorage.login_key = '' ; 

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
          localStorage.login_key = '' ; 
          alert ('Courriel ou mot de passe invalide.') ; 
        } else {
          console.log (data.key) ; 
          console.log (localStorage.login_key) ; 
          localStorage.login_key = data.key ; 
          goToMain() ; 
        }
      }
    ) ; 
}

function verifyLogin() {
  console.log (localStorage.login_key) ; 
  if (typeof localStorage.login_key == 'undefined' || localStorage.login_key == '') {
    goToLogin() ; 
    return false ; 
  }
  return true ; 
}