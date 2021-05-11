var main = new Vue ({
                      el : '#main', 
                      data : function () {
                              return {
                                    saving : false, 
                                    champs : []  , 
                                    need_saving : false , 
                                    products : [], 
                                    align_options : [
                                      {align : 'left', label : 'gauche'}, 
                                      {align :'center', label : 'centre'},
                                      {align : 'right', label : 'droite'}
                                    ]
                                    } ; 
                            }, 
                      methods : {
                        loadChamps : function () {
                                            var vm = this ; 
                                            fetch ('/bin/load-champs', 
                                                {
                                                  method : 'POST', 
                                                  headers : {
                                                              'Content-Type' : 'application/json'
                                                            }, 
                                                  body : JSON.stringify ({
                                                    category : category
                                                  })
                                                }
                                            )
                                              .then (function (response)  { return response.json() ; } ) 
                                          .then (
                                            function (data) {
                                              vm.champs = data.champs ; 
                                            }
                                          ) ; 
                                } , 

                      loadProducts : function () {
                         let vm = this; 
                         fetch ('/bin/load-products', 
                              {
                                method :'POST', 
                                headers : {
                                  'Content-Type' : 'application/json'
                                }, 
                                body : JSON.stringify ({
                                  category : category 
                                })
                              }
                         )
                         .then (response => response.json())
                         .then (
                           function (data) {
                             vm.products = data.products ; 
                           }
                         ) ; 
                      }, 


                         dataChanged : function () {
                           this.need_saving = true ; 
                         }, 

                         validateValue : function (product, fieldName,  champ) {
                           if (typeof champ.format != 'undefined' && champ.format != '' ){
                             if (!isNaN (product[fieldName])) {
                               product[fieldName] = format (parseFloat (product[fieldName]), champ.format) ; 
                             }
                           }
                         }, 
                         saveProducts : function () {
                           let vm = this; 
                           vm.saving = true ; 
                           vm.champs.forEach (
                              function (e) {
                                delete e.isNew ; 
                              }
                           ) ; 
                            fetch ('/bin/save-champs', 
                                    {
                                      method :'POST', 
                                      headers : {
                                        'Content-Type' : 'application/json'
                                      }, 
                                      body : JSON.stringify ( 
                                        {
                                          category : category , 
                                          champs : vm.champs 
                                        }
                                      )
                                    }
                            )
                            .then (response=>response.json())
                            .then (
                              function (data) {
                                fetch ('/bin/save-products', 
                                  {
                                    method : 'POST', 
                                    headers : {
                                      'Content-Type' : 'application/json'
                                    }, 
                                    body : JSON.stringify (
                                      {
                                        category : category, 
                                        products : vm.products
                                      }
                                    )
                                  }
                                )
                                .then (response=> response.json())
                                .then (
                                  function (data) {
                                    vm.saving = false; 
                                  }
                                )
                              }
                            ) ; 
                         }, 
                         addChamp : function () {
                           let vm = this; 
                           vm.champs.push (
                            {
                              name: "",
                              align: "left",
                              label: "",
                              width: "", 
                              format : '' , 
                              isNew : true 
                            }
                           ) ; 
                         }, 

                         deleteChamp : function (pIndex) {
                           let vm = this; 
                           if (confirm ('Voulez-vous vraiment effacer cette colonne?')) {
                             vm.champs.splice (pIndex,1) ; 
                           }
                         },

                         addProduct : function () {
                          let vm = this; 
                          vm.products.unshift ({}) ;
                         },

                         deleteProduct : function (pIndex) {
                           let vm = this; 
                           if (confirm ('Voulez-vous vraiment effacer cette ligne?')) {
                            vm.products.splice (pIndex, 1) ;
                           }
                         }

                      }, 

                      mounted : 
                        function () {
                          var vm = this ; 
                          vm.loadChamps() ; 
                          vm.loadProducts() ; 
  
                        }
                    }
                  ) ; 