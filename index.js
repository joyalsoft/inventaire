const { request } = require('express');
const express = require('express') ; 
var session = require ('express-session') ; 
var formidable = require ('formidable') ; 
var fs = require ('fs') ; 

const low = require ('lowdb') ; 
const FileSync  = require ('lowdb/adapters/FileSync') ; 

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('') ;  

const adapter = new FileSync ('./db/main.json') ; 
const db = low (adapter) ; 

db.defaults(
	{
		categories : [
		], 
    sequences : {
      picture_seq : 10001
    }
	}
).write() ;  

const adapterUser = new FileSync ('./db/users.json') ; 
const dbu = low (adapterUser) ; 
dbu.defaults (
  {
    users : []
  }
).write()  ; 


const app = express() ; 

app.use(express.static('www')) ; 

app.use (express.json()) ; 

app.use(
    session(
        {
          secret: 'mybigsecret',
          resave: true,
          saveUninitialized: true
        }
    )
);

const errorNotLoggedIn = {'message' : 'not logged in'}  ; 

app.get ('/maint/', function (req, res) { res.redirect('/maint/categories.html') ; }) ; 
app.get ('/maint', function (req, res) { res.redirect('/maint/categories.html') ; }) ; 
app.get ('/maint/index.html', function (req, res) { res.redirect('/maint/categories.html') ; }) ; 

app.post ('/bin/load-categories', (req, res) => { res.json (loadCategories(req.body)) ; }) ; 

app.post ('/bin/load-inventaire', (req, res) => { res.json (loadInventaire(req.body)) ; }) ; 

app.post ('/bin/load-products', (req, res) => {res.json (loadProducts(req.body)); }) ; 

app.post ('/bin/load-champs', (req,res) => { res.json (loadChamps(req.body));}) ;

app.get ('/bin/load-menu', (req, res) => { res.json (loadMenu ()) ; }) ; 

app.post ('/bin/save-products', 
            function (req, res) {
              if (req.session.loggedin) {
                return res.json (saveProducts (req.body)) ; 
              } else {
                return res.json (errorNotLoggedIn) ; 
              }
            }
          ) ; 

app.post ('/bin/save-champs', 
            function (req, res) {
              if (req.session.loggedin) {
                return res.json (saveChamps (req.body)) ; 
              } else {
                return res.json (errorNotLoggedIn) ; 
              }
            }
      ) ; 

app.post ('/bin/save-categories', 
            function (req, res) {
              console.log (req.session.loggedin) ; 
              if (req.session.loggedin) {
                return res.json (saveCategories (req.body)) ; 
              } else {
                return res.json (errorNotLoggedIn) ; 
              }
            }

        ) ; 

app.post ('/bin/login', (req, res) => {res.json(login (req)) ; }) ; 

app.post ('/bin/logout' , (req, res) => { res.json (logout(req)) ; }) ; 

app.post ('/bin/check-login', (req, res) => { res.json (checkLogin (req)) ; }) ; 

/*
maybe use later 
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
*/
var port = 3001 ; 
console.log ('listening on port ' + port)  ; 
app.listen(port) ; 


function loadMenu () {
  return db.get ('categories').value() ; 
}

function loadProducts (body) {
  return { 'products' : db.get (body.category).value()} ; 
} 

function loadInventaire (body) {
  // return { inventaire : db.get ('products').filter ({ category : body.category, sub_category : body.sub_category }).value()} ; 
  return {  inventaire : db.get (body.category).value() , 
         champs : db.get (`champs.${body.category}`).value()
  } ; 
}

function loadCategories (body) {
  return { categories : db.get ('categories').value() } ; 
}


function loadChamps (body) {
  return { champs :  db.get ('champs').get (body.category).value()} ; 
}

function saveChamps (body) {
  let result = 
    db.get ('champs').set (body.category, body.champs).write() ; 
  return { message : 'ok'} ; 
}

function saveProducts (body ) {
  db.set (body.category, body.products).write() ; 
	return { message : 'ok'} ;  
}

function saveCategories (body) {
  console.log (body.categories) ; 
  db.set ("categories", body.categories).write() ; 
  return { message : 'ok'} ; 
}

function login (request) {
  let email = request.body.email ; 
  let password = request.body.password ; 
  request.session.loggedin = false ; 

    if (email && password) {
      let record = dbu.get('users').filter ( {email : email , password : password}).value() ; 
      if (record.length > 0 ) {
        request.session.loggedin = true ; 
        return { message :'ok'} ; 
      } else {
        return { message : 'failed' } ; 
      }
    } else {
      return { 'message' : 'failed'} ; 
    }
}

function logout (request) {
  request.session.loggedin = false; 
  return { message : 'ok'} ; 
}

function checkLogin (request) {
  if (typeof request.session.loggedin == 'undefined') {
    request.session.loggedin = false; 
  }
  return { logged_in : request.session.loggedin } ; 
}



