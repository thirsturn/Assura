const Asset = require('./asset.model');
const qrService = require('../../services/qr.service');
const fileService = require('../../services/file.service');

exports.createAsset = async (req, res) => {
  try {
    console.log('Creating asset with data:', req.body);
    const assetData = { ...req.body };
    
    // Handle image upload
    if (req.files && req.files.image) {
      console.log('Image file received:', req.files.image.name);
      const imagePath = await fileService.saveFile(req.files.image, 'assets');
      assetData.image_path = imagePath;
      console.log('Image saved to:', imagePath);
    }
    
    // Create asset in database
    console.log('Creating asset in database...');
    const assetId = await Asset.create(assetData);
    console.log('Asset created with ID:', assetId);
    
    // Generate QR code
    console.log('Generating QR code...');
    try {
      const qrCodePath = await qrService.generateQRCode({
        assetId: assetData.asset_id,
        id: assetId
      });
      console.log('QR code generated:', qrCodePath);
      
      // Update asset with QR code path
      await Asset.updateQRPath(assetId, qrCodePath);
      console.log('Asset updated with QR code path');
    } catch (qrError) {
      console.error('QR code generation failed:', qrError);
      // Continue even if QR generation fails
    }
    
    // Fetch complete asset data
    const asset = await Asset.findById(assetId);
    
    res.status(201).json({
      success: true,
      message: 'Asset created successfully',
      data: asset
    });
  } catch (error) {
    console.error('Error creating asset:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error creating asset',
      error: error.message
    });
  }
};

// ... rest of the exports remain the same
exports.getAllAssets = async (req, res) => {
  try {
    const filters = {
      status_id: req.query.status_id,
      location_id: req.query.location_id,
      search: req.query.search
    };
    
    console.log('Fetching assets with filters:', filters);
    const assets = await Asset.findAll(filters);
    console.log(`Found ${assets.length} assets`);
    
    res.json({
      success: true,
      count: assets.length,
      data: assets
    });
  } catch (error) {
    console.error('Error fetching assets:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching assets',
      error: error.message,
      data: []
    });
  }
};

exports.getAssetById = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    
    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }
    
    res.json({
      success: true,
      data: asset
    });
  } catch (error) {
    console.error('Error fetching asset:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching asset',
      error: error.message
    });
  }
};

exports.updateAsset = async (req, res) => {
  try {
    const assetId = req.params.id;
    const assetData = { ...req.body };
    
    if (req.files && req.files.image) {
      const asset = await Asset.findById(assetId);
      if (asset && asset.image_path) {
        await fileService.deleteFile(asset.image_path);
      }
      const imagePath = await fileService.saveFile(req.files.image, 'assets');
      assetData.image_path = imagePath;
    }
    
    const updated = await Asset.update(assetId, assetData);
    
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }
    
    const asset = await Asset.findById(assetId);
    
    res.json({
      success: true,
      message: 'Asset updated successfully',
      data: asset
    });
  } catch (error) {
    console.error('Error updating asset:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating asset',
      error: error.message
    });
  }
};

exports.deleteAsset = async (req, res) => {
  try {
    const assetId = req.params.id;
    const asset = await Asset.findById(assetId);
    
    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }
    
    if (asset.image_path) {
      await fileService.deleteFile(asset.image_path);
    }
    if (asset.qr_code_path) {
      await fileService.deleteFile(asset.qr_code_path);
    }
    
    await Asset.delete(assetId);
    
    res.json({
      success: true,
      message: 'Asset deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting asset:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting asset',
      error: error.message
    });
  }
};

exports.getStats = async (req, res) => {
  try {
    const stats = await Asset.getStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};