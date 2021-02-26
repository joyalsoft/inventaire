const express = require('express') ; 
var bodyParser = require('body-parser') ; 

const low = require ('lowdb') ; 
const FileSync  = require ('lowdb/adapters/FileSync') ; 

const adapter = new FileSync ('./db/main.json') ; 
const db = low (adapter) ; 

/*db.defaults(
	{
		categories : []
	}
).write() ;  
*/
const app = express() ; 

app.use(express.static('www')) ; 

app.use (bodyParser.json()) ; 

app.post ('/bin/load-inventaire', (req, res) => { res.json (loadInventaire(req.body.category)) ; }) ; 

app.get ('/bin/load-menu', (req, res) => { res.json (loadMenu ()) ; }) ; 

var port = 3001 ; 
console.log ('listening on port ' + port)  ; 
app.listen(port) ; 


function loadMenu () {
	return { menu : db.get ("menu") } ; 
}

function loadInventaire (category) {
	
	return { inventaire : db.get (category).get ("items") } ; 
	/*
	var inventory = {
	}  ; 
	
	if (category == 'pieces') {
		inventory.inventaire = [
			{ 'product' : 'prod001', 
				'label' : 'Piece 1', 
				'price' : 10.50
			}, 
			{
				'product' : 'prod002', 
				'label' : 'Piece 2', 
				'price' : 48.99
			}, 
			{ 'product' : 'prod005', 
				'label' : 'Piece 3', 
				'price' : 10.50
			}, 
			{ 'product' : 'prod006', 
				'label' : 'Piece 4', 
				'price' : 10.50
			}, 
			{ 'product' : 'prod007', 
				'label' : 'Piece 5', 
				'price' : 10.50
			}, 
			{ 'product' : 'prod008', 
				'label' : 'Piece 6', 
				'price' : 10.50
			}, 
			{ 'product' : 'prod009', 
				'label' : 'Piece 7', 
				'price' : 10.50
			}, 
			{ 'product' : 'prod010', 
				'label' : 'Piece 8', 
				'price' : 10.50
			}, 
			{ 'product' : 'prod011', 
				'label' : 'Piece 9', 
				'price' : 10.50
			}, 
			{ 'product' : 'prod012', 
				'label' : 'Piece 10', 
				'price' : 10.50
			}, 
			
		]; 
	} else if (category == 'outils' ) {
		inventory.inventaire = [
			{ 'product' : 'prod003', 
				'label' : 'Outils 1', 
				'price' : 199.95
			}, 
			{
				'product' : 'prod004', 
				'label' : 'Outils 2', 
				'price' : 50
			}
		]; 
	}
	return inventory ; 
	*/
}