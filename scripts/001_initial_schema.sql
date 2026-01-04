-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'client' CHECK (role IN ('client', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  client_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Client information
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_phone VARCHAR(50),
  
  -- Shipping information
  shipping_country VARCHAR(100) NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_city VARCHAR(100) NOT NULL,
  shipping_state VARCHAR(100),
  shipping_postal_code VARCHAR(20),
  
  -- Product information
  product_name TEXT NOT NULL,
  product_url TEXT NOT NULL,
  product_quantity INTEGER NOT NULL DEFAULT 1,
  product_image_url TEXT,
  
  -- Store information
  store_name VARCHAR(100) NOT NULL CHECK (store_name IN ('Temu', 'Shein', 'Amazon', 'Otro')),
  
  -- Pricing (all in USD)
  product_price_usd DECIMAL(10, 2) NOT NULL,
  shipping_fee_usd DECIMAL(10, 2) DEFAULT 0,
  platform_fee_usd DECIMAL(10, 2) DEFAULT 0,
  total_cost_usd DECIMAL(10, 2) NOT NULL,
  
  -- Exchange rate and Colombian pricing
  exchange_rate DECIMAL(10, 2) NOT NULL,
  total_cost_cop DECIMAL(12, 2) NOT NULL,
  commission_percentage DECIMAL(5, 2) DEFAULT 15.00,
  commission_cop DECIMAL(12, 2) NOT NULL,
  profit_margin_percentage DECIMAL(5, 2) DEFAULT 10.00,
  profit_margin_cop DECIMAL(12, 2) NOT NULL,
  final_price_cop DECIMAL(12, 2) NOT NULL,
  
  -- Payment information
  payment_method VARCHAR(50),
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid')),
  amount_paid DECIMAL(12, 2) DEFAULT 0,
  
  -- Order status
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'purchased', 'in_transit', 'delivered', 'cancelled')),
  
  -- Notes
  client_notes TEXT,
  admin_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  delivered_at TIMESTAMP WITH TIME ZONE
);

-- Create order_items table for multiple products per order
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_name VARCHAR(255) NOT NULL,
  product_url TEXT NOT NULL,
  product_quantity INTEGER NOT NULL DEFAULT 1,
  product_price_usd DECIMAL(10, 2) NOT NULL,
  product_image_url TEXT,
  size VARCHAR(50),
  color VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create exchange_rates table for tracking daily rates
CREATE TABLE IF NOT EXISTS exchange_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE UNIQUE NOT NULL,
  rate DECIMAL(10, 2) NOT NULL,
  source VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create settings table for business configuration
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO settings (key, value, description) VALUES
  ('default_commission', '15', 'Default commission percentage'),
  ('default_profit_margin', '10', 'Default profit margin percentage'),
  ('default_exchange_rate', '4300', 'Default USD to COP exchange rate'),
  ('temu_shipping_fee', '0', 'Default Temu shipping fee in USD'),
  ('shein_shipping_fee', '0', 'Default Shein shipping fee in USD'),
  ('amazon_shipping_fee', '5', 'Default Amazon shipping fee in USD')
ON CONFLICT (key) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_client_id ON orders(client_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_exchange_rates_date ON exchange_rates(date);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
