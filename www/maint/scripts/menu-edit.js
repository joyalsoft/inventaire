//Vue.filter ('format', format) ; 

var main = new Vue ({
  el : '#main', 
  data : function () {
  return {
    products : []
  } ; 
}, 
methods : {
  loadProducts : function () {
    var vm = this ; 
    fetch ('../bin/load-products', 
      {
        method : 'POST', 
        headers : {
                    'Content-Type' : 'application/json'
                  }, 
        body : JSON.stringify ({})
      }
    )
    .then (function (response)  { return response.json() ; } ) 
    .then (
      function (data) {
        vm.products = data.products ; 
      }
    ) ; 
  },

  newProduct : function () {
    var vm = this; 
    vm.products.push ({}) ; 
    return ; 
  }, 
  saveList : function () {
    var vm = this; 
    fetch ('../bin/save-products', 
          {
            method : 'POST', 
            headers : {
              'Content-Type' : 'application/json'
            }, 
            body : JSON.stringify ( {products : vm.products })
          }
      )
      .then (response => response.json())
      .then ( 
        function (data) {
          alert (data.message) ; 
        }
      ) ; 
  }
}, 
mounted : function () {
  var vm = this ; 
  vm.loadProducts() ; 
}
}) ; 