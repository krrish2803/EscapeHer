const multer = require('multer');
const path = require('path');
const { errorResponse } = require('../utils/response');

const AUDIO_MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm', 'audio/mp4'];

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'audio') {
    if (!ALLOWED_AUDIO_TYPES.includes(file.mimetype)) {
      return cb(new Error('Invalid audio format. Allowed: mp3, wav, ogg, webm, mp4'), false);
    }
  }
  cb(null, true);
};

const uploadAudio = multer({
  storage,
  fileFilter,
  limits: { fileSize: AUDIO_MAX_SIZE },
}).single('audio');

function uploadAudioMiddleware(req, res, next) {
  uploadAudio(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return errorResponse(res, 'Audio file too large. Max 10MB', 400);
        }
        return errorResponse(res, err.message, 400);
      }
      return errorResponse(res, err.message, 400);
    }
    next();
  });
}

module.exports = { uploadAudioMiddleware };
