const cloudinary =
    require("../config/cloudinary");

const streamifier =
    require("streamifier");

const uploadFile =
    async (req, res) => {

        try {

            if (!req.file) {

                return res.status(400).json({
                    success: false,
                    message:
                        "No file uploaded"
                });

            }

            const uploadStream =
                cloudinary.uploader.upload_stream(

                    {
                        folder: "printflow",
                        resource_type: "raw"
                    },

                    (error, result) => {

                        if (error) {

                            return res.status(500).json({
                                success: false,
                                message:
                                    error.message
                            });

                        }

                        res.status(200).json({

                            success: true,

                            fileUrl:
                                result.secure_url,

                            publicId:
                                result.public_id

                        });

                    }

                );

            streamifier
                .createReadStream(
                    req.file.buffer
                )
                .pipe(uploadStream);

        } catch (error) {

            res.status(500).json({
                success: false,
                message:
                    error.message
            });

        }

    };

module.exports = {
    uploadFile
};