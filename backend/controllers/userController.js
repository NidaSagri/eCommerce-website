const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const cloudinary = require("cloudinary")

//Register a user
exports.registerUser = async(req,res)=>{
    try {

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
          });
        
        const {name, email, password} = req.body;
        const user = await User.create({
            name, email, password,
            avatar:{
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            }
        })

        sendToken(user, 201, res)

    } catch (error) {
        res.status(400).json({
            success:false,
            message:error
        })  
    }
}

//login user
exports.loginUser = async(req, res)=>{
    try {
        
        const {email, password} = req.body

        //checking if user has given password and email
        
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Please enter the required credentials"
        })
        }

        const user = await User.findOne({email}).select("+password")

        if(!user){
            return res.status(401).json({
                success:false,
                message:"Please enter the correct credentials"
        })
        }

        const isPasswordMatched =  user.comparePassword(password)

        if(!isPasswordMatched){
            return res.status(401).json({
                success:false,
                message:"Please enter the correct credentials"
        })
        }

        sendToken(user, 200, res)

    } catch (error) {
        res.status(400).json({
            success:false,
            message:error
        })  
    }
}

//logout user
exports.logout = async(req, res)=>{
    try {
        
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true
        })

        res.status(200).json({
            success:true,
            message:"Logged Out Successfully"
        })

    } catch (error) {
        res.status(400).json({
            success:false,
            message:error
        })
    }
}

//forgot password
exports.forgotPassword = async(req, res)=>{
    const user = await User.findOne({email: req.body.email})

    try {
        
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }

        //get ResetPassword token
        const resetToken = user.getResetPasswordToken()
        await user.save({validateBeforeSave: false})

        const resetPasswordUrl = `${req.prototype}://${req.get("host")}/api/v1/password/reset/${resetToken}`

        const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then please ignore it.`

        await sendEmail({
            email: user.email,
            subject: `Nida Store Password recovery`,
            message
        })

        res.status(200).json({
            success:true,
            message:`Email sent to ${uesr.email} successfully`
        })

    } catch (error) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save({validateBeforeSave: false})

        return res.status(500).json({
            success:false,
            message:error
        })
    }
}

//Reset Password
// exports.resetPassword = async (req, res)=>{

// }

//get user details
exports.getUserDetails = async (req, res)=>{

    const user = await User.findById(req.user.id)

    return res.status(200).json({
        success:true,
        user
    })

}

//update user Password
exports.updatePassword = async (req, res)=>{

    const user = await User.findById(req.user.id).select("+password")

    const isPasswordMatched = user.comparePassword(req.body.oldPassword)

    if(!isPasswordMatched){
        return res.status(400).json({
        success:false,
        message:"Old password is incorrect"
    })
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return res.status(400).json({
            success:false,
            message:"Password does not match"
        })
    }

    user.password = req.body.newPassword;
    await user.save()

   sendToken(user, 200, res)

}

//update user Profile
exports.updateProfile = async (req, res)=>{

    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    //We will add cloudinary later
    if (req.body.avatar !== "") {
        const user = await User.findById(req.user.id);
    
        const imageId = user.avatar.public_id;
    
        await cloudinary.v2.uploader.destroy(imageId);
    
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
          folder: "avatars",
          width: 150,
          crop: "scale",
        });
    
        newUserData.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new:true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success:true
    })
}

//get all users -- Admin
exports.getAllUser = async (req, res)=>{

   const users = await User.find();

   res.status(200).json({
    success:true,
    users
 })
}

//get single user -- Admin
exports.getSingleUser = async (req, res)=>{

    const user = await User.findById(req.params.id);

    if(!user){
        return res.status(400).json({
            success:false,
            message:`User with id: ${req.params.id} does not exist`
        })
    }
 
    res.status(200).json({
     success:true,
     user
 })
}

//update user role -- Admin
exports.updateUserRole = async (req, res)=>{

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new:true,
        runValidators: true,
        useFindAndModify: false
    })

    if(!user){
        return res.status(400).json({
            success:false,
            message:`User with id: ${req.params.id} does not exist`
        })
    }

    res.status(200).json({
        success:true
    })
}

//Delete User -- Admin
exports.deleteUser = async (req, res)=>{

    const user = await User.findById(req.params.id)
   //we will remove cloudinary later

   if(!user){
    return res.status(400).json({
        success:false,
        message:`User with id: ${req.params.id} does not exist`
        })
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success:true,
        message:"User deleted successfully"
    })
}