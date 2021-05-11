function format (value, decimals) {
  if (typeof value == 'undefined') {
    return 0 ; 
  } else {
    if (isNaN(value)) {
      return value ; 
    } else {
       return parseFloat (value).toFixed(decimals) ; 
    }
}
}

Vue.filter ('format', format) ; 
