const schema = require("../model/firstSchema")
const upload = require("../middleware/multer")
const fs = require("fs")


module.exports.login=(req,res)=>{
   res.render("login")
}
module.exports.loginAdmin=async(req,res)=>{
   
    let admin =  await schema.findOne({email:req.body.email})
    if(!admin)
    {
        return res.redirect("/")
    }
    if(admin.password === req.body.password)
    {
        res.cookie("admin",admin)
        res.redirect("/dashboard")
    }
    else{
        res.redirect("/")
    }
    
}
module.exports.dashboard = (req,res)=>{
   if(req.cookies.admin)
   {
    res.render("dashboard")

   }
   else{
    res.redirect("/")
   }
}
module.exports.logout=(req,res)=>{
    res.clearCookie("admin");
    res.redirect("/")
}


module.exports.addAdmin = (req,res)=>{
    res.render("addAdmin")
}
module.exports.add = async(req,res)=>{
    req.body.image = req.file.path
    await schema.create(req.body).then(()=>{
        res.redirect("/")
    })     
     
}
module.exports.delete = async(req,res)=>{
    let singleData = await schema.findById(req.query.id)
    fs.unlinkSync(singleData.image)
    await schema.findByIdAndDelete(req.query.id).then(()=>{
        res.redirect("/")
    })
}
module.exports.edit = async(req,res)=>{
    // console.log(req.body);
    
    await schema.findById(req.query.id).then((data)=>{
        res.render("editAdmin",{data})
    })
    
}
module.exports.update = async(req,res)=>{

    let updateImage = await schema.findById(req.body.id)
    let img = " "

    req.file ? img = req.file.path : img = updateImage.image
    req.file && fs.unlinkSync(updateImage.image)

    req.body.image = img

    await schema.findByIdAndUpdate(req.body.id,req.body).then(()=>{
        res.redirect("/")
    })
    
    
}



module.exports.viewAdmin = async(req,res)=>{
    await schema.find({}).then((admin)=>{
        res.render("viewAdmin",{admin})
    })
}