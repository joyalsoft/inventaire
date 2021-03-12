//Vue.filter ('format', format) ; 
$(document).ready (
) ; 
var main = new Vue ({
  el : '#main', 
  data : function () {
  return {
    products : [], 
    selected_line : -1 , 
    full_size : -1 
  } ; 
}, 
methods : {
  pictureUrl : function (index) {
    let url = this.products[index].picture_url ; 
    if (typeof url == 'undefined') {
      return '' ; 
    } else {
      return `../pictures/${this.products[index].picture_url}` ; 
    }
  }, 

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
        console.log (data) ; 
        vm.products = data ; 
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
  },

  uploadPicture : function () {
    console.log ('here') ; 
    var vm = this ; 
    var input = document.querySelector ('input[type="file"]') ; 
    var data = new FormData(document.getElementById ('picture-form')) ; 
    data.append ('file', input.files[0]) ;  ; 

    fetch ('../bin/upload-picture', 
      {
        method : 'POST', 
        body : data 
      }
    )
    .then (response => response.json())
    .then (
      (data) => {
        vm.changeUrl (vm.selected_line, data.filename) ; 
        //vm.products[vm.selected_line].picture_url = data.filename ; 
      }
    ) ; 
  }, 

  newPicture : function (index)  {
    this.selected_line = index ; 
    $('#filetoupload').click() ; 
  }, 

  changePicture : function (index) {
    this.newPicture (index) ; 
  }, 
  showPicture : function (index) {
    this.full_size = index ; 
  }, 

  hidePicture : function (index) {
    this.full_size = -1  ; 
  }, 

  removePicture : function (index) {
    this.changeUrl (index, null) ; 
    this.full_size = -1 ; 
  }, 

  changeUrl : function (index, url) {
    let vm = this; 
    let prod = vm.products[index] ; 
    if (url == null) {
      delete prod.picture_url ; 
    } else {
      prod.picture_url = url ; 
    }
    Vue.set (vm.products, index, prod) ; 
  }
}, 
mounted : function () {
  var vm = this ; 
  vm.loadProducts() ; 

  
  $('#filetoupload').change (vm.uploadPicture) ; 

}
}) ; 