#!/usr/bin/node
const http = require("http");

const mongo = require("mongodb").MongoClient;
let server_url = "mongodb://localhost:27017";
let items_db;
console.clear();
mongo.connect(server_url,(err,server) =>{
    if(err){
        console.log("Error de conexion con la base de datos");
        throw err;
    }
    items_db = server.db("todolist");
});

http.createServer((request,response) =>{

    response.setHeader("Access-Control-Allow-Origin", "*");
	response.setHeader("Access-Control-Request-Method", "*");
	response.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, HEAD, PUT");
	response.setHeader("Access-Control-Allow-Headers", 'Origin, X-Request-With, Content-Type, Accept, Authorization');
    console.log(request.url);
    if(request.method == "OPTIONS"){
        response.writeHead(200);
        response.end();
        return;
    }
    if(request.url == "/submit"){
        let body = [];

        request.on("data",chunk =>{
            body.push(chunk);
        })
        .on("end",() =>{
            let items_data = JSON.parse(Buffer.concat(body).toString());
            //console.log(items_data);
            items_db.collection("items").insertOne(items_data);
        });
       
        response.end();

    }
    else if(request.url == "/get_items"){
        console.log("Hay un Get Items");

        let dataJsons = []
        //Una Promesa
        dataJsons = items_db.collection("items").find({}).toArray();
        dataJsons.then((data) =>{
            console.log(data);
            response.writeHead(200,{"Content-type" : "text/plain"});
            response.write(JSON.stringify(data))
            response.end();
        });
       
    }
}).listen(8080);