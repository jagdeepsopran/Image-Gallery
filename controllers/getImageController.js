import { Image } from '../model/imageSchema.js'

export async function getImageController(req, res) {
    try {
        const Images = await Image.find();
        return res.status(201).json({
            message: 'Image fetch successfully',
            Images,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error,
        });
    }
}