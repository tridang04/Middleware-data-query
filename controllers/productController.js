const { sql } = require('../config/connectDB');
const productService = require('../service/productService')

// Lấy tất cả sản phẩm
let getAllProductsFromService = async (pool, req, res) => {
    let id = req.query.id;
    try {
        if (!id) {
            return res.status(500).json({
                errCode: 0,
                errMessage: "Missing required parameters",
                product: []
            })
        }
        else {

            const data = await productService.getAllProduct(pool, id)
            console.log('Product Data:', data);
            return res.status(200).json(data);
        }
    } catch (e) {
        console.log(e)
        return res.status(500).json({ error: 'Failed to fetch product infor' });
    }
};


// Thêm sản phẩm
let addProductFromService = async (pool, req, res) => {
    try {
        let message = await productService.addNewProduct(pool, req.body)
        return res.status(200).json(message);
    } catch (e) {
        console.log(e)
        return res.status(500).json({ error: 'Error message from SQL Server' });
    }
};

let deleteProductFromService = async (pool, req, res) => {
    try {
        let message = await productService.deleteProduct(pool, req.query.id)
        return res.status(200).json(message);
    } catch (e) {
        console.log(e)
        return res.status(500).json({ error: 'Error message from SQL Server' });
    }
};

let updateInforProduct = async (pool, req, res) => {
    try {
        let message = await productService.editInforProduct(pool, req.body)
        return res.status(200).json({ message })

    } catch (e) {
        console.log(e)
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from SQL Server'
        });
    }
}

module.exports = {
    getAllProductsFromService,
    addProductFromService,
    deleteProductFromService,
    updateInforProduct
};
