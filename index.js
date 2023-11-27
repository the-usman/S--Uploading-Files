require('dotenv').config();

const express = require('express');
const { S3 } = require('aws-sdk');
const multer = require('multer');
const cors = require('cors');

const uploadToS3 = async (file) => {
    const s3 = new S3();
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `project/usman/${file.originalname}`,
        Body: file.buffer
    };
    const result = await s3.upload(params).promise();
    return result;
};

const fileFilter = (req, file, cb) => {
    if (file.mimetype.split('/')[0] === "image") {
        cb(null, true);
    } else {
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILES"), false);
    }
};

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    fileFilter
}).single("file");

const app = express();

app.use(cors());

app.post('/upload', upload, async (req, res) => {
    try {
        const file = req.file;
        const result = await uploadToS3(file);
        res.json({
            success: true,
            message: "Uploaded Successfully",
            result
        });
    } catch (error) {
        console.error('Error uploading to S3:', error);
        res.status(500).json({
            success: false,
            message: "Error uploading to S3"
        });
    }
});

app.post('/delete', async (req, res) => {
    try {
        const s3 = new S3();
        const url = 'https://sharehive.s3.eu-north-1.amazonaws.com/project/usman/Light+Mode.png';
        const key = new URL(url).pathname.slice(1);
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Delete: {
                Objects: [
                    { Key: "project/usman" }
                ],
                Quiet: false
            }
        };
        const result = await s3.deleteObjects(params).promise();
        res.status(200).json({ result, message: "Successfully deleted" });
    } catch (error) {
        console.error('Error to S3:', error);
        res.status(500).json({
            success: false,
            message: "Error Delete to S3"
        });
    }
});

app.listen(5000, () => console.log("App is listening at http://localhost:5000"));
