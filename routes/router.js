const router = require('express').Router()

const productController = require('../controllers/productController')
const userController = require('../controllers/userController')

const jwt = require('jsonwebtoken');

const upload = require('../config/multer')



router
 

    router
    .route('/products')
    .all(upload.single('image'))
    .post((req, res) => productController.create(req, res))    

    router
    .route('/products')
    .get((req, res) => productController.getAll(req, res))
    
    router
    .route('/products/:id')
    .get((req, res) => productController.get(req, res))
    .delete((req, res) => productController.delete(req, res))
    .put((req, res) => productController.update(req, res))

    router
    .route('/auth/register')
    .post((req, res) => userController.create(req, res))

    router
    .route('/auth/login')
    .post((req, res) => userController.login(req, res))

    router
    .route('/user/:id')
    .all(checkToken)
    .get((req, res) => userController.getuserdata(req, res))

    function checkToken(req, res, next) {        
        const authHeader = req.headers['authorization']        
        const token = authHeader && authHeader.split(" ")[1]
        

        if(!token){
            res.status(401).json({ msg: "Acesso negado!" });
            return
        }    

        try {       
        
            const secret = process.env.SECRET   
            jwt.verify(token, secret)                             
            next()

        } catch(err) {
            res.status(400).json({msg: "Token inválido", token})

        }
    }
    

module.exports = router 

