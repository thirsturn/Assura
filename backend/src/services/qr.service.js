const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs').promises;

class QRService {
  async generateQRCode(assetInfo) {
    try {
      console.log('Generating QR code for:', assetInfo);

      // Create QR code data (URL to asset details)
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
      const qrData = `${frontendUrl}/storeKeeper/assets/${assetInfo.id}`;

      const fileName = `qr_${assetInfo.assetId}_${Date.now()}.png`;
      const uploadsDir = path.join(__dirname, '../../uploads/qrcodes');
      const filePath = path.join(uploadsDir, fileName);

      console.log('QR code will be saved to:', filePath);

      // Ensure directory exists
      await fs.mkdir(uploadsDir, { recursive: true });
      console.log('Directory created/verified:', uploadsDir);

      // Generate QR code with options
      await QRCode.toFile(filePath, qrData, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'H'
      });

      console.log('QR code generated successfully:', fileName);

      return `/uploads/qrcodes/${fileName}`;
    } catch (error) {
      console.error('QR generation error:', error);
      console.error('Error stack:', error.stack);
      throw new Error('Failed to generate QR code: ' + error.message);
    }
  }

  async generateBulkQRCodes(assets) {
    const results = [];
    for (const asset of assets) {
      try {
        const qrPath = await this.generateQRCode({
          assetId: asset.asset_id,
          id: asset.id
        });
        results.push({ id: asset.id, qrPath, success: true });
      } catch (error) {
        results.push({ id: asset.id, error: error.message, success: false });
      }
    }
    return results;
  }
}

module.exports = new QRService();