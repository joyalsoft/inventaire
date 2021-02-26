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
				selectedOption : 'accueil', 
				menu : [
					{ 
						label : 'Accueil', 
						option : 'accueil', 
						url : 'accueil.html'
					}, 
					{ label : 'Services', 
						option : 'services', 
						url : 'services.html'
					}
				], 
				menuInventaire : [
					/*
					{ 
						label : 'Produits', 
						submenu : true, 
						active : false ,
						options : [
							{ label : 'Pieces', option : 'pieces'}, 
							{ label : 'Outils', option : 'outils'}
						]
					}*/
				 ], 
				inventaire : [
				]
			} ; 
	}, 
	methods : {
		toggleOption : function (option) {
			option.active = !option.active ;
		}, 
		selectOption : function (option, subcategory) {
			console.log (option) ; 

			this.selectedOption = option ; 
			
			this.loadInventaire (subcategory) ; 
		}, 
		displayPage : function (option) {
			this.selectedOption = option.option ; 
			$('#main-view').load (option.url) ; 
		}, 
		showingInventaire : function() {
			var vm = this; 
			return vm.menu.findIndex (function (e) { return e.option == vm.selectedOption; } ) == -1 ; 
		}, 
		loadInventaire : function (subCategory) {
			var vm = this ; 
			let sub = subCategory ; 
			if (typeof subCategory == 'undefined') {
				sub = '' ; 
			}
			console.log (vm.selectedOption) ; 
			console.log (sub) ; 
			console.log (JSON.stringify ({category : vm.selectedOption , sub_category : sub})) ; 
			fetch ('./bin/load-inventaire', 
							{
								method : 'POST', 
								headers : {
														'Content-Type' : 'application/json'
													}, 
								body : JSON.stringify ({category : vm.selectedOption , sub_category : sub})
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
			
			fetch ('./bin/load-menu')
				/*{
					method : 'POST', 
					headers : {
											'Content-Type' : 'application/json'
										}, 
					body : {} 
				}
			)*/
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
		vm.selectedOption = 'accueil' ; 
		vm.displayPage (vm.menu.find (function (e) { return  e.option == vm.selectedOption ;} )) ; 
	}
}) ; 