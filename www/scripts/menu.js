function format (value, decimals) {
							if (typeof value == 'undefined') {
								return 0 ; 
							} else {
								return value.toFixed(decimals) ; 
						}
					}
					
Vue.filter ('format', format) ; 

var main = new Vue ({
	el : '#main', 
	data : function () {
			return {
				selectedOption : 0, 
				menu : [], 
				inventaire : [
				], 
				champs : [], 
        search_string : '' , 
        searching : true 
			} ; 
	}, 
	methods : {
		toggleOption : function (option) {
			option.active = !option.active ;
		}, 
		selectOption : function (optIndex) {
			this.selectedOption = optIndex ;
			this.loadInventaire() ;
		}, 
		loadInventaire : function () {
			var vm = this ; 
			fetch ('./bin/load-inventaire', 
							{
								method : 'POST', 
								headers : {
														'Content-Type' : 'application/json'
													}, 
								body : JSON.stringify ({category : vm.menu[vm.selectedOption].category })
							}
						)
						.then (function (response)  { return response.json() ; } ) 
						.then (
							function (data) {
								vm.inventaire = data.inventaire ; 

                data = vm.addMissingFields (data) ; 

								vm.champs = data.champs; 

							}
						) ; 
		}, 
    addMissingFields : function (data) {

      data.champs.forEach ( 
        function (e) {
          e.sorted = 0 ; 

          data.inventaire.forEach (
            function (f) {
              if (typeof f[e.name] == 'undefined') {
                f[e.name] = '' ; 
              }
            }
          )
        }
      ) ; 

      return data ; 

    },

		loadMenu : function () {
			var vm = this ; 
			
			fetch ('./bin/load-menu')
			.then (response => response.json() ) 
			.then (
				function (data) {
					vm.menu = data ; 
				}
			) ; 

		}, 
		url : function (index) {
			let vm = this; 
			let picUrl = vm.inventaire[index].picture_url ; 
			if (typeof picUrl =='undefined' || picUrl == '')	 {
				return './gfx/products/image1.jpg' ; 
			} else {
				return `./pictures/${picUrl}` ; 
			}
		}, 

    sortList : function (field) {
      let vm = this ; 
      if (typeof field.sorted == 'undefined' || field.sorted == 0  ) {
        field.sorted = 1 ; 
      } else {
        field.sorted *= -1 ; 
      }
      //vm.inventaire.sort (dynamicSort((field.sorted == -1 ? "-" : "") + field.name)) ; 
      vm.inventaire.sort (dynamicSort(`${field.sorted == -1 ? "-" : ""}${field.name}`)) ; 
    }, 
    matchFilter : function (item) {
      
      let vm = this ; 
      if (this.search_string == '') {
        return true; 
      }
      return this.findInObject (this.search_string, item) ; 
    }, 
    findInObject : function (theString, item) {
      for (let key in item) {
        const mValue = item[key] ; 
        switch (typeof mValue) {
          case 'object':
            if (findInObject(theString, mValue)) {
              return true ; 
            }
            break ; 
          case 'undefined' : 
            return true ; 
          case 'number' :
            if (mValue.toString().toLowerCase().indexOf(theString.toLowerCase()) > -1) {
              return true; 
            }
            break ; 
          default:
            if (mValue.toLowerCase().indexOf (theString.toLowerCase()) > -1) {
              return true ; 
            }
            break ; 
        }
      }
      return false ; 
    }, 
    emptySearch : function () {
      this.search_string = '' ; 
    }
    /*, 
    openSearch : function () {
      this.searching = true ; 
      $('#search_input').focus() ; 
    }, 
    closeSearch : function() {
      this.searching = false ; 
    }*/
	}, 
	mounted : function () {
		var vm = this ; 
		vm.loadMenu() ; 
		vm.selectedOption = -1 ; 
	}
}) ; 