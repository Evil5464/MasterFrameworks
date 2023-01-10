"use strict";
//Cargar modulos de node para crear el servidor
var express = require("express");
var bodyParser = require("body-parser");

//Ejecutar Express (http)
var app = express();

// Cargar ficheros rutas
var article_routers = require('./routes/article');


// Middlewares realizan acciones antes de ejecutar los métodos principales
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS


//añadir prefijos a rutas / Cargar rutas
app.use('/api', article_routers);

//Export MODULO (fichero actual)
module.exports = app;
