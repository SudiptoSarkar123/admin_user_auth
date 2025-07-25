
module.exports = (req,res,next)=>{
    if(req.user?.role === "Super-admin"){
        next()
    }else{
        return res.status(401).json({
            status: false,
            message: 'Unauthorized'
        });
    }
}