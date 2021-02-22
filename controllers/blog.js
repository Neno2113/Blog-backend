'use strict'


var Article = require('../models/article');
var path = require('path');
var fs = require('fs');
var validator = require('validator');
const { exists } = require('../models/article');


var controller = {


    save: (req, res) => {
        var params = req.body;

        // console.log(params);

        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        } catch (error) {   
            return res.status(200).send({
                status: "Error",
                message: "Faltan datos por enviar"
            })
        }

        if(validate_title && validate_content ){
            var article = new Article();

            article.title = params.title
            article.content = params.content;
            if(params.image){
                article.image = params.image;
            } else {
                article.image = null;
            }


            article.save((err, articleStored) => {
                if(err || !articleStored){
                    return res.status(404).send({
                        status: "Error",
                        message: "El articulo no se pudo guardar"
                    });
                } else {
                    return res.status(200).send({
                        status: "success",
                        article: articleStored
                    })
                }
            })


        } else {
            return res.status(200).send({
                status: "Error",
                message: "Faltan datos por enviar"
            });
        }
    },

    update: (req, res) => {
        var id = req.params.id;

        let params = req.body;

        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        } catch (error) {   
            return res.status(200).send({
                status: "Error",
                message: "Faltan datos por enviar"
            })
        }


        if(validate_title && validate_content){
            Article.findByIdAndUpdate({_id: id}, params, {new: true},(err, articleUpdated) => {
                if(err){
                    return res.status(500).send({
                        status: "Error",
                        message: "Error al actualizar"
                    })
                }

                if(!articleUpdated){
                    return res.status(404).send({
                        status: "Error",
                        message: "No existe el articulo"
                    })
                }

                return res.status(200).send({
                    status: "Error",
                    article: articleUpdated
                });
            });
        } else {
            return res.status(200).send({
                status: "Error",
                message: "Faltan datos por enviar"
            })
        }
    },

    delete: (req, res) => {
        let id = req.params.id;

        Article.findOneAndDelete({_id: id}, (err, articleRemoved) => {
            if(err){
                return res.status(500).send({
                    status: "Error",
                    message: "Error al borrar"
                })
            }

            if(!articleRemoved){
                return res.status(404).send({
                    status: "Error",
                    message: "No se ha encontrado el articulo a borrar"
                })
            }


            return res.status(200).send({
                status: "success",
                article: articleRemoved
            })
        })
    },

    getArticle: (req, res) => {
        let id = req.params.id;
        // console.log(id);

        if(!id || id == null){
            return res.status(404).send({
                status: "Error",
                message: "Debe indicar el articulo"
            });
        }

        Article.findById(id, (err, article) => {
            if(err || !article){
                return res.status(404).send({
                    status: "Error",
                    message: "No existe el articulo"
                })
            }

            return res.status(202).send({
                status: "success",
                article: article
            })
        })


    },

    articlePagination: (req, res) => {
        const limit = req.query.limit || 5;
        const page = req.query.page || 1;

        const options = {
            page: page,
            limit: limit,
            sort: {
                date: -1
            }
        }


        Article.paginate({}, options, (err, articleStored) => {
            if(err){
                return res.status(500).send({
                    status: "Error",
                    message: "ocurrio un error"
                });
            }

            if(!articleStored){
                return res.status(404).send({
                    status: "Error",
                    message: "No hay nada que mostrar"
                });
            }

            return res.status(202).send({
                status: "success",
                article: articleStored
            });
        })
    },

    upload: (req, res) => {
        var file_name = "Imagen no subida";

        // console.log(req.files);
        if(!req.files){
            return res.status(404).send({
                status: "Error",
                message: file_name,
                file: req.files
            });
        }

        var file_path = req.files.file0.path;
        var file_split = file_path.split('/');

        var file_name = file_split[2];

        var extension = file_name.split('.');
        var file_ext = extension[1];

        if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif'){
            fs.unlink(file_path, (err) => {
                res.status(200).send({
                    status: "Error",
                    message: "La extension no es valida"
                });
            });
        } else {
            var id = req.params.id;

            if(id){
                Article.findOneAndUpdate({_id: id}, {image: file_name}, {new: true}, (err, articleUpdated) => {
                    if(err || !articleUpdated){
                        return res.status(500).send({
                            status: "Error",
                            message: "Error al guardar la imagen"
                        })
                    }

                    return res.status(200).send({
                        status: "success",
                        article: articleUpdated
                    });
                })
            } else {
                return res.status(200).send({
                    status: "success",
                    image: file_name
                });
            }
        }


    },

    getImage: (req, res) => {
        var file = req.params.image;

        var path_file = './upload/articulo/'+ file;

        fs.exists(path_file, (exists) => {
            if(exists){
                return res.sendFile(path.resolve(path_file));
            } else {
                return res.status(404).send({
                    status: "Error",
                    message: "No se encontro la imagen"
                })
            }
        })
    },

    search: (req, res) => {
        var searString = req.params.search;


        Article.find({"$or" : [
            {"title": {"$regex": searString, "$options": "i"}},
            {"content": {"$regex": searString, "$options": "i"}}
        ]})
        .sort([['date', 'desc']])
        .exec((err, articles) => {
            if(err){
                return res.status(500).send({
                    status: "Error",
                    message: "Error en la peticion!"
                });
            }

            if(!articles || articles.length <= 0){
                return res.status(404).send({
                    status: "Error",
                    message: "No hay articulos que coincidan con tu busqueda!!"
                });
            } else {
                return res.status(200).send({
                    status: "success",
                    articles
                });
            }
        })
    }
}


module.exports = controller;