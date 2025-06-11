import Property from '../models/Property.js';
import mongoose from 'mongoose';

export const getAllProperties = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      type,
      search,
      keyword,
      location,
      district,
      city,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      minArea,
      maxArea,
      direction,
      propertyType,
      amenities,
      featured,
      status = 'available',
      sort = 'newest'
    } = req.query;

    console.log('🔍 Search params:', req.query);

    // Build filter object
    const filter = { status };
    
    // Property type filter
    if (type && ['sale', 'rent'].includes(type)) {
      filter.type = type;
    }
    
    // Featured filter
    if (featured !== undefined) {
      filter.featured = featured === 'true';
    }

    // Advanced search logic
    if (search || keyword) {
      const searchTerm = (search || keyword).toLowerCase().trim();
      console.log('🔍 Search term:', searchTerm);
      
      // Create text search conditions
      const searchConditions = [];
      
      // Property type specific search
      if (searchTerm.includes('căn hộ') || searchTerm.includes('chung cư') || searchTerm.includes('apartment')) {
        searchConditions.push(
          { title: { $regex: '(căn hộ|chung cư|apartment)', $options: 'i' } },
          { description: { $regex: '(căn hộ|chung cứ|apartment)', $options: 'i' } }
        );
      } else if (searchTerm.includes('nhà phố') || searchTerm.includes('townhouse') || searchTerm.includes('nhà riêng')) {
        searchConditions.push(
          { title: { $regex: '(nhà phố|townhouse|nhà riêng)', $options: 'i' } },
          { description: { $regex: '(nhà phố|townhouse|nhà riêng)', $options: 'i' } }
        );
      } else if (searchTerm.includes('biệt thự') || searchTerm.includes('villa') || searchTerm.includes('biệt lập')) {
        searchConditions.push(
          { title: { $regex: '(biệt thự|villa|biệt lập)', $options: 'i' } },
          { description: { $regex: '(biệt thự|villa|biệt lập)', $options: 'i' } }
        );
      } else if (searchTerm.includes('shophouse') || searchTerm.includes('shop house')) {
        searchConditions.push(
          { title: { $regex: '(shophouse|shop house)', $options: 'i' } },
          { description: { $regex: '(shophouse|shop house)', $options: 'i' } }
        );
      } else {
        // General text search
        searchConditions.push(
          { title: { $regex: searchTerm, $options: 'i' } },
          { name: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
          { 'location.district': { $regex: searchTerm, $options: 'i' } },
          { 'location.address': { $regex: searchTerm, $options: 'i' } }
        );
      }
      
      if (searchConditions.length > 0) {
        filter.$or = searchConditions;
      }
    }

    // Location filters
    if (location && location !== 'Vị trí' && location !== 'all') {
      const locationConditions = [
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.district': { $regex: location, $options: 'i' } },
        { 'location.address': { $regex: location, $options: 'i' } }
      ];
      
      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: locationConditions }];
        delete filter.$or;
      } else {
        filter.$or = locationConditions;
      }
    }

    if (district && district !== 'all') {
      filter['location.district'] = { $regex: district, $options: 'i' };
    }

    if (city && city !== 'all') {
      filter['location.city'] = { $regex: city, $options: 'i' };
    }

    // Property type filter (căn hộ, nhà phố, v.v.)
    if (propertyType && propertyType !== 'all') {
      filter.title = { $regex: propertyType, $options: 'i' };
    }

    // Price filters
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }

    // Room filters
    if (bedrooms && bedrooms !== 'all') {
      filter['details.bedrooms'] = parseInt(bedrooms);
    }

    if (bathrooms && bathrooms !== 'all') {
      filter['details.bathrooms'] = parseInt(bathrooms);
    }

    // Area filters
    if (minArea || maxArea) {
      filter['details.area'] = {};
      if (minArea) filter['details.area'].$gte = parseInt(minArea);
      if (maxArea) filter['details.area'].$lte = parseInt(maxArea);
    }

    // Direction filter
    if (direction && direction !== 'all') {
      filter['details.direction'] = direction;
    }

    // Amenities filter
    if (amenities) {
      const amenitiesArray = typeof amenities === 'string' ? [amenities] : amenities;
      filter.amenities = { $in: amenitiesArray };
    }

    console.log('🔍 MongoDB filter:', JSON.stringify(filter, null, 2));

    // Build sort object
    let sortObj = {};
    switch (sort) {
      case 'price-low':
        sortObj.price = 1;
        break;
      case 'price-high':
        sortObj.price = -1;
        break;
      case 'area-large':
        sortObj['details.area'] = -1;
        break;
      case 'area-small':
        sortObj['details.area'] = 1;
        break;
      case 'newest':
      default:
        sortObj.createdAt = -1;
        break;
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const [properties, totalCount] = await Promise.all([
      Property.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Property.countDocuments(filter)
    ]);

    console.log(`📊 Found ${properties.length} properties out of ${totalCount} total`);

    // Transform data for frontend
    const transformedProperties = properties.map(property => ({
      _id: property._id.toString(),
      title: property.title,
      name: property.name,
      type: property.type,
      price: property.price,
      location: property.location,
      details: property.details,
      images: property.images || [],
      description: property.description,
      amenities: property.amenities || [],
      advantages: property.advantages,
      featured: property.featured || false,
      status: property.status,
      views: property.views || 0,
      createdAt: property.createdAt,
      updatedAt: property.updatedAt
    }));

    // Response
    res.json({
      success: true,
      data: transformedProperties,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        total: totalCount,
        limit: limitNum,
        hasNext: pageNum < Math.ceil(totalCount / limitNum),
        hasPrev: pageNum > 1
      }
    });

  } catch (error) {
    console.error('❌ Get properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching properties',
      error: error.message
    });
  }
};

export const getFeaturedProperties = async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    
    console.log('🌟 Fetching featured properties...');
    
    const properties = await Property.find({ 
      featured: true, 
      status: 'available' 
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    console.log(`📊 Found ${properties.length} featured properties`);

    const transformedProperties = properties.map(property => ({
      _id: property._id.toString(),
      title: property.title,
      name: property.name,
      type: property.type,
      price: property.price,
      location: property.location,
      details: property.details,
      images: property.images || [],
      description: property.description,
      amenities: property.amenities || [],
      advantages: property.advantages,
      featured: property.featured || false,
      status: property.status,
      views: property.views || 0,
      createdAt: property.createdAt,
      updatedAt: property.updatedAt
    }));

    res.json({
      success: true,
      data: transformedProperties
    });

  } catch (error) {
    console.error('❌ Get featured properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured properties',
      error: error.message
    });
  }
};

export const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`🔍 Fetching property by ID: ${id}`);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID format'
      });
    }
    
    const property = await Property.findById(id).lean();
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Increment views
    await Property.findByIdAndUpdate(id, { $inc: { views: 1 } });

    const transformedProperty = {
      _id: property._id.toString(),
      title: property.title,
      name: property.name,
      type: property.type,
      price: property.price,
      location: property.location,
      details: property.details,
      images: property.images || [],
      description: property.description,
      amenities: property.amenities || [],
      advantages: property.advantages,
      featured: property.featured || false,
      status: property.status,
      views: (property.views || 0) + 1,
      createdAt: property.createdAt,
      updatedAt: property.updatedAt
    };

    res.json({
      success: true,
      data: transformedProperty
    });

  } catch (error) {
    console.error('❌ Get property by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching property',
      error: error.message
    });
  }
};