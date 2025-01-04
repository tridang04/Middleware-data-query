const { sql } = require('../config/connectDB');
const UPLOAD_IMAGE = 'http://localhost:3001/api/upload-image-product';
const axios = require('axios');
let getAllProduct = (pool, productID) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = ''
            if (productID === "ALL") {

                result = await pool.request().query('SELECT * FROM DBO.Product');

            }
            if (productID && productID != 'ALL') {
                result = await pool.request().input('productID', sql.Int, productID).query('SELECT * FROM DBO.Product WHERE productID = @productID');
            }

            if (result && result.recordset) {

                resolve({

                    errCode: 1,
                    errMessage: 'get all infor product suceed !',
                    data: result.recordset
                }
                );
            }
        } catch (e) {
            reject(e)
        }


    })
}


let addNewProduct = (pool, inputData) => {
    console.log('check inputdata: ', inputData)
    return new Promise(async (resolve, reject) => {
        const { description, image, name, price, quantity, productCategoryID } = inputData;
        if (!description || !image || !name || !price || !quantity || !productCategoryID) {
            return resolve({
                errCode: 1,
                errorMessage: 'Missing product data.'
            });
        }

        try {
            const result = await pool.request().query("SELECT MAX(productID) AS maxProductID FROM Product");
            const newProductID = result.recordset[0].maxProductID + 1;

            const query = `
                    INSERT INTO Product (productID, description, image, name, price, quantity, productCategoryID)
                    VALUES (@productID, @description, @image, @name, @price, @quantity, @productCategoryID)
                `;

            await pool.request()
                .input('productID', sql.Int, newProductID)
                .input('description', sql.NVarChar, description)
                .input('image', sql.VarChar, image)
                .input('name', sql.NVarChar, name)
                .input('price', sql.Int, price)
                .input('quantity', sql.Int, quantity)
                .input('productCategoryID', sql.Int, productCategoryID)
                .query(query);
                if (image) {
                    let imgProductUpload = { imgLink: image }
                    console.log('check img product Upload: ', imgProductUpload)
                    await axios.post(UPLOAD_IMAGE, imgProductUpload);
                }
            resolve({
                errCode: 0,
                message: 'Product added successfully.'
            });
        } catch (err) {
            reject(err)
        }
    }
    )

}


let deleteProduct = (pool, productID) => {
    return new Promise(async (resolve, reject) => {
        console.log('check id: ', productID)
        if (!productID) {
            return resolve({
                errCode: 1,
                errMessage: "Missing productID data"
            })
        }

        const result = await pool.request().query(`SELECT productID FROM Product WHERE productID = ${productID}`);
        if (result.recordset.length === 0) {
            return resolve({
                errCode: 1,
                errMessage: "Product does not exist"
            })
        }
        try {
            await pool.request().query(`DELETE FROM Product WHERE productID = ${productID};`);
            resolve({
                errCode: 0,
                errMessage: `Product with id ${productID} has been deleted successfully`
            })
        } catch (e) {
            reject(e)
        }
    })
}


let editInforProduct = (pool, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.productID ) {
                // if (!data.productID || !data.productCategoryID) {
                return resolve({
                    errCode: -1,
                    errMessage: "Missing required parameters"
                })
            }
            console.log("check data update: ", data)
            let product = await pool.request()
                .input('productID', sql.Int, data.productID)
                .query(`SELECT * FROM PRODUCT WHERE productID = @productID`);

            if (product && product.recordset.length > 0) {
                // Lấy thông tin sản phẩm hiện tại
                let currentProduct = product.recordset[0];
                let imageUpdate = data.image ?? currentProduct.image;
                let description = data.description ?? currentProduct.description;
                let name = data.name ?? currentProduct.name;
                let price = data.price ?? currentProduct.price;
                let quantity = data.quantity ?? currentProduct.quantity;
                let productCategoryID = data.productCategoryID ?? currentProduct.productCategoryID;



                // Thực hiện cập nhật sản phẩm
                await pool.request()
                    .input('description', sql.NVarChar, description)
                    .input('image', sql.NVarChar, imageUpdate)
                    .input('name', sql.NVarChar, name)
                    .input('price', sql.Money, price)
                    .input('quantity', sql.Int, quantity)
                    .input('productCategoryID', sql.Int, productCategoryID)
                    .input('productID', sql.Int, data.productID)
                    .query(`
                        UPDATE Product SET  
                        description = @description,
                        image = @image,
                        name = @name,
                        price = @price,
                        quantity = @quantity,
                        productCategoryID = @productCategoryID
                        WHERE productID = @productID
                    `);

                    

                resolve({
                    errCode: 0,
                    errMessage: 'Update product information succeed'
                });

            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'No products found'
                });
            }
        } catch (e) {
            reject(e)
        }

    })
}



module.exports = {
    getAllProduct,
    addNewProduct,
    deleteProduct,
    editInforProduct
}