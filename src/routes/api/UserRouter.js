const express = require('express');
const router = express.Router();
const userController = require('../../controllers/UserController');
const {  authUserMiddleware  } = require('../../middleware/authMiddleware');

router.post('/sign-up', userController.createUser);
router.post('/sign-in', userController.loginUser);
router.post('/log-out', userController.logoutUser)

router.put('/update-user/:id',  authUserMiddleware, userController.updateUser);
router.get('/get-detail/:id',authUserMiddleware ,userController.getDetailsUser);
//router.post('/refresh-token', userController.refreshToken);


module.exports = router; 