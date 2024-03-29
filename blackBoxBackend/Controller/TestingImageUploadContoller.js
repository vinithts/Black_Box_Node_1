const { TestingImageUploadsModal, updateImageModule } = require("../Modal/TesingImageUploadModal");

const TestingImageUploadsController = async (req,res) => {
    const  image  = req.file
    try {
      if (image) {
        await TestingImageUploadsModal(image.filename);
        return res.status(200).json({ message: "upload image successfully !" });
      } else {
        return res.status(400).json({ message: "imagefile is missing !" });
      }
    } catch (e) {
        console.log(e)
        return res.status(500).json({Error:e})
    }

}

module.exports = {
  TestingImageUploadsController,
};