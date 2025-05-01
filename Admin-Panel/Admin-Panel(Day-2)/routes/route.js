const express = require("express")

const router = express.Router();

const ctl = require("../controller/ctl")
const upload = require("../middleware/multer")

router.get("/",ctl.login)
router.post("/login",ctl.loginAdmin)
router.get("/logout",ctl.logout)
router.get("/dashboard",ctl.dashboard)



router.get("/addAdmin",ctl.addAdmin)
router.post("/addAdmin",upload,ctl.add)
router.get("/viewAdmin",ctl.viewAdmin)
router.get("/deleteData",ctl.delete)
router.get("/editdata",ctl.edit)
router.post("/updateAdmin",upload,ctl.update)



module.exports = router