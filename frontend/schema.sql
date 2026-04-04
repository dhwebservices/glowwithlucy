DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS discount_codes;
DROP TABLE IF EXISTS products;

CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  size_oz INTEGER NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  scent_notes TEXT,
  burn_time_hours INTEGER NOT NULL,
  price_pence INTEGER NOT NULL,
  image_url TEXT,
  featured INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE discount_codes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  kind TEXT NOT NULL CHECK (kind IN ('percent', 'fixed')),
  amount INTEGER NOT NULL,
  min_order_pence INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  starts_at TEXT,
  ends_at TEXT,
  usage_limit INTEGER,
  times_used INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address TEXT NOT NULL,
  notes TEXT,
  subtotal_pence INTEGER NOT NULL,
  discount_pence INTEGER NOT NULL DEFAULT 0,
  total_pence INTEGER NOT NULL,
  discount_code TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'paid', 'making', 'shipped', 'completed', 'cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id),
  product_name TEXT NOT NULL,
  size_label TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price_pence INTEGER NOT NULL,
  line_total_pence INTEGER NOT NULL,
  scent TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_active ON products(active, sort_order);
CREATE INDEX idx_discount_codes_code ON discount_codes(code);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_sessions_token ON sessions(token);

INSERT INTO products (id, slug, name, size_oz, subtitle, description, scent_notes, burn_time_hours, price_pence, image_url, featured, active, sort_order)
VALUES
  (101, 'heart-bears', 'Heart Bears', 7, 'Custom sculpted candle', 'Custom sculpted candle available in small, medium, and large sizes.', 'Fully customisable with size, colour, and scent selections.', 35, 1800, '/assets/site/candle-small.jpg', 1, 1, 1),
  (102, 'rose', 'Rose', 7, 'Floral sculpted candle', 'Floral sculpted candle available in small, medium, and large sizes.', 'Fully customisable with size, colour, and scent selections.', 35, 1800, '/assets/site/candle-medium.jpg', 1, 1, 2),
  (103, 'spirals', 'Spirals', 7, 'Modern spiral candle', 'Modern spiral candle available in small, medium, and large sizes.', 'Fully customisable with size, colour, and scent selections.', 35, 1800, '/assets/site/candle-large.jpg', 1, 1, 3),
  (104, 'bubble-cubes', 'Bubble Cubes', 7, 'Bubble cube candle', 'Bubble cube candle available in small and large sizes.', 'Fully customisable with size, colour, and scent selections.', 35, 1800, '/assets/site/candle-medium.jpg', 1, 1, 4);

INSERT INTO discount_codes (code, description, kind, amount, min_order_pence, active)
VALUES
  ('WELCOME10', '10% off first orders', 'percent', 10, 0, 1),
  ('LUCY15', '£15 off orders over £80', 'fixed', 1500, 8000, 1);
