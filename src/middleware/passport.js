const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { PrismaClient } = require("@prisma/client")

const Prisma = new PrismaClient()

passport.use(
    new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password',
            session: false
        }, async (username, password, cb) => {
            let response
            let user = await Prisma.user.findMany({
                where: {
                    email: username
                },
                select: {
                    id: true,
                    passwordString: true
                }
            })
            if (user.length > 0) {
                let compare = await bcrypt.compare(password, user[0].passwordString)
                if(compare){
                    const body = {
                        id: user[0].id,
                        usuario: username,
                        iat: Math.floor(Date.now() / 1000) - 30,
                        exp: Math.floor(Date.now() / 1000) + (60 * 60)
                    };
                    const token = jwt.sign({ user: body }, "test01", { algorithm: 'HS512', expiresIn: 50000 });
        
                    response = {
                        status: 'success',
                        token: token,
                        idUser: user[0].id
                    }
                }else{
                    response = { status: 'error', message: 'La contraseña no coincide' }
                }
            } else {
                response = { status: 'error', message: 'El usuario no fue encontrado' }
            }

            cb(null, response)
        }
    ));
