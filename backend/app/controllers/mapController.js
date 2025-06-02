const Mapper = require('../models/Mapper');

// Get all mappings
exports.getAllMappings = async (req, res) => {
  try {
    const mappings = await Mapper.find();
    
    // Transform the data to the requested format { vnkey: engkey }
    const formattedData = {};
    mappings.forEach(mapping => {
      formattedData[mapping.engkey] = mapping.vnkey;
    });
    
    res.status(200).json(formattedData);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving mappings',
      error: error.message
    });
  }
};

// Create new mapping
exports.createMapping = async (req, res) => {
  try {
    const { vnkey, engkey } = req.body;
    
    if (!vnkey || !engkey) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both Vietnamese and engkeylish values'
      });
    }
    
    const mapping = await Mapper.create({
      vnkey,
      engkey
    });
    
    res.status(201).json({
      success: true,
      data: mapping
    });
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'This Vietnamese entry already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating mapping',
      error: error.message
    });
  }
};

// Delete mapping
exports.deleteMapping = async (req, res) => {
  try {
    const { id } = req.params;
    
    const mapping = await Mapper.findByIdAndDelete(id);
    
    if (!mapping) {
      return res.status(404).json({
        success: false,
        message: 'Mapping not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Mapping deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting mapping',
      error: error.message
    });
  }
};
