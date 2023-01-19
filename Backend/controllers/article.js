"use strict";

var validator = require("validator");
var Article = require("../models/article");
var fs = require('fs'); //file system permite eliminar archivos
var path = require('path');//obtener path en el sistema del servidor
const { exists } = require("../models/article");

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
    if (!articleId || articleId == null) {
      return res.status(404).send({
        status: "error",
        message: "no existe el artículo !!!",
      });
    }

    //Buscar el artículo
    Article.findById(articleId, (err, article) => {
      if (err || !article) {
        return res.status(500).send({
          status: "error",
          message: "No existe el artículo !!!",
        });
      }
      //Devolver el artículo
      return res.status(200).send({
        status: "success",
        article,
      });
    });
  },

  update: (req, res) => {
    //Recoger id del artículo
    var article_id = req.params.id;

    //Recoger los datos recibidos por PUT
    var params = req.body;

    //Validar los datos
    try {
      var validate_title = !validator.isEmpty(params.title);
      var validate_content = !validator.isEmpty(params.content);
    } catch (err) {
      return res.status(200).send({
        status: "error",
        message: "Faltan datos por enviar !!!",
      });
    }
    if (validate_content && validate_title) {
      //Hacer consulta y update
      Article.findOneAndUpdate(
        { _id: article_id },
        params,
        { new: true },
        (err, articleUpdated) => {
          if (err) {
            return res.status(500).send({
              status: "error",
              message: "Error al actualizar !!!",
            });
          }
          if (!articleUpdated) {
            return res.status(404).send({
              status: "error",
              message: "No existe el artículo !!!",
            });
          }
          return res.status(200).send({
            status: "success",
            article: articleUpdated,
          });
        }
      );
    } else {
      return res.status(200).send({
        status: "error",
        message: "La validación no es correcta !!!",
      });
    }
  },

  delete: (req, res) => {
    //Recoger el id de la url
    var articleId = req.params.id;

    //buscar y borrar
    Article.findOneAndDelete({ _id: articleId }, (err, articleRemoved) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: " error al borrar!!!",
        });
      }
      if (!articleRemoved) {
        return res.status(404).send({
          status: "error",
          message: "No se ha borrado el articulo, posiblemente no existe !!!",
        });
      }
      return res.status(200).send({
        status: "success",
        article: articleRemoved,
      });
    });
  },

  upload: (req, res)=>{
    //Configurar el módulo connect multiparty router/article

    //Recoger el fichero
    var file_name = 'Imagen no subida';
    
    if(!req.files){
      return res.status(404).send({
        status: 'error',
        message: file_name
      });
    }
    //Conseguir el nombre y la extenciíon del archivo
    var file_path = req.files.file0.path;
    var file_split = file_path.split('\\');

    //Nombre del archivo 
    var file_name = file_split[2];
    //Extensión del archivo
    var extension_split = file_name.split('\.');
    var file_ext = extension_split[1];
    
    //Comprobar la extensión, solo imégenes, si no es valida se borra el fichero
   

    if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif' ){
      //Borrar el archivo subido
      fs.unlink(file_path, (err)=>{
        return res.status(200).send({
          status: 'error',
          message: 'La extención de la imagen no es válida XD'
        });
      });
    }else{
      //Sí todo es válido
      var articleId = req.params.id;

      //Buscar el artículo, asignarle en nombre de la imágen y actualizarlo

      Article.findOneAndUpdate({_id: articleId}, {image: file_name}, {new:true}, (err, articleUpdated)=>{ 
        if(err || !articleUpdated){
          return res.status(404).send({
            status: 'error',
            message: 'Error al guardar la imágen del artículo'
          });
        }

        return res.status(200).send({
          status: 'success',
          article: articleUpdated
        });

      });
     
    }   
  },
  
  getImage: (req, res)=>{
    var file = req.params.image;
    var path_file = './upload/articles/'+file;
    
    fs.exists(path_file, (exists)=>{
      console.log(exists);
      if(exists){
        return res.sendFile(path.resolve(path_file));

      }else{
        return res.status(404).send({
          status: 'error',
          message: 'La imagen no existe'
        });

      }
    });

  },

  search: (req, res)=>{
    //Sacar el string a buscar
    var searchString = req.params.search;

    //Construccion de find para obtener todas las incidencias en el buscador
    Article.find({"$or":[
      {"title": { "$regex": searchString, "$options": "i"}},
      {"content": { "$regex": searchString, "$options": "i"}}
    ]})
    .sort([['date', 'ascending']])
    .exec((err, articles)=>{
  

      if(err){
        return res.status(500).send({
          status: 'error',
          mesaje: 'Error en la petición !!!'
        });
      }

      if(!articles || articles.length >=0){
        return res.status(404).send({
          status: 'error',
          mesaje: 'No existen artículos que coincidan con tu busqueda !!!'
        });
      }

      return res.status(200).send({
        status: 'success',
        searchString,
        articles,
        
      });


    })


    
    
  }


};

module.exports = controller;
