const express = require('express') ; 
var formidable = require ('formidable') ; 
var fs = require ('fs') ; 

const low = require ('lowdb') ; 
const FileSync  = require ('lowdb/adapters/FileSync') ; 

const adapter = new FileSync ('./db/main.json') ; 
const db = low (adapter) ; 

db.defaults(
	{
		products : [], 
		categories : [
		], 
    sequences : {
      picture_seq : 10001
    }
	}
).write() ;  

const app = express() ; 

app.use(express.static('www')) ; 

app.use (express.json()) ; 

app.post ('/bin/load-inventaire', (req, res) => { res.json (loadInventaire(req.body)) ; }) ; 

app.post ('/bin/load-products', (req, res) => {res.json (loadProducts()); }) ; 

app.get ('/bin/load-menu', (req, res) => { res.json (loadMenu ()) ; }) ; 

app.post ('/bin/save-products', (req, res) => { res.json (saveProducts (req.body)) ; }) ; 

app.post (
  '/bin/upload-picture', 
  function (req, res) {

    var form = new formidable.IncomingForm() ; 
    var fileName = '' ; 
    form.parse (req, 
      function (err, fields, files) {
        var oldpath = files.filetoupload.path ; 
        fileName = files.filetoupload.name ; 
        let newFilename = nextSequence('picture_seq'); 
        let n = fileName.lastIndexOf ('.') ; 
        if (n != -1) {
          newFilename += fileName.substring (n) ; 
        }
        
        var newpath = `www/pictures/${newFilename}` ; 

        fs.rename (oldpath, newpath,
             function (err) {
               if (err) { 
                 return res.json (
                  {
                    message : 'an error occured' 
                  }
                 ) ; 
                 //throw err ; 

               } else {
                  return res.json (
                    {
                      message : 'file uploaded', 
                      filename : newFilename
                    }
                  ) ; 
               }
             }
             
          ) ; 
      }
    ) ; 

  }
)

var port = 3001 ; 
console.log ('listening on port ' + port)  ; 
app.listen(port) ; 


function loadMenu () {
  return db.get ('categories').value() ; 
}

function loadProducts () {
  return db.get ('products').value() ; 
} 

function loadInventaire (body) {
  return { inventaire : db.get ('products').filter ({ category : body.category, sub_category : body.sub_category }).value()} ; 
}

function saveProducts (body) {
  db.set ("products", body.products).write() ; 

	refreshCategoryList (body) ; 

	return { message : 'ok'} ; 
}


function refreshCategoryList (body) {
  let categories = [] ; 
  body.products.forEach (
    function (e) {
      let cat = categories.find (elem => elem.category == e.category) ; 
      if (typeof cat == 'undefined') {
        cat = { category : e.category,
                active : false,  
                subcategories : []
              } ; 
        categories.push ( cat) ; 
      }

      let sub = cat.subcategories.find (elem => elem == e.sub_category) ; 
      if (typeof sub =='undefined') {
        cat.subcategories.push (e.sub_category) ; 
      }
    }
  ) ; 

  db.set ('categories', categories).write() ; 
}


function nextSequence (sequenceName) {
	var mvalue = db.get ('sequences.' + sequenceName).value()  ; 
	if (typeof mvalue == 'undefined') {
		mvalue = 1 ; 
	} else {
		mvalue = parseInt (mvalue +1) ; 
	}
	db.set ('sequences.' + sequenceName, mvalue).write() ; 
	return mvalue ; 
}
