const jwt = require('jsonwebtoken')
const User = require('../model/user.model');


const authCheck = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[0];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id).populate('role').select('-password');
        if(!user){
            console.log('user not found')
            return res.status(401).json({
                status: false,
                message: 'Unauthorized'
            });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            status: false,
            message: 'Unauthorized'
        });
    }
};


module.exports = {authCheck}