const User = require('../models/UserModel');
const dotenv = require('dotenv');
dotenv.config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generalAccessToken } = require('./JwtService');

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const {name, email, password, confirmPassword} = newUser;

        try{
            const checkUser = await User.findOne({email:email});
            if(checkUser){
                return resolve({
                    status: 'error',
                    message: 'Email already exists'
                })
            }

            const hashPassword = await bcrypt.hash(password, 10);
            
            const createUser = await User.create({
                name,  
                email,
                password: hashPassword,
                confirmPassword: hashPassword,
            })
            if(createUser){
                resolve({
                    status: 'success',
                    message: 'User created successfully',
                    data: createUser
                })
            }
        }catch(error){
            reject(error)
        }
    })
}

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password} = userLogin;

        try{
            const checkUser = await User.findOne({email:email});
            if (checkUser === null) {
                return res.status(401).json({
                    status: 'error',
                    message: 'The user is not exist or the password is incorrect'
                });
            }
            const comparePassword = await bcrypt.compareSync(password, checkUser.password);
            if (!comparePassword) {
                return res.status(401).json({ 
                    status: 'error',
                    message: 'The user is not exist or the password is incorrect'
                });
            }
            
            // const access_token = await generalAccessToken({
            //     id: checkUser._id, 
            //     isAdmin : checkUser.isAdmin
            // });

            // const refresh_token = await generalRefreshToken({
            //     id: checkUser._id, 
            //     isAdmin : checkUser.isAdmin
            // });

            resolve({
                status: 'success',
                message: 'User login successfully',
                //access_token,
                //refresh_token
            });
        }catch(error){
            reject(error)
        }
    })
}

const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({ _id: id });
            const checkEmail = await User.findOne({ email: data.email });

            if (checkEmail) {
                return resolve({
                    status: 'error',
                    message: 'Email already exists',
                });
            }

            if (!checkUser) {
                return resolve({
                    status: 'error',
                    message: 'The user is not exist',
                });
            }

            if (data.password && data.oldPassword) {
                if (data.password === data.oldPassword) {
                    return reject({
                        status: 'error',
                        message: 'The new password must be different from the old password',
                    });
                }

                const comparePassword = await bcrypt.compare(data.oldPassword, checkUser.password);

                if (!comparePassword) {
                    return reject({
                        status: 'error',
                        message: 'The old password is incorrect',
                    });
                }

                const hashPassword = await bcrypt.hash(data.password, 10);
                data.password = hashPassword;
            }

            const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
            resolve({
                status: 'success',
                message: 'User updated successfully',
                data: updatedUser,
            });
        } catch (error) {
            console.error('Error updating user:', error);
            reject(error);
        }
    });
};


const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try{
            const checkUser = await User.findOne({
                _id:id
            })

            if(checkUser == null){
                resolve({
                    status: 'error',
                    message: 'The user is not exist'
                })
            }

            await User.findByIdAndDelete(id)
                resolve({
                    status: 'success',
                    message: 'User delete successfully',
                })
        }catch(error){
            reject(error) 
        }
    })
}

const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try{
            const allUser = await User.find()
                resolve({
                    status: 'success',
                    message: 'Get all user successfully',
                    data: allUser
                })
        }catch(error){
            reject(error) 
        }
    })
}

const getDetailsUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try{
            const user = await User.findOne({
                _id: id
            })

            if(user == null){
                resolve({
                    status: 'error',
                    message: 'The user is not exist'
                })
            }

            resolve({
                status: 'success',
                message: 'Get detail user id:' + id +  ' successfully',
                data: user
            })
        }catch(error){
            reject(error) 
        }
    })
}

const getDetailsUserWithCart = async (id) => {
    try {
        const userWithCarts = await User.findById(id).populate({
            path: 'carts',
            populate: {
                path: 'orderItems.product',
                model: 'Product'
            }
        });

        if (!userWithCarts) {
            return {
                status: 'error',
                message: 'The user does not exist',
            };
        }

        return {
            status: 'success',
            message: `Get detail user id: ${id} successfully`,
            data: userWithCarts.carts,
        };
    } catch (error) {
        return {
            status: 'error',
            message: 'An error occurred while fetching user details',
            error: error.message,
        };
    }
};

const deleteManyUser = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {

            await User.deleteMany({ _id: ids })
            resolve({
                status: 'success',
                message: 'Delete user success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    deleteManyUser,
    getDetailsUserWithCart
}