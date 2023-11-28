const UserService = require('../services/UserServices');  
const JwtService = require('../services/JwtService');

const createUser = async (req, res) => {
    try {
        const { name, email, password,confirmPassword} = req.body
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)
        if (!name || !email || !password || !confirmPassword) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is email'
            })
        } else if (password !== confirmPassword) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The password and confirmPassword is not match'
            })
        }
        const response = await UserService.createUser(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({ 
            message: e
        })
    }
}

const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)
        if (!email || !password) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is email'
            })
        }
        const response = await UserService.loginUser(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({ 
            message: e
        })
    }
}

const resetPassword = async (req, res) => {
    try {
        const {email} = req.body
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)
        if (!email) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is email'
            })
        }
        const response = await UserService.resetPassword(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({ 
            message: e
        })
    }
}

const verifyCode = async (req, res) => {
    try {
        const {code} = req.body
        if (!code) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        } 
        const response = await UserService.verifyCode(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({ 
            message: e
        })
    }

}

const logoutUser = async (req, res) => {
    try {
        const token = req.body;
        if(!token){
            return res.status(200).json({
                status: 'ERR',
                message: 'The token is required'
            })
        }
        const response = await UserService.logoutUser(token)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const data = req.body;
        if(!userId){
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        if(data.confirmPassword != data.password){
            return res.status(200).json({
                status: 'ERR',
                message: 'The password and confirmPassword is not match'
            })
        }
        const response = await UserService.updateUser(userId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({ 
            message: e
        })
    }
}

const updatePass = async (req, res) => {
    try {
        const userId = req.params.id;
        const data = req.body;
        if(!userId){
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        if(data.confirmPassword != data.password){
            return res.status(200).json({
                status: 'ERR',
                message: 'The password and confirmPassword is not match'
            })
        }
        const response = await UserService.updatePass(userId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({ 
            message: e
        })
    }
}

const decodeToken = async (req, res) => {
    try {
        const token = req.body;
        if(!token){
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await UserService.decodeToken(token)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({ 
            message: e
        })
    }
}


// const deleteUser = async (req, res) => {
//     try {
//         const userId = req.params.id;
//         if(!userId){
//             return res.status(200).json({
//                 status: 'ERR',
//                 message: 'The input is required'
//             })
//         }
//         const response = await UserService.deleteUser(userId)
//         return res.status(200).json(response)
//     } catch (e) {
//         return res.status(404).json({ 
//             message: e
//         })
//     }
// }

// const getAllUser = async (req, res) => {
//     try {
//         const response = await UserService.getAllUser()
//         return res.status(200).json(response)
//     } catch (e) {
//         return res.status(404).json({ 
//             message: e
//         })
//     }
// }

const getDetailsUser = async (req, res) => {
    try {
        const userId = req.params.id;

        if(!userId){
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }

        const response = await UserService.getDetailsUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({ 
            message: e
        })
    }
}

// const getDetailsUserWithCart = async (req, res) => {
//     try {
//         const userId = req.params.id;

//         if(!userId){
//             return res.status(200).json({
//                 status: 'ERR',
//                 message: 'The input is required'
//             })
//         }

//         const response = await UserService.getDetailsUserWithCart(userId)
//         return res.status(200).json(response)
//     } catch (e) {
//         return res.status(404).json({ 
//             message: e
//         })
//     }
// }

// const refreshToken = async (req, res) => {
//     try {
//         const token = req.headers.token.split(' ')[1];
        
//         if(!token){
//             return res.status(200).json({
//                 status: 'ERR',
//                 message: 'The token is required'
//             })
//         }

//         const response = await JwtService.refreshTokenJwtService(token)
//         return res.status(200).json(response)
//     } catch (e) {
//         return res.status(404).json({ 
//             message: e
//         })
//     }
// }

// const deleteMany = async (req, res) => {
//     try {
//         const ids = req.body.ids
//         if (!ids) {
//             return res.status(200).json({
//                 status: 'ERR',
//                 message: 'The ids is required'
//             })
//         }
//         const response = await UserService.deleteManyUser(ids)
//         return res.status(200).json(response)
//     } catch (e) {
//         return res.status(404).json({
//             message: e
//         })
//     }
// }

module.exports = {
    createUser,
    loginUser,
    logoutUser,
    resetPassword,
    verifyCode,
    updatePass,
    decodeToken,
    updateUser,
    getDetailsUser
    //deleteUser,
    //getAllUser,
   //refreshToken,
    //deleteMany,
    //getDetailsUserWithCart
}