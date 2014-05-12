var mysql = require("mysql");

var oauth2db = mysql.createConnection({
    host: "localhost",
    user: "1",
    password:"1",
    database:"oauth2db"
});


oauth2db.connect(function(err){
    if(err){
	console.log("error when connecting "+err.stack);
	return;
    }

    console.log("connected! as id "+oauth2db.threadId);
});


var createOAuthAccessTokensTable = "create table oauth_access_tokens (access_token varchar(100) not null, client_id varchar(50) not null, user_id int not null, expires timestamp not null,primary key(access_token));"; 

var createOAuthClientsTable = "create table oauth_clients (client_id varchar(100) not null,client_secret varchar(50) not null,redirect_uri varchar(100) not null,primary key(client_id,client_secret));"; 

var createOAuthRefreshTokensTable = "create table oauth_refresh_tokens (refresh_token varchar(100) not null,client_id varchar(50) not null,user_id int not null,expires timestamp not null,primary key(refresh_token));"; 

var createUsersTable = "create table users (id int not null,username varchar(50) not null,password varchar(50) not null,primary key(id));"; 


oauth2db.query(createOAuthAccessTokensTable,function(err,rows,fiels){
    if(err){
	console.log("error! "+err);
    }else{
	console.log("exito al crear tabla oauth_access_tokens");
    };
});

oauth2db.query(createOAuthClientsTable,function(err,rows,fiels){
    if(err){
	console.log("error! "+err);
    }else{
	console.log("exito al crear tabla oauth_clients");
    };
});

oauth2db.query(createOAuthRefreshTokensTable,function(err,rows,fiels){
    if(err){
	console.log("error! "+err);
    }else{
	console.log("exito al crear tabla oauth_refresh_tokens");
    };
});

oauth2db.query(createUsersTable,function(err,rows,fiels){
    if(err){
	console.log("error! "+err);
    }else{
	console.log("exito al crear tabla users");
    };
});


oauth2db.end(function(err){
    if(err){
	console.log("error when closing connection "+err.stack);
	return;
    }

    console.log("disconnected!");
});