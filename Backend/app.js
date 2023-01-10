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

//Ruta o método de prueba para el API REST
/* exp.post("/probando", (req, res) => {
  var hola = req.body.hola;
  console.log("Hola Mundo desde la escucha del servidor");
  return res.status(200).send({
    curso: "Master en Frameworks",
    autor: "Victor Robles WEB",
    url: "victorroblesweb.es",
    hola
  });
}); */


//Export MODULO (fichero actual)
module.exports = app;
