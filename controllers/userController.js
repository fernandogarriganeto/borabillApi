const { User: UserModel, userSchema } = require ('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const userController = {
    
    create: async(req, res) => {
        try {

            const user = {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword
            }

            if(!user.name) {
                return res.status(422).json({ msg: "O nome é obrigatório!"});
            }

            if(!user.email) {
                return res.status(422).json({ msg: "O email é obrigatório!"});
            }

            if(!user.password) {
                return res.status(422).json({ msg: "A senha é obrigatória!"});
            }

            if(user.password !== user.confirmpassword) {
                return res.status(422).json({ msg: "A senha e comfirmação de senha devem ser iguais!"});
            }

            //check if User exist
            const User = UserModel;
            const userExist = await User.findOne({email: user.email})            

            if(userExist) {
              return res.status(422).json({ msg: "Este email já cadastrado no sistema!"});
            }

            // Create password
            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(user.password, salt)
            user.password = passwordHash

            // Create User
            const response = await UserModel.create(user);

            res.status(201).json({ response, msg: "Usuário criado com sucesso!"});

        } catch(error) {
            console.log(error)
        }
    },




    login: async(req, res) => {
        try {
            
            const { email, password } = req.body

            if(!email) {
                return res.status(422).json({ msg: "O email é obrigatório!"});
            }

            if(!password) {
                return res.status(422).json({ msg: "A senha é obrigatória!"});
            }

            // check if user exist
            const User = UserModel;
            const user = await User.findOne({email: email})            

            if(!user) {
              return res.status(404).json({ msg: "Este email não é cadastrado no sistema!"});
            }

            // check if password match
            const checkPassword = await bcrypt.compare(password, user.password)

            if(!checkPassword) {
                return res.status(422).json({ msg: "Senha inválida!"});
            }

            try {

                const secret = process.env.SECRET
                const token = jwt.sign({ id: user.id }, secret)

                res.status(200).json({ msg: "Autenticação realizada com sucesso!", token, user });
                
            } catch(err) {
                console.log(error)
                res.status(500).json({ msg: "Aconteceu um erro no servidor, tente novamente mais tarde!"});
            }

        } catch(error) {
            console.log(error)
            res.status(500).json({ msg: "Aconteceu um erro no servidor, tente novamente mais tarde!"});
        }
    },
    

    getuserdata: async(req, res, checkToken) => {
        try {                      
            
            const id = req.params.id

            if (id.match(/^[0-9a-fA-F]{24}$/)) {

                const User = UserModel;
                const user = await User.findById( id, '-password')
                
                if(!user) {
                    res.status(404).json({ msg: "Usuário não encontrado"});
                }

                res.status(200).json({ user });
            }

            else {
                res.status(404).json({ msg: "Usuário não encontrado!" });
            }         

        } catch(error) {
            console.log(error)
            res.status(500).json({ msg: "Aconteceu um erro no servidor, tente novamente mais tarde!"});
        }

        function checkToken(req, res, next) {
            const authHeader = req.headers['authorization']
            const token = authHeader && authHeader.split(" ")[1]
        
            if(!token){
                res.status(401).json({ msg: "Acesso negado!" });
            }
        }   

    }
    
}

module.exports = userController;
