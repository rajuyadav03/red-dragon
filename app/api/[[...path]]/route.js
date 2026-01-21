import { NextResponse } from 'next/server';
import { connectToDatabase, seedDatabase } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Helper to verify admin token (simple implementation)
function verifyAdminToken(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  try {
    // Simple base64 decode - in production use JWT
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    if (decoded.role === 'admin' && decoded.exp > Date.now()) {
      return decoded;
    }
  } catch (e) {
    return null;
  }
  return null;
}

export async function GET(request, { params }) {
  try {
    await seedDatabase();
    const { db } = await connectToDatabase();
    const pathSegments = params.path || [];
    const path = '/' + pathSegments.join('/');

    // GET /api/health
    if (path === '/health') {
      return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() }, { headers: corsHeaders });
    }

    // GET /api/dishes
    if (path === '/dishes') {
      const url = new URL(request.url);
      const showAll = url.searchParams.get('all') === 'true';
      const featuredOnly = url.searchParams.get('featured') === 'true';
      let query = {};
      if (featuredOnly) {
        query = { available: true, isFeatured: true };
      } else if (!showAll) {
        query = { available: true };
      }
      const dishes = await db.collection('dishes').find(query).toArray();
      return NextResponse.json(dishes, { headers: corsHeaders });
    }

    // GET /api/stats (public stats for dashboard)
    if (path === '/stats') {
      const dishCount = await db.collection('dishes').countDocuments({ available: true });
      const categoryCount = await db.collection('categories').countDocuments({});
      const featuredCount = await db.collection('dishes').countDocuments({ isFeatured: true, available: true });
      return NextResponse.json({ dishCount, categoryCount, featuredCount }, { headers: corsHeaders });
    }

    // GET /api/categories
    if (path === '/categories') {
      const categories = await db.collection('categories').find({}).sort({ order: 1 }).toArray();
      return NextResponse.json(categories, { headers: corsHeaders });
    }

    // GET /api/restaurant-info
    if (path === '/restaurant-info') {
      const info = await db.collection('restaurantInfo').findOne({});
      return NextResponse.json(info || {}, { headers: corsHeaders });
    }

    // GET /api/admin/dishes (requires auth)
    if (path === '/admin/dishes') {
      const admin = verifyAdminToken(request);
      if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
      }
      const dishes = await db.collection('dishes').find({}).toArray();
      return NextResponse.json(dishes, { headers: corsHeaders });
    }

    // GET /api/admin/verify
    if (path === '/admin/verify') {
      const admin = verifyAdminToken(request);
      if (!admin) {
        return NextResponse.json({ valid: false }, { status: 401, headers: corsHeaders });
      }
      return NextResponse.json({ valid: true, email: admin.email }, { headers: corsHeaders });
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404, headers: corsHeaders });
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(request, { params }) {
  try {
    await seedDatabase();
    const { db } = await connectToDatabase();
    const pathSegments = params.path || [];
    const path = '/' + pathSegments.join('/');
    const body = await request.json();

    // POST /api/admin/login
    if (path === '/admin/login') {
      const { email, password } = body;
      const admin = await db.collection('admins').findOne({ email });
      if (!admin) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401, headers: corsHeaders });
      }
      const bcrypt = await import('bcryptjs');
      const isValid = await bcrypt.compare(password, admin.password);
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401, headers: corsHeaders });
      }
      // Create simple token (in production use JWT)
      const token = Buffer.from(JSON.stringify({
        id: admin.id,
        email: admin.email,
        role: 'admin',
        exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
      })).toString('base64');
      return NextResponse.json({ token, email: admin.email }, { headers: corsHeaders });
    }

    // POST /api/admin/dishes (create dish)
    if (path === '/admin/dishes') {
      const admin = verifyAdminToken(request);
      if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
      }
      if (!body.name || !body.price || !body.category) {
        return NextResponse.json({ error: 'Name, price, and category are required' }, { status: 400, headers: corsHeaders });
      }
      const dish = {
        id: uuidv4(),
        name: body.name,
        price: Number(body.price),
        image: body.image || '',
        category: body.category,
        available: body.available !== false,
        isFeatured: body.isFeatured === true,
        description: body.description || '',
        createdAt: new Date()
      };
      await db.collection('dishes').insertOne(dish);
      return NextResponse.json(dish, { status: 201, headers: corsHeaders });
    }

    // POST /api/admin/categories (create category)
    if (path === '/admin/categories') {
      const admin = verifyAdminToken(request);
      if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
      }
      const maxOrder = await db.collection('categories').find({}).sort({ order: -1 }).limit(1).toArray();
      const category = {
        id: uuidv4(),
        name: body.name,
        order: (maxOrder[0]?.order || 0) + 1
      };
      await db.collection('categories').insertOne(category);
      return NextResponse.json(category, { status: 201, headers: corsHeaders });
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404, headers: corsHeaders });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}

