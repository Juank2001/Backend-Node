const controllers = require("../controllers/controllers")
const { multipart, verificaToken } = require("../middleware/rest")

module.exports = (router) => {
    router.post('/createUser', multipart, controllers.createUser);

    router.post('/updateUser', verificaToken, multipart, controllers.updateUser);

    router.post('/login', multipart, controllers.login);

    router.post('/createProducts', verificaToken, multipart, controllers.createProducts);

    router.get('/listProducts', verificaToken, controllers.listProducts);

    router.post('/updateProducts', verificaToken, multipart, controllers.updateProducts);

    router.post('/storeProducts', verificaToken, multipart, controllers.storeProducts);

    router.post('/addToCart', verificaToken, multipart, controllers.addToCart);

    router.get('/listToCart/:Cart', verificaToken, controllers.listToCart);

    router.get('/buyToCart/:Cart', verificaToken, controllers.buyToCart)
}