import express from 'express';
import { singleuserget, userdelete, userEdit, userExport, userPost, usersget, userstatus } from '../Controllers/userController.js';
import { upload } from '../multerConfig/storageConfig.js';
const router = new express.Router();

router.post('/user/register',upload.single('user_profile'),userPost)
router.get("/user/details" , usersget)
router.get("/user/:id" , singleuserget)
router.put('/user/edit/:id',upload.single('user_profile') , userEdit)
router.delete('/user/delete/:id' , userdelete)
router.put("/user/status/:id",userstatus);
router.get("/userexport",userExport);

export default router;