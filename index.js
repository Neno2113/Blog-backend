'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3900;



mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://anel-1:l3c7xvvs6wj@proyectos.koinw.mongodb.net/blog?retryWrites=true&w=majority', {useUnifiedTopology: true, useNewUrlParser: true})
    .then( () => {
        // console.log("Conexion realizada correctamente!!")

        app.listen(process.env.PORT || port, () => {
            // console.log("Servidor corriendo en http://localhost:"+port)
        });
    });