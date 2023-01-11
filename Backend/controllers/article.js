"use strict";

var validator = require("validator");
var Article = require("../models/article");

var controller = {
  datosCurso: (req, res) => {
    var hola = req.body.hola;
    return res.status(200).send({
      curso: "Master en Frameworks",
      autor: "Victor Robles WEB",
      url: "victorroblesweb.es",
      hola,
    });
  },

  test: (req, res) => {
    return res.status(200).send({
      message: "Soy la acción test de mi controlador de artículos",
    });
  },

  save: (req, res) => {
    //Recoger parametros por post
    var params = req.body;

    //Validar datos
    try {
      var validate_title = !validator.isEmpty(params.title);
      var validate_content = !validator.isEmpty(params.content);
    } catch (error) {
      //Cuando faltan datos en el post entra al error
      return res.status(200).send({
        message: "Faltan datos por enviar !!!",
      });
    }

    if (validate_title && validate_content) {
      //Crear el objeto a aguardar

      //Asignar valores

      //Guardar articulo

      // Devolver respuesta
      return res.status(200).send({
        article: params,
      });
    } else {
      //Cuando alguno de los datos del post es vacio
      return res.status(200).send({
        message: "Los datos no son válidos !!!",
      });
    }
  },
};

module.exports = controller;
