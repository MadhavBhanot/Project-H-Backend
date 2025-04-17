const s3 = require('../../config/configS3')

const getPresignedUrl = async (req, res) => {
  try {
    const { fileName, fileType } = req.body // Get file name & type from frontend
    if (!fileName || !fileType) {
      return res.status(400).json({
        success: false,
        message: 'Missing file name or type',
      })
    }
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/${Date.now()}_${fileName}`, // Unique file name
      Expires: 60, // URL expires in 60 seconds
      ContentType: fileType,
      ACL: 'public-read', // Make it publicly accessible
    }

    // Generate pre-signed URL
    const signedUrl = await s3.getSignedUrlPromise('putObject', params)

    return res.status(200).json({
      success: true,
      uploadUrl: signedUrl,
      fileUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`,
    })
  } catch (error) {
    console.error('Error generating pre-signed URL', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

module.exports = getPresignedUrl
