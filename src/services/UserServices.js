const User = require('../models/UserModel');
const Code = require('../models/CodeModel');
const dotenv = require('dotenv');
dotenv.config();
const base64ArrayBuffer = require('base64-arraybuffer')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generalAccessToken } = require('./JwtService');
const crypto = require('crypto');
const EmailService = require('../services/EmailService')


const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
      const { name, email, password, img } = newUser;
  
      try {
        const checkUser = await User.findOne({ email: email });
        if (checkUser) {
          return resolve({
            status: 'error',
            message: 'Email already exists',
          });
        }
  
        const hashPassword = await bcrypt.hash(password, 10);
        const imageBuffer = Buffer.from(img); // Tạo buffer từ dữ liệu ảnh Uint8Array
  
        const createUser = await User.create({
          name,
          email,
          password: hashPassword,
          image: { data: imageBuffer, contentType: 'image/png' }, // Lưu dữ liệu ảnh vào người dùng mới
        });
  
        if (createUser) {
          resolve({
            status: 'success',
            message: 'Created account successfully',
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  };
  

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password} = userLogin;

        try{
            const checkUser = await User.findOne({email:email});
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }
            const comparePassword = await bcrypt.compareSync(password, checkUser.password);
            if (!comparePassword) {
                resolve({
                    status: 'ERR',
                    message: 'The password is incorrect'
                })
            }
            
            const access_token = await generalAccessToken({
                id: checkUser._id, 
                isAdmin : checkUser.isAdmin
            });
            const data = {
                accessToken: access_token,
            }
            await User.findByIdAndUpdate(checkUser.id, data, { new: true });
            // const refresh_token = await generalRefreshToken({
            //     id: checkUser._id, 
            //     isAdmin : checkUser.isAdmin
            // });
            const name = checkUser.name;
            const id = checkUser._id;
            resolve({
                status: 'success',
                message: 'Login successfully',
                id,
                name,
                access_token,
                //refresh_token
            });
        }catch(error){
            reject(error)
        }
    })
}

const resetPassword = (data) => {
    return new Promise(async (resolve, reject) => {
        const { email} = data;
        try{
            const checkUser = await User.findOne({email:email});
            if (checkUser === null) {
                return resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }

            const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase();

            const check = await Code.findOne({email:email})
            if(check){
                resolve({
                    status: 'error',
                    message: 'Please check your email box'
                })
            }

            const createCode = await Code.create({
                email,
                user: checkUser._id,
                code: verificationCode,
            })
            if(createCode){
                resolve({
                    status: 'success',
                    message: 'Email sended'
                })
            }
            
            
            await EmailService.sendEmail(email, verificationCode);

            resolve({
                status: 'success',
                message: 'Email send successfully',
            });
        }catch(error){
            reject(error)
        }
    })
}

const verifyCode = (data) => {
    return new Promise(async (resolve, reject) => {
        const {code} = data;
        try{
            const checkCode = await Code.findOne({code:code});
            if (checkCode === null) {
                return resolve({
                    status: 'error',
                    message: 'The code is wrong'
                })
            }
            else{
                resolve({
                    status: 'success',
                    message: 'Success verify code',
                    data:checkCode.user
                })
            }
        }catch(error){
            reject(error)
        }
    })
}

const decodeToken = (data) => {
    return new Promise(async (resolve, reject) => {
        const {token} = data;
        try{
            const checkToken = await User.findOne({accessToken:token})
            if(checkToken === null){
                return resolve({
                    status: 'ERR',
                    message: 'Unauthorized'
                })
            }else{
            resolve({
                status: 'success',
                message: 'Decode successfully',
            })
            }
            
        }catch(error){
            reject(error)
        }
    })
}

const logoutUser = (data) => {
    return new Promise(async (resolve, reject) => {
        const {token} = data;
        try{
            const checkToken = await User.findOne({accessToken:token})
            if(checkToken === null){
                return resolve({
                    status: 'ERR',
                    message: 'Unauthorized'
                })
            }
            const data = {
                accessToken: null,
            }
            await User.findByIdAndUpdate(checkToken.id, data, { new: true });
            resolve({
                status: 'success',
                message: 'Decode successfully',
            })
            
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

const updatePass = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({ _id: id });
            if (!checkUser) {
                return resolve({
                    status: 'error',
                    message: 'The user is not exist',
                });
            }

            const comparePassword = await bcrypt.compare(data.password, checkUser.password);
            if (comparePassword) {
                return resolve({
                    status: 'error',
                    message: 'The new password must be different from the old password',
                });
            }
            const hashPassword = await bcrypt.hash(data.password, 10);
            data.password = hashPassword;

            const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
            const code = await Code.findOne({user:id})
            if(code){
                await Code.findByIdAndDelete(code._id)
            }
            if(updatedUser){
                resolve({
                    status: 'success',
                    message: 'Update password successfully',
                });
            }
            
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
    logoutUser,
    resetPassword,
    verifyCode,
    updatePass,
    updateUser,
    decodeToken,
    deleteUser,
    getAllUser,
    getDetailsUser,
    deleteManyUser,
    getDetailsUserWithCart
}