const validateProductMedia = (req, res, next) => {
    const files = req.files || [];

    const images = files.filter(file =>
        file.mimetype.startsWith('image/')
    );

    const videos = files.filter(file =>
        file.mimetype.startsWith('video/')
    );  
    
    if (images.length > 8) {
        return res.status(400).json({
            message: 'A product can have a maximum of 8 images'
        })
    };

    if (videos.length > 2) {
        return res.status(400).json({
            message: 'A product can have a maximum of 2 videos'
        })
    };

    next();
};

export default validateProductMedia;