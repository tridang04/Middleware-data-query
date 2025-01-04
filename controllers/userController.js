const { sql } = require('../config/connectDB');
const userService = require('../service/userService')
// Lấy tất cả người dùng
const getAllUsers = async (pool, req, res) => {
    let id = req.query.id
    try {
        if (!id) {
            return res.status(500).json({
                errCode: 0,
                errMessage: "Missing required parameters",
                user: []
            })
        }
        let data = await userService.getAllUser(pool, id)
        return res.status(200).json(data)
    } catch (err) {
        console.error('Error message from SQL Server:', err);
        return res.status(500).json({
            errCode: 0,
            errMessage: 'Error message from SQL Server'
        });
    }
};

// Thêm người dùng
const addNewUser = async (pool, req, res) => {
    try {
        let message = await userService.addUser(pool, req.body)
        return res.status(200).json(message)
    } catch (err) {
        console.error('Error message from SQL Server:', err);
        return res.status(500).json({
            errCode: 0,
            errMessage: 'Error message from SQL Server'
        });
    }

};


let deleteUserFromService = async (pool, req, res) => {
    try {
        let message = await userService.deleteUser(pool, req.query.id)
        return res.status(200).json(message);
    } catch (e) {
        console.log(e)
        return res.status(500).json({ error: 'Error message from SQL Server' });
    }
};


let updateInforUser = async (pool, req, res) => {
    try {
        let message = await userService.editInforUser(pool, req.body)
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
    getAllUsers,
    addNewUser,
    deleteUserFromService,
    updateInforUser
};
