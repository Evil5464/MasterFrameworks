'use strict'

var express = require('express');
var ArticleController = require('../controllers/article.js');
var router = express.Router();

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './upload/articles'});//Definimos Meddleware de multiparty

// Rutas de prueba para artículos
router.get('/test-de-controlador', ArticleController.test);
router.post('/datos-curso', ArticleController.datosCurso);


// Rutas útiles
router.post('/save', ArticleController.save);
router.get('/articles/:last?', ArticleController.getArticles);
router.get('/article/:id', ArticleController.getArticle);
router.put('/article/:id', ArticleController.update);
router.delete('/article/:id', ArticleController.delete);
router.post('/upload-image/:id', md_upload, ArticleController.upload);//Usamos el meddleware desde la ruta
router.get('/get-image/:image', ArticleController.getImage);
router.get('/search/:search', ArticleController.search);

module.exports = router;
