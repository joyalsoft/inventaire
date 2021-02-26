const express = require('express') ; 
var bodyParser = require('body-parser') ; 

// const low = require ('lowdb') ; 
//const FileSync  = require ('lowdb/adapters/FileSync') ; 

//const adapter = new FileSync ('./db/main.json') ; 
//const db = low (adapter) ; 
/*
db.defaults(
	{
		products : [], 
		categories : [
		]
	}
).write() ;  
*/

const jsonfile = require ('jsonfile') ; 
const file = 'db/main.json' ; 
var jdb = jsonfile.readFileSync (file) ; 

/*

jsonfile.writeFile (file, jdb, { spaces: 2, EOL: '\r\n' })
  .then (res => {
    console.log ('Write complete')
  })
  .catch (error => console.error (error)) ; 
*/
const app = express() ; 

app.use(express.static('www')) ; 

app.use (bodyParser.json()) ; 

app.post ('/bin/load-inventaire', (req, res) => { res.json (loadInventaire(req.body)) ; }) ; 

app.post ('/bin/load-products', (req, res) => {res.json (loadProducts()); }) ; 

app.get ('/bin/load-menu', (req, res) => { res.json (loadMenu ()) ; }) ; 

app.post ('/bin/save-products', (req, res) => { res.json (saveProducts (req.body)) ; }) ; 

var port = 3001 ; 
console.log ('listening on port ' + port)  ; 
app.listen(port) ; 


function loadMenu () {
	return { menu : jdb.categories  } ; 
}

function loadProducts () {
	return { products : jdb.products} ; 
} 

function loadInventaire (body) {
  console.log (body) ; 
  console.log (jdb.products) ; 
	return { inventaire : jdb.products.filter(e => e.category == body.category && e.sub_category == body.sub_category  ) } ; 
	//return { inventaire : db.get (category).get ("items") } ; 
}

function saveProducts (body) {
  jdb.products = body.products ; 
  /*
  db.remove ("products").remove().value() ; 
	db.set ("products", body.products).value() ; 
	db.write() ; 
 */
	refreshCategoryList (body) ; 
  console.log ('71') ; 
  console.log (jdb) ; 
  writeDbFile() ; 

	return { message : 'ok'} ; 
}


function refreshCategoryList (body) {
  body.products.forEach (
    function (e) {
      let cat = jdb.categories.find (elem => elem.category == e.category) ; 
      if (typeof cat == 'undefined') {
        cat = { category : e.category,
                active : false,  
                subcategories : []
              } ; 
        jdb.categories.push ( cat) ; 
        console.log (90) ; 
      }  else {
        console.log (92) ; 
      }

      let sub = cat.subcategories.find (elem => elem == e.sub_category) ; 
      if (typeof sub =='undefined') {
        cat.subcategories.push (e.sub_category) ; 
        console.log (98) ; 
      }
      console.log (100) ; 
      console.log (cat) ; 
    }
  ) ; 

}

function writeDbFile () {
    jsonfile.writeFile (file, jdb, { spaces: 2, EOL: '\r\n' })
    .then (res => {
      //console.log ('Write complete')
    })
    .catch (error => console.error (error)) ; 
}