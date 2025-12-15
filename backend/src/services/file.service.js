const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class FileService {
    constructor() {
        this.uploadDir = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }

    async saveFile(file, subDir = '') {
        try {
            const fileExt = path.extname(file.name);
            const fileName = `${uuidv4()}${fileExt}`;
            const targetDir = path.join(this.uploadDir, subDir);

            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }

            const filePath = path.join(targetDir, fileName);
            await file.mv(filePath);

            // Return relative path for database storage
            return path.join('uploads', subDir, fileName).replace(/\\/g, '/');
        } catch (error) {
            throw new Error(`Error saving file: ${error.message}`);
        }
    }

    async deleteFile(filePath) {
        try {
            const fullPath = path.join(__dirname, '../../', filePath);
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
                return true;
            }
            return false;
        } catch (error) {
            console.error(`Error deleting file: ${error.message}`);
            return false;
        }
    }
}

module.exports = new FileService();
