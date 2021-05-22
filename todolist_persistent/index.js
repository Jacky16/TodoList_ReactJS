#!/usr/bin/node


const http = require("http");
const mongo = require("mongodb").MongoClient;

const server_url = "mongodb://localhost:27017";

let todolist_db;
console.clear();

mongo.connect(server_url, (err, server) => {

	todolist_db = server.db("todolist");

});


http.createServer( (req, res) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Request-Method", "*");
	res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, HEAD, PUT");
	res.setHeader("Access-Control-Allow-Headers", 'Origin, X-Request-With, Content-Type, Accept, Authorization');
	if (req.method === "OPTIONS"){
		res.writeHead(200);
		res.end();
		return;
	}

	if (req.url == "/submit"){
		let body = [];
		req.on("data", chunk => {

			body.push(chunk);

		}).on("end", () => {
			let data = Buffer.concat(body).toString();

			//console.log(data);

			let item_data = JSON.parse(data);

			todolist_db.collection("items").insertOne({
				id: item_data.id,
				item_name: item_data.item_name
			});
		});
		
		res.end();
	}
	else if (req.url == "/get_items"){
		let list = todolist_db.collection("items").find({}).toArray();
        
		list.then( (data) => {

			res.writeHead( 200, {'Content-Type':'text/text' });

			res.write(JSON.stringify(data));
			res.end();
		});
	}else if(req.url == "/remove_all"){
        todolist_db.collection("items").drop();
        res.end();
    }
    else if(req.url == "/remove"){
        console.log("remove a item");
		let body = [];
		req.on("data", chunk => {

			body.push(chunk);

		}).on("end", () => {
			let data = Buffer.concat(body).toString();

			let item_data = JSON.parse(data);

			todolist_db.collection("items").deleteOne({
				id: item_data.id,
				item_name: item_data.item_name
			});
		});
		
		res.end();
    }
}).listen(8080);