Vue.directive("uppercase", {
    update: function (el) {
        el.value = el.value.toUpperCase() ; 
				 el.dispatchEvent(new Event('input')) ; 
    }
}) ; 
