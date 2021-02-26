Vue.filter ('format', format) ; 

var main = new Vue ({
  el : '#main', 
  data : function () {
  return {
    menuInventaire : [], 
    inventaire : []
  } ; 
}, 
methods : {
  toggleOption : function (option) {
    option.active = !option.active ;
  }, 
  selectOption : function (option) {
    this.selectedOption = option.option ; 

    this.loadInventaire () ; 
  }, 
  showingInventaire : function() {
    var vm = this; 
    return vm.menu.findIndex (function (e) { return e.option == vm.selectedOption; } ) == -1 ; 
  }, 
  loadInventaire : function () {
    var vm = this ; 
    fetch ('../bin/load-inventaire', 
      {
        method : 'POST', 
        headers : {
                    'Content-Type' : 'application/json'
                  }, 
        body : JSON.stringify ({category : vm.selectedOption })
      }
    )
    .then (function (response)  { return response.json() ; } ) 
    .then (
      function (data) {
        vm.inventaire = data.inventaire ; 
      }
    ) ; 
  }, 
  loadMenu : function () {
  var vm = this ; 

  fetch ('../bin/load-menu')
    .then (response => response.json() ) 
    .then (
      function (data) {
        vm.menuInventaire = data.menu ; 
      }
    ) ; 
    }
  }, 
mounted : function () {
  var vm = this ; 
  vm.loadMenu() ; 
}
}) ; 