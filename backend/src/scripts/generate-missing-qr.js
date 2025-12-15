const pool = require('../config/database');
const qrService = require('../services/qr.service');

async function generateMissingQRCodes() {
  try {
    console.log('Finding assets without QR codes...');
    
    const [assets] = await pool.query(
      'SELECT id, asset_id FROM assets WHERE qr_code_path IS NULL OR qr_code_path = ""'
    );
    
    console.log(`Found ${assets.length} assets without QR codes`);
    
    for (const asset of assets) {
      console.log(`Generating QR for asset ${asset.asset_id}...`);
      
      try {
        const qrPath = await qrService.generateQRCode({
          assetId: asset.asset_id,
          id: asset.id
        });
        
        await pool.query(
          'UPDATE assets SET qr_code_path = ? WHERE id = ?',
          [qrPath, asset.id]
        );
        
        console.log(`✓ Generated QR code for asset ${asset.asset_id}`);
      } catch (error) {
        console.error(`✗ Failed to generate QR for asset ${asset.asset_id}:`, error.message);
      }
    }
    
    console.log('Done!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

generateMissingQRCodes();