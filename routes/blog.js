'use strict'


var express = require('express');
var BlogController = require('../controllers/blog');


var router = express.Router();
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './upload/articulo'});



//rutas
router.post('/save', BlogController.save);
router.put('/update/:id', BlogController.update);
router.delete('/delete/:id', BlogController.delete);
router.get('/article', BlogController.articlePagination);
router.get('/article/:id', BlogController.getArticle);
router.get('/search/:search', BlogController.search);
router.get('/get-image/:image', BlogController.getImage);
router.post('/upload-image/:id?', md_upload, BlogController.upload);


module.exports = router;