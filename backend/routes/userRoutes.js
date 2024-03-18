const express = require('express')
const {registerUser,loginUser,allUsers} = require('../controllers/userController')
const {protect} = require('../middleWare/authMiddleWare')
const router = express.Router()

router.route('/').post(registerUser)
router.route("/").get(protect, allUsers);
router.post('/login', loginUser)
module.exports = router;