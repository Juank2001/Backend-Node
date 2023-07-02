const multiparty = require("multiparty")
const jwt = require('jsonwebtoken');

module.exports = {
    multipart(req, res, next) {
        let data = {}
        let content_type = req.get("Content-Type").split(";")

        if (content_type[0] == "multipart/form-data") {
            const form = new multiparty.Form();
            form.parse(req, function (err, fields, files) {
                Object.keys(fields).forEach(item => {
                    data[item] = fields[item][0]
                })

                files ? req.files = files : req.files = {}

                req.body = data

                next()
            });
        } else {
            next()
        }
    },

    verificaToken(req, res, next) {
        let jwtFromRequest = req.get('Authorization');
        if (jwtFromRequest) {
            let token = jwtFromRequest.split(' ');

            if (token[0] === 'Bearer') {
                jwt.verify(token[1], 'test01', (err, resp) => {
                    if (err) {
                        res.status(401).json({
                            status: 'unauthorized',
                            message: 'Sesion caducada, por favor vuelva a ingresar',
                            details: err
                        });
                    } else {
                        req.user = resp.user;
                        next();
                    }
                });
            } else {
                res.status(401).json({
                    status: 'unauthorized',
                    message: 'El token enviado debe ser tipo Bearer Token',
                });
            }
        } else {
            res.status(401).json({
                status: 'unauthorized',
                message: 'No se ha enviado un token para acceder'
            });
        }
    }
}