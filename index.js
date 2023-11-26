require('dotenv').config()

const express = require('express')
const { S3 } = require('aws-sdk');
const multer = require('multer')

const uploadToS3 = async (file) => {
    const s3 = new S3();
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        key: `project/usman/${file.originalname}`,
        Body: file.buffer
    }
    const result = s3.upload(params).promise();
    return result;
}


const storage = multer.memoryStorage();


const upload = multer({

})


const app = express();

app.post('/')

app.listen(5000, () => console.log("App is listening at http://localhost:5000"))