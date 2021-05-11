const { response } = require("express");

var main = new Vue({
  el: '#main',
  data: function () {
    return {
      current_key : '', 
      password : ''
    };
  },
  methods: {
    loadData : function () {
      let vm = this ; 
      vm.current_key = '' ; 
      if (typeof localStorage.current_key !='undefined') {
        vm.current_key = localStorage.current_key ; 
      }

      if (vm.current_key != '') {
        vm.validateKey() ; 
      }
    }, 
    login : function () {
      let vm = this ; 
      fetch ('./bin/get-new-key', 
              {
                method : 'POST', 
                headers : {
                  'Content-Type' : 'application/json'
                }, 
                body : JSON.stringify ({password : vm.password}) 
              }
            ) 
            .then (response=>response.json())
            .then (
              function (data) {
                vm.password = '' ; 
                vm.current_key = data.current_key ; 
                localStorage.setItem ('current_key', vm.current_key) ; 
                vm.validateKey() ; 
              }
            )
            ; 
    }, 
    validateKey : function () {
      let vm = this ; 
      fetch ('./bin/validate-key', 
            {
              method : 'POST', 
              headers : {
                'Content-Type' : 'application/json'
              }, 
              body : JSON.stringify ({current_key : vm.current_key})
            }
          )
          .then (response=>response.json())
          .then ( 
            function (data) {
              if (!data.valid)  {
                vm.current_key = '' ; 
                vm.password = '' ; 
                localStorage.removeItem ('current_key') ; 
              }
            }
          )
          ;
    }
  },
  mounted: function () {
    var vm = this;
    vm.loadData();
  }
});