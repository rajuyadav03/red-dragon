import { NextResponse } from 'next/server';
import { connectToDatabase, seedDatabase } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

// Generate order number like RD-001234
function generateOrderNumber() {
  const num = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
  return `RD-${num}`;
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
      return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() });
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
      return NextResponse.json(dishes);
    }

    // GET /api/stats (public stats for dashboard)
    if (path === '/stats') {
      const dishCount = await db.collection('dishes').countDocuments({ available: true });
      const categoryCount = await db.collection('categories').countDocuments({});
      const featuredCount = await db.collection('dishes').countDocuments({ isFeatured: true, available: true });
      return NextResponse.json({ dishCount, categoryCount, featuredCount });
    }

    // GET /api/categories
    if (path === '/categories') {
      const categories = await db.collection('categories').find({}).sort({ order: 1 }).toArray();
      return NextResponse.json(categories);
    }

    // GET /api/restaurant-info
    if (path === '/restaurant-info') {
      const info = await db.collection('restaurantInfo').findOne({});
      return NextResponse.json(info || {});
    }

    // GET /api/orders/:id (public - for order tracking)
    if (path.startsWith('/orders/') && pathSegments.length === 2) {
      const orderId = pathSegments[1];
      const order = await db.collection('orders').findOne({ id: orderId });
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      return NextResponse.json(order);
    }

    // GET /api/admin/dishes (requires auth)
    if (path === '/admin/dishes') {
      const admin = verifyAdminToken(request);
      if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const dishes = await db.collection('dishes').find({}).toArray();
      return NextResponse.json(dishes);
    }

    // GET /api/admin/orders (requires auth)
    if (path === '/admin/orders') {
      const admin = verifyAdminToken(request);
      if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const url = new URL(request.url);
      const status = url.searchParams.get('status');
      const query = status && status !== 'all' ? { status } : {};
      const orders = await db.collection('orders').find(query).sort({ createdAt: -1 }).toArray();
      return NextResponse.json(orders);
    }

    // GET /api/admin/orders/:id (requires auth)
    if (path.startsWith('/admin/orders/') && pathSegments.length === 3) {
      const admin = verifyAdminToken(request);
      if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const orderId = pathSegments[2];
      const order = await db.collection('orders').findOne({ id: orderId });
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      return NextResponse.json(order);
    }

    // GET /api/admin/verify
    if (path === '/admin/verify') {
      const admin = verifyAdminToken(request);
      if (!admin) {
        return NextResponse.json({ valid: false }, { status: 401 });
      }
      return NextResponse.json({ valid: true, email: admin.email });
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
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
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }
      const bcrypt = await import('bcryptjs');
      const isValid = await bcrypt.compare(password, admin.password);
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }
      // Create simple token (in production use JWT)
      const token = Buffer.from(JSON.stringify({
        id: admin.id,
        email: admin.email,
        role: 'admin',
        exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
      })).toString('base64');
      return NextResponse.json({ token, email: admin.email });
    }

    // POST /api/admin/dishes (create dish)
    if (path === '/admin/dishes') {
      const admin = verifyAdminToken(request);
      if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      if (!body.name || !body.price || !body.category) {
        return NextResponse.json({ error: 'Name, price, and category are required' }, { status: 400 });
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
      return NextResponse.json(dish, { status: 201 });
    }

    // POST /api/admin/categories (create category)
    if (path === '/admin/categories') {
      const admin = verifyAdminToken(request);
      if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const maxOrder = await db.collection('categories').find({}).sort({ order: -1 }).limit(1).toArray();
      const category = {
        id: uuidv4(),
        name: body.name,
        order: (maxOrder[0]?.order || 0) + 1
      };
      await db.collection('categories').insertOne(category);
      return NextResponse.json(category, { status: 201 });
    }

    // POST /api/orders (create customer order - public)
    if (path === '/orders') {
      // Validate required fields
      if (!body.items || !body.items.length) {
        return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
      }
      if (!body.customer?.name || !body.customer?.phone) {
        return NextResponse.json({ error: 'Customer name and phone are required' }, { status: 400 });
      }
      if (!body.type || !['delivery', 'takeaway', 'dine-in'].includes(body.type)) {
        return NextResponse.json({ error: 'Invalid order type' }, { status: 400 });
      }

      const order = {
        id: uuidv4(),
        orderNumber: generateOrderNumber(),
        status: 'pending',
        type: body.type,
        customer: {
          name: body.customer.name,
          phone: body.customer.phone,
          address: body.customer.address || undefined
        },
        tableNumber: body.tableNumber || undefined,
        items: body.items.map(item => ({
          dishId: item.dishId,
          name: item.name,
          price: Number(item.price),
          quantity: Number(item.quantity),
          image: item.image || undefined,
          instructions: item.instructions || undefined
        })),
        subtotal: Number(body.subtotal),
        tax: Number(body.tax),
        deliveryFee: body.type === 'delivery' ? 0 : undefined,
        discount: body.discount || 0,
        total: Number(body.total),
        instructions: body.instructions || undefined,
        estimatedTime: body.type === 'dine-in' ? 20 : 45, // Default estimate in minutes
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await db.collection('orders').insertOne(order);

      return NextResponse.json({
        orderId: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        estimatedTime: order.estimatedTime
      }, { status: 201 });
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
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
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
        return NextResponse.json({ error: 'Dish not found' }, { status: 404 });
      }
      return NextResponse.json(updated);
    }

    // PUT /api/admin/categories/:id
    if (path.startsWith('/admin/categories/')) {
      const admin = verifyAdminToken(request);
      if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const catId = pathSegments[2];
      const updateData = {
        ...(body.name && { name: body.name }),
        ...(body.order !== undefined && { order: body.order })
      };
      await db.collection('categories').updateOne({ id: catId }, { $set: updateData });
      const updated = await db.collection('categories').findOne({ id: catId });
      return NextResponse.json(updated);
    }

    // PUT /api/admin/restaurant-info
    if (path === '/admin/restaurant-info') {
      const admin = verifyAdminToken(request);
      if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const updateData = { ...body, updatedAt: new Date() };
      await db.collection('restaurantInfo').updateOne({}, { $set: updateData });
      const updated = await db.collection('restaurantInfo').findOne({});
      return NextResponse.json(updated);
    }

    // PUT /api/admin/orders/:id (update order status)
    if (path.startsWith('/admin/orders/') && pathSegments.length === 3) {
      const admin = verifyAdminToken(request);
      if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const orderId = pathSegments[2];
      const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered', 'cancelled'];

      const updateData = { updatedAt: new Date() };

      if (body.status) {
        if (!validStatuses.includes(body.status)) {
          return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }
        updateData.status = body.status;

        // Set timestamps for status changes
        if (body.status === 'confirmed') updateData.confirmedAt = new Date();
        if (body.status === 'delivered' || body.status === 'cancelled') updateData.completedAt = new Date();
      }

      if (body.estimatedTime !== undefined) {
        updateData.estimatedTime = Number(body.estimatedTime);
      }

      const result = await db.collection('orders').updateOne({ id: orderId }, { $set: updateData });
      if (result.matchedCount === 0) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      const updated = await db.collection('orders').findOne({ id: orderId });
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
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
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const dishId = pathSegments[2];
      await db.collection('dishes').deleteOne({ id: dishId });
      return NextResponse.json({ success: true });
    }

    // DELETE /api/admin/categories/:id
    if (path.startsWith('/admin/categories/')) {
      const admin = verifyAdminToken(request);
      if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const catId = pathSegments[2];
      await db.collection('categories').deleteOne({ id: catId });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
