const { Product: ProductModel } = require ('../models/Product');

const productController = {

    create: async(req, res) => {
        try {

            const file = req.file

            const product = {
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                image: file.path
            }

            const response = await ProductModel.create(product);

            res.status(201).json({ response, msg: "Produto criado com sucesso!"});

        } catch(error) {
            console.log(error)
        }
    },

    getAll: async(req, res) => {
        try {
            const products = await ProductModel.find();
            res.json(products);

        } catch (error){
            console.log(error)
        }
    },

    get: async(req, res) => {
        try {

            const id = req.params.id;

            if (id.match(/^[0-9a-fA-F]{24}$/)) {
            
                const product = await ProductModel.findById(id);                            

                if (!product) {
                    res.status(404).json({ msg: "Produto não encontrado." });
                    return;
                }

                res.json(product);
            }

            else {
                res.status(404).json({ msg: "Produto não encontrado!" });
            }

        } catch (error){
            console.log(error)
        }
    },

    delete: async(req, res) => {
        try {

            const id = req.params.id;            

            if (id.match(/^[0-9a-fA-F]{24}$/)) {
            
                const product = await ProductModel.findById(id);                            

                if (!product) {
                    res.status(404).json({ msg: "Produto não encontrado." });
                    return;
                }

                const deletedProduct = await ProductModel.findByIdAndDelete(id);

                res.status(200).json({product, msg: `${product.name} deletado com sucesso.`  });
            }

            else {
                res.status(404).json({ msg: "Produto não encontrado!" });
            }

        } catch (error){
            console.log(error)
        }
    },

    update: async(req, res) => {
        try {

            const id = req.params.id;
            const file = req.file 
            
            const product = {
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                image: file.path
            }

            const name = req.body.name

            if (id.match(/^[0-9a-fA-F]{24}$/)) {                

                const updateproduct = await ProductModel.findByIdAndUpdate(id, product);                            

                if (!updateproduct) {
                    res.status(404).json({ msg: "Produto não encontrado." });
                    return;
                }               

                res.status(200).json({updateproduct, msg: `${product.name} atualizado com sucesso.`  });
            }

            else {
                res.status(404).json({ msg: "Produto não encontrado!" });
            }

        } catch (error){
            console.log(error)
        }
    }
    
}

module.exports = productController;
