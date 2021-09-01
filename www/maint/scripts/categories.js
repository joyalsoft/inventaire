
verifyLogin() ; 

var main = new Vue ({
                      el : '#main', 
                      data : function () {
                              return {
                                    categories : []  , 
                                    need_saving : false , 
                                    message_accueil : "" 
                                    } ; 
                            }, 
                      methods : {
                        loadCategories : function () {
                                            var vm = this ; 
                                            fetch ('/bin/load-categories', 
                                                {
                                                  method : 'POST', 
                                                  headers : {
                                                              'Content-Type' : 'application/json'
                                                            }
                                                }
                                            )
                                              .then (function (response)  { return response.json() ; } ) 
                                          .then (
                                            function (data) {
                                              console.log (data) ; 
                                              vm.categories = data.categories ; 
                                              vm.protectCategories(); 
                                            }
                                          ) ; 
                                } , 

                          loadMessageAccueil : function () {
                             var vm = this; 
                             fetch ('/bin/load-message', 
                                    {
                                      method : 'GET', 
                                      headers : {
                                        'Content-Type' :'application/json'
                                      }
                                  }
                             )
                             .then (response => response.json())
                             .then ( 
                               function (data) {
                                 vm.message_accueil = data.message ; 
                               }
                             )
                          }, 

                         addLine : function () {
                           let vm = this ; 
                           vm.categories.push (
                             {
                               category : '', 
                               label : '' , 
                               readonly : false 
                             }
                           ) ; 
                         }, 
                         protectCategories : function () {
                            let vm = this ; 
                            vm.categories.forEach ( 
                              function (category) {
                                if (category.category != '') {
                                  category.readonly = true ; 
                                }
                              }
                            ) ; 
                            console.log (vm.categories) ;

                         },
                         openProducts : function (pCategory) {
                          window.open (`products.html?${$.param ({ category : pCategory})}`, '_blank') ;
                         }, 

                         saveList : function () {
                           let vm = this ; 
                            vm.need_saving = false; 
                           console.log ('saved') ;

                           fetch ('/bin/save-categories',
                                  {
                                    method : 'POST', 
                                    headers : {
                                      'Content-Type' : 'application/json'
                                    }, 
                                    body : JSON.stringify ({ categories : vm.categories})
                                  }
                           )
                           .then (response => response.json())
                           .then (vm.protectCategories)
                          ; 

                          fetch( '/bin/save-message', 
                                {
                                  method : 'POST' ,
                                  headers : {
                                    'Content-Type' : 'application/json'
                                  }, 
                                  body : JSON.stringify ({ message : vm.message_accueil})
                                })
                             ; 
                         }, 

                         dataChanged : function () {
                           this.need_saving = true ; 
                         }
                      }, 

                      mounted : 
                        function () {
                          var vm = this ; 
                          vm.loadCategories() ; 
                          vm.loadMessageAccueil() ; 
                        }
                    }
                  ) ; 