const { PrismaClient } = require("@prisma/client")
const bcript = require("bcrypt")
const fs = require("fs")
const path = require("path")
const passport = require('passport');

const Prisma = new PrismaClient()

const createUser = async (req, res) => {
    let data = req.body

    let response
    let userCount = await Prisma.user.count({
        where: {
            email: data.email
        }
    })

    if (data.email != '') {
        var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        const isValidEmail = data.email.match(emailFormat);
        if (isValidEmail) {
            if (data.passwordString != '') {
                if (data.name != '') {
                    if (userCount == 0) {
                        data.passwordString = bcript.hashSync(data.passwordString, 12)
                        await Prisma.user.create({
                            data: data
                        })
                        response = { status: "success", message: `El usuario fue registrado exitosamente` }
                    } else {
                        response = { status: "error", message: `El correo ${data.email} ya se encuentra registrado` }
                    }
                } else {
                    response = { status: 'error', message: 'El nombre no puede ir vacio' }
                }
            } else {
                response = { status: 'error', message: 'La contraseña no puede estar vacía' }
            }
        } else {
            response = { status: 'error', message: 'El correo no tiene un formato válido' }
        }
    } else {
        response = { status: 'error', message: 'El correo no puede estar vacío' }
    }


    res.json(response)
}

const updateUser = async (req, res) => {

    let data = req.body
    let dataUpdate = {}
    let pathname = ""
    let response = ""

    if (data.id) {
        let userCount = await Prisma.user.count({
            where: {
                id: typeof data.id === "number" ? data.id : Number.parseInt(data.id)
            }
        })
        if (userCount == 0) {
            response = { status: "error", message: `El usuario ${data['id']} no existe` }
        } else {
            Object.keys(data).forEach(item => {
                if (item == "passwordString") {
                    dataUpdate[item] = bcript.hashSync(data[item], 12)
                } else if (item != "id") {
                    dataUpdate[item] = data[item]
                }
            })

            if (Object.keys(req.files | {}).length > 0) {
                if (req.files.file.length > 0) {
                    let file = req.files.file[0]
                    pathname = path.join(__dirname, '..', 'uploads', file.originalFilename)
                    fs.copyFileSync(file.path, pathname)
                    dataUpdate["photo"] = file.originalFilename
                }
            }

            let user = await Prisma.user.update({
                data: dataUpdate,
                where: {
                    id: typeof data.id === "number" ? data.id : Number.parseInt(data.id)
                }
            })
            response = { status: "success", message: "Usuario actualizado con exito" }
        }
    } else {
        response = { status: "error", message: `El usuario no puede ir vacio` }
    }

    res.json(response)
}

const login = (req, res) => {
    let sig = false
    let response
    if (req.body.username && req.body.username != '') {
        sig = true
    } else {
        sig = false
        response = { status: "error", message: "No se ha enviado un usuario" }
    }

    if (sig) {
        if (req.body.password && req.body.password != '') {
            sig = true
        } else {
            sig = false
            response = { status: "error", message: "No se ha enviado una contraseña" }
        }

        if (sig) {
            passport.authenticate('local', { passReqToCallback: true }, (err, resp) => {
                res.json(resp)
            })(req, res)
        } else {
            res.json(response)
        }

    } else {
        res.json(response)
    }
}

const createProducts = async (req, res) => {
    let data = req.body
    let response

    let product = await Prisma.product.count({
        where: {
            code: typeof data.code === "number" ? data.code : Number.parseInt(data.code)
        }
    })
    if (product == 0) {

        data.price ? data.price = typeof data.price === "number" ? data.price : Number.parseInt(data.price) : ""
        data.stock ? data.stock = typeof data.stock === "number" ? data.stock : Number.parseInt(data.stock) : ""
        data.code ? data.code = typeof data.code === "number" ? data.code : Number.parseInt(data.code) : ""

        await Prisma.product.create({
            data: data
        })

        response = { status: "success", message: "Producto creado exitosamente" }
    } else {
        response = { status: "error", message: "Ya existe un producto registrado con ese codigo" }
    }

    res.json(response)
}

const listProducts = async (req, res) => {
    const listProduct = await Prisma.product.findMany({
        select: {
            name: true,
            price: true,
            stock: true
        }
    })

    res.json(listProduct)
}

const updateProducts = async (req, res) => {
    let data = req.body
    let dataUpdate = {}
    let response

    let productCount = await Prisma.product.count({
        where: {
            id: typeof data.id === "number" ? data.id : Number.parseInt(data.id)
        }
    })

    if (productCount == 0) {
        response = { status: "error", message: `El producto ${data['id']} no existe` }
    } else {
        Object.keys(data).forEach(item => {
            if (item != 'id') {
                dataUpdate[item] = data[item]
            }
        })

        dataUpdate.stock ? dataUpdate.stock = typeof dataUpdate.stock === 'number' ? dataUpdate.stock : Number.parseInt(dataUpdate.stock) : ""
        dataUpdate.price ? dataUpdate.price = typeof dataUpdate.price === 'number' ? dataUpdate.price : Number.parseInt(dataUpdate.price) : ""

        await Prisma.product.update({
            data: dataUpdate,
            where: {
                id: typeof data.id === "number" ? data.id : Number.parseInt(data.id)
            }
        })

        response = { status: "success", message: "El producto fue actualizado exitosamente" }
    }

    res.json(response)
}

