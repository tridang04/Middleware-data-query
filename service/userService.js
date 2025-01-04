const { sql } = require('../config/connectDB');
const UPLOAD_IMAGE = 'http://localhost:3001/api/upload-image';
const axios = require('axios');

let getAllUser = (pool, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = ''
            if (userId === "ALL") {
                result = await pool.request().query('SELECT * FROM DBO.Users');

            }
            if (userId && userId != 'ALL') {
                result = await pool.request().input('userID', sql.Int, userId).query('SELECT * FROM DBO.Users WHERE userID = @userID');

            }
            if (result && result.recordset) {

                resolve({

                    errCode: 1,
                    errMessage: 'get all infor user suceed !',
                    data: result.recordset
                }
                );
            }
        } catch (e) {
            reject(e)
        }


    })
}


let addUser = (pool, inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('check input: ', inputData)
            if (inputData && inputData.name && inputData.address && inputData.username && inputData.password && inputData.phoneNumber) {
                let { name, address, username, password, phoneNumber, avatar } = inputData;
                let result = await pool.request().query("SELECT MAX(userID) AS maxUserID FROM Users");
                let newUserID = result.recordset[0].maxUserID + 1;
                result.recordset[0].maxUserID + 1;
                let inputAvatar = avatar ?? null


                let query = `
                    INSERT INTO Users (userID, name, address, username, password, phoneNumber, avatar)
                    VALUES (@userID, @name, @address, @username, @password, @phoneNumber, @avatar)
                `;

                await pool.request()
                    .input('userID', sql.Int, newUserID)
                    .input('name', sql.NVarChar, name)
                    .input('address', sql.NVarChar, address)
                    .input('username', sql.VarChar, username)
                    .input('password', sql.VarChar, password)
                    .input('phoneNumber', sql.VarChar, phoneNumber)
                    .input('avatar', sql.VarChar, inputAvatar)
                    .query(query);

                if (inputAvatar) {
                    let imgUpload = { imgLink: inputAvatar }
                    console.log('check imgUpload: ', imgUpload)
                    await axios.post(UPLOAD_IMAGE, imgUpload);
                }
                resolve({
                    errCode: 1,
                    errMessage: 'create a new user succeed'
                })

            }
            else {
                resolve({
                    errCode: 0,
                    errMessage: "Missing required parameters"
                })
            }
        } catch (err) {
            reject(err)
        }
    })
}

let deleteUser = (pool, userID) => {
    return new Promise(async (resolve, reject) => {
        console.log('check id: ', userID)
        if (!userID) {
            return resolve({
                errCode: 1,
                errMessage: "Missing userID data"
            })
        }

        const result = await pool.request().query(`SELECT userID FROM Users WHERE userID = ${userID}`);
        if (result.recordset.length === 0) {
            return resolve({
                errCode: 1,
                errMessage: "User does not exist"
            })
        }
        try {
            await pool.request().query(`DELETE FROM Users WHERE userID = ${userID};`);
            resolve({
                errCode: 0,
                errMessage: `User with id ${userID} has been deleted successfully`
            })
        } catch (e) {
            reject(e)
        }
    })
}


let editInforUser = (pool, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.userID || !data.phoneNumber) {
                return resolve({
                    errCode: -1,
                    errMessage: "Missing required parameters"
                })
            }
            console.log("check data update: ", data)
            let user = await pool.request()
                .input('userID', sql.Int, data.userID)
                .query(`SELECT * FROM Users WHERE userID = @userID`);

            if (user && user.recordset.length > 0) {
                // Lấy thông tin sản phẩm hiện tại
                let currentUser = user.recordset[0];
                let avatarUpdate = data.avatar ?? currentUser.avatar;
                let name = data.name ?? currentUser.name;
                let address = data.address ?? currentUser.address;
                let username = data.username ?? currentUser.username;
                let password = data.password ?? currentUser.password;
                let phoneNumber = data.phoneNumber;



                // Thực hiện cập nhật sản phẩm
                await pool.request()
                    .input('name', sql.NVarChar, name)
                    .input('address', sql.NVarChar, address)
                    .input('username', sql.NVarChar, username)
                    .input('password', sql.NVarChar, password)
                    .input('phoneNumber', sql.VarChar, phoneNumber)
                    .input('avatarUpdate', sql.VarChar, avatarUpdate)
                    .input('userID', sql.VarChar, data.userID)
                    .query(`
                        UPDATE Users SET  
                        name = @name,
                        address = @address,
                        username = @username,
                        password = @password,
                        phoneNumber = @phoneNumber,
                        avatar = @avatarUpdate
                        WHERE userID = @userID
                    `);

                resolve({
                    errCode: 0,
                    errMessage: 'Update user information succeed'
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'User not found'
                });
            }
        } catch (e) {
            reject(e)
        }

    })
}


module.exports = {
    getAllUser,
    addUser,
    deleteUser,
    editInforUser
}