import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from "cloudinary";
import dotenv from 'dotenv';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
dotenv.config();

const s3 = new S3Client({
    region: process.env.AWS_REGION as string,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_SECRET_KEY as string,
    },
});


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const generateToken = (payload: any) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is not defined');

    return jwt.sign(payload, secret);
};

export const uploadOnCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        if (!buffer) return resolve(null);

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: "auto",
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        uploadStream.end(buffer);
    });
};

export const checkIfProductNameExists = async (table: any, name: string) => {
    const exists = await table.findOne({ where: { name } });

    return exists
}

export const uploadToS3 = async (
    file: Express.Multer.File
): Promise<string> => {
    const fileName = `${Date.now()}-${file.originalname}`;

    await s3.send(
        new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME as string,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
        })
    );

    return `https://${process.env.AWS_BUCKET_NAME}.s3.us-east-1.amazonaws.com/${fileName}`;
};


export function getEnvFilePath(): string {
    const env = process.env.NODE_ENV;

    if (env === 'development') return '.env.development';
    if (env === 'testing') return '.env.testing';
    if (env === 'training') return '.env.training';

    return '.env'; // fallback
}