const storeProducts = async (req, res) => {
    let data = req.body
    let response

    let productCount = await Prisma.product.count({
        where: {
            id: typeof data.ProductId === "number" ? data.ProductId : Number.parseInt(data.ProductId)
        }
    })

    if (productCount > 0) {
        data.stock ? data.stock = typeof data.stock === 'number' ? data.stock : Number.parseInt(data.stock) : ""
        data.ProductId ? data.ProductId = typeof data.ProductId === 'number' ? data.ProductId : Number.parseInt(data.ProductId) : ""
        await Prisma.store.create({
            data: data
        })
        response = { status: "success", message: "Registro creado exitosamente" }
    } else {
        response = { status: "error", message: "No existe el producto" }
    }
    res.json(response)
}

const addToCart = async (req, res) => {
    let data = req.body
    let dataInsert = {}
    let next = false
    let response

    if (next) {
        if (data.CartId && data.CartId != '') {

            let cart = await Prisma.cart.count({
                where: {
                    id: typeof data.CartId === 'number' ? data.CartId : Number.parseInt(data.CartId)
                }
            })

            if (cart > 0) {
                next = true
            } else {
                next = false
                response = { status: "error", message: `El carrito #${data['CartId']} no existe` }
            }
        } else {

            if (data.user && data.user != '') {
                let cart = await Prisma.cart.create({
                    data: {
                        UserId: data.user
                    }
                })

                data.CartId = cart.id

                next = true
            } else {
                next = false
                response = { status: "error", message: `No se envio un usuario` }
            }
        }
    }

    if (data.ProductId && data.ProductId != '') {
        next = true
    } else {
        next = false
        response = { status: "error", message: `No se envio un producto` }
    }

    if (data.stock && data.stock != '' && data.stock >= 1) {
        next = true
    } else {
        next = false
        response = { status: "error", message: `El stock no puede ser menor a 1 ` }
    }

    if (next) {
        delete data.user
        Object.keys(data).forEach(item => {
            if (Number.isInteger(data[item])) {
                dataInsert[item] = typeof data[item] === 'number' ? data[item] : Number.parseInt(data[item])
            } else {
                dataInsert[item] = data[item]
            }
        })

        let update = false
        let id = 0

        let cart = await Prisma.productsCart.findMany({
            where: {
                CartId: typeof dataInsert.CartId === 'number' ? dataInsert.CartId : Number.parseInt(dataInsert.CartId),
                ProductId: typeof dataInsert.ProductId === 'number' ? dataInsert.ProductId : Number.parseInt(dataInsert.ProductId)
            },
            select: {
                stock: true,
                id: true
            }
        })

        if (cart.length > 0) {
            dataInsert.stock = dataInsert.stock + cart[0].stock
            id = cart[0].id
            update = true
        }

        if (!update) {
            await Prisma.productsCart.create({
                data: dataInsert
            })
        } else {
            await Prisma.productsCart.update({
                data: dataInsert,
                where: {
                    id: id
                }
            })
        }

        response = { status: "success", message: `Producto agregado al carrito ${data.CartId}`, id: data.CartId }
    }

    res.json(response)
}

const listToCart = async (req, res) => {
    let data = req.params
    let listCart = await Prisma.productsCart.findMany({
        where: {
            CartId: parseInt(data['Cart'])
        }
    })

    res.json(listCart)
}

const buyToCart = async (req, res) => {
    let data = req.params
    let response

    if (data.Cart) {
        let cartState = await Prisma.cart.findMany({
            select:{
                state:true
            },
            where:{
                id: typeof data.Cart === 'number' ? data.Cart : Number.parseInt(data.Cart) 
            }
        })
        if (cartState[0].state == 1) {
            let next = false
            let cart = await Prisma.productsCart.findMany({
                where: {
                    CartId: typeof data.Cart === 'number' ? data.Cart : Number.parseInt(data.Cart)
                }
            })

            next = true

            for (let i = 0; i < cart.length; i++) {
                let product = await Prisma.product.findMany({
                    where: {
                        id: typeof cart[i].ProductId === 'number' ? cart[i].ProductId : Number.parseInt(cart[i].ProductId)
                    }
                })

                if (cart[i].stock > product[0].stock) {
                    next = false;
                }
            }

            if (next) {

                await Prisma.cart.update({
                    data: {
                        state: 2
                    },
                    where: {
                        id: typeof data.Cart === 'number' ? data.Cart : Number.parseInt(data.Cart)
                    }
                })
                response = { status: "success", message: "Los productos se han comprado correctamente" }
            } else {
                response = { status: "error", message: "El stock no es suficiente para realizar este pedido" }
            }
        }else{
            response = { status: "error", message: "El carrito ya se encuentra cerrado" }
        }
    } else {
        response = {
            status: "error",
            message: "No se ha enviado un id de carrito"
        }
    }

    res.json(response)
}
module.exports = {
    createUser,
    updateUser,
    login,
    createProducts,
    listProducts,
    updateProducts,
    storeProducts,
    addToCart,
    listToCart,
    buyToCart
}