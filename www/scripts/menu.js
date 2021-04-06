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
				champs : []
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
								console.log (data) ; 
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
					console.log (data) ; 
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
    }
	}, 
	mounted : function () {
		var vm = this ; 
		vm.loadMenu() ; 
		vm.selectedOption = -1 ; 
	}
}) ; 