export async function PUT(request, { params }) {
  try {
    const { db } = await connectToDatabase();
    const pathSegments = params.path || [];
    const path = '/' + pathSegments.join('/');
    const body = await request.json();

    // PUT /api/admin/dishes/:id
    if (path.startsWith('/admin/dishes/')) {
      const admin = verifyAdminToken(request);
      if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
      }
      const dishId = pathSegments[2];
      const updateData = {
        ...(body.name && { name: body.name }),
        ...(body.price !== undefined && { price: Number(body.price) }),
        ...(body.image !== undefined && { image: body.image }),
        ...(body.category && { category: body.category }),
        ...(body.available !== undefined && { available: body.available }),
        ...(body.isFeatured !== undefined && { isFeatured: body.isFeatured }),
        ...(body.description !== undefined && { description: body.description }),
        updatedAt: new Date()
      };
      await db.collection('dishes').updateOne({ id: dishId }, { $set: updateData });
      const updated = await db.collection('dishes').findOne({ id: dishId });
      if (!updated) {
        return NextResponse.json({ error: 'Dish not found' }, { status: 404, headers: corsHeaders });
      }
      return NextResponse.json(updated, { headers: corsHeaders });
    }

    // PUT /api/admin/categories/:id
    if (path.startsWith('/admin/categories/')) {
      const admin = verifyAdminToken(request);
      if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
      }
      const catId = pathSegments[2];
      const updateData = {
        ...(body.name && { name: body.name }),
        ...(body.order !== undefined && { order: body.order })
      };
      await db.collection('categories').updateOne({ id: catId }, { $set: updateData });
      const updated = await db.collection('categories').findOne({ id: catId });
      return NextResponse.json(updated, { headers: corsHeaders });
    }

    // PUT /api/admin/restaurant-info
    if (path === '/admin/restaurant-info') {
      const admin = verifyAdminToken(request);
      if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
      }
      const updateData = { ...body, updatedAt: new Date() };
      await db.collection('restaurantInfo').updateOne({}, { $set: updateData });
      const updated = await db.collection('restaurantInfo').findOne({});
      return NextResponse.json(updated, { headers: corsHeaders });
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404, headers: corsHeaders });
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { db } = await connectToDatabase();
    const pathSegments = params.path || [];
    const path = '/' + pathSegments.join('/');

    // DELETE /api/admin/dishes/:id
    if (path.startsWith('/admin/dishes/')) {
      const admin = verifyAdminToken(request);
      if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
      }
      const dishId = pathSegments[2];
      await db.collection('dishes').deleteOne({ id: dishId });
      return NextResponse.json({ success: true }, { headers: corsHeaders });
    }

    // DELETE /api/admin/categories/:id
    if (path.startsWith('/admin/categories/')) {
      const admin = verifyAdminToken(request);
      if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
      }
      const catId = pathSegments[2];
      await db.collection('categories').deleteOne({ id: catId });
      return NextResponse.json({ success: true }, { headers: corsHeaders });
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404, headers: corsHeaders });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}
