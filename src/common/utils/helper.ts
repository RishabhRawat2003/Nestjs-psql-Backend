import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from "cloudinary";
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const generateToken = (payload: any) => {
    return jwt.sign(payload, process.env.JWT_SECRET);
}


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