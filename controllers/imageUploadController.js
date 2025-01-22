import { Image } from '../model/imageSchema.js'

export async function imageUploadController(req, res) {
    try {
        //middleware

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        // req.link = req.file.path;


        //imageUploadContrpller start
        let { image } = req.body;
        // console.log(req.body);
        
        // console.log(req.link);
        const link = {image : req.file.path};
        await Image(link).save();

        return res.status(201).json({
            message: 'Product created successfully',
            link,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error,
        });
    }
}