"use strict";

var controller = {
  datosCurso: (req, res) => {
    var hola = req.body.hola;
    return res.status(200).send({
      curso: "Master en Frameworks",
      autor: "Victor Robles WEB",
      url: "victorroblesweb.es",
      hola
    });
  },

  test: (req, res)=>{
    return res.status(200).send({
        message: 'Soy la acción test de mi controlador de artículos'
    });
  }

};

module.exports = controller;
