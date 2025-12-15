const path = require('path');
const fs = require('fs').promises;

class FileService {
  async saveFile(file, folder = 'assets') {
    try {
      const uploadDir = path.join(__dirname, '../../uploads', folder);
      await fs.mkdir(uploadDir, { recursive: true });

      const fileExtension = path.extname(file.name);
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}${fileExtension}`;
      const filePath = path.join(uploadDir, fileName);

      await file.mv(filePath);
      
      return `/uploads/${folder}/${fileName}`;
    } catch (error) {
      console.error('File save error:', error);
      throw new Error('Failed to save file');
    }
  }

  async deleteFile(filePath) {
    try {
      if (!filePath) return;
      const fullPath = path.join(__dirname, '../..', filePath);
      await fs.unlink(fullPath);
    } catch (error) {
      console.error('File delete error:', error);
    }
  }
}

module.exports = new FileService();