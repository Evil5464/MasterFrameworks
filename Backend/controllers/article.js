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

    //Validar datos(validator)
    try {
      var validate_title = !validator.isEmpty(params.title);
      var validate_content = !validator.isEmpty(params.content);
    } catch (error) {
      //Cuando faltan datos en el post entra al error
      return res.status(200).send({
        status: "error",
        message: "Faltan datos por enviar !!!",
      });
    }

    if (validate_title && validate_content) {
      //Crear el objeto a aguardar
      var article = new Article();

      //Asignar valores
      article.title = params.title;
      article.content = params.content;
      article.image = null;

      //Guardar articulo
      article.save((err, articleStored) => {
        if (err || !articleStored) {
          return res.status(404).send({
            status: "error",
            message: "El artículo no se ha guardado!!!",
          });
        }

        // Devolver respuesta
        return res.status(200).send({
          status: "success",
          article: articleStored,
        });
      });
    } else {
      //Cuando alguno de los datos del post es vacio
      return res.status(200).send({
        status: "error",
        message: "Los datos no son válidos !!!",
      });
    }
  },

  getArticles: (req, res) => {
    var query = Article.find({});

    var last = req.params.last;
    if (last || last != undefined) {
      query.limit(5);
    }

    //Find para consultar artículos en orden descendente
    query.sort("-_id").exec((err, articles) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "error al devolver los artículos !!!",
        });
      }

      if (!articles) {
        return res.status(404).send({
          status: "error",
          message: "no hay artículos para mostrar!!!",
        });
      }

      return res.status(200).send({
        status: "success",
        articles,
      });
    });
  },

  getArticle: (req, res) => {
    //Recoger el id de la url
    var articleId = req.params.id;

    //Comprobar si existe
    if(!articleId || articleId == null){
      return res.status(404).send({
        status: "error",
        message: 'no existe el artículo !!!'
      });
    }

    //Buscar el artículo
    Article.findById(articleId, (err, article)=>{
     
      if(err || !article){
        return res.status(500).send({
          status: "error",
          message: 'No existe el artículo !!!'
        });
      }
      //Devolver el artículo
      return res.status(200).send({
        status: "success",
        article,
      });

    });
  },
};

module.exports = controller;
