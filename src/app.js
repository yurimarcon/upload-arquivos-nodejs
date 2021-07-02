const express = require('express')
const multer = require('multer');
const path = require('path');
const crypto = require('crypto')

const app = express();
const upload = multer({
    dest: path.resolve(__dirname,'uploads'),
    storage: multer.diskStorage({
        destination: (req,file,cb) =>{
            cb(null, path.resolve(__dirname,'uploads'))
        },
        filename:(req,file,cb)=>{
            crypto.randomBytes(16,(err, hash)=>{
                if(err) cb(err);

                const filename = `${hash.toString('hex')}-${file.originalname}`;
                cb(null, file.originalname);
            })
        }
    }),
    limits:{
       fileSize: 2 * 1024 * 1024,  
    },
    fileFilter:(req,file,cb)=>{
        const allowedMimes = [
            "text/html",
            "image/jpeg",
            "image/jpg",
            "image/pjpeg",
            "image/png",
            "image/gif"
        ];

        if(allowedMimes.includes(file.mimetype)){
            cb(null, true)
        }else{
            cb(new Error('Invalid file type'))
        }
    }
})
app.get('/',(req, res)=>{
    return res.json({
        "hello": "world"
    })
})

app.post('/', upload.single('file'),(req, res)=>{
    console.log(req.file.originalname);
    return res.json({
        "hello": "world"
    })
})

app.listen(3002);