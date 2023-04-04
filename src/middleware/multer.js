const multer = require('multer');


exports.uploadImage = (req,res,next)=>{

    var storage = multer.diskStorage({})
      const upload = multer({ storage });
      upload.single('avatar')(req, res, (e) => {
        if(e){
            return res.json(e.message);
        }
        console.log('multer>>>>', req.file)
        next()
    });
}