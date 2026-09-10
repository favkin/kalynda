import cloudinary from '../utils/cloudinary.js';

export const deleteCloudinaryMedia = async (media) => {
    if (!media?.length) return;

    await Promise.all(
        media.map((item) =>
            cloudinary.uploader.destroy(item.publicId, {
                resource_type: item.type === 'video' ? 'video' : 'image'
            })
        )
    );
}; 