-- Insert sample admin user (password: admin123 - should be hashed in production)
INSERT INTO users (email, password_hash, full_name, role) VALUES
  ('admin@encargosya.com', '$2a$10$rQj5JcJjJYZ.8qY6K3Z3ZeX7FzJ8Zr3Qk9X8Qz3X8Qz3X8Qz3X8Qz', 'Administrador', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert sample exchange rates
INSERT INTO exchange_rates (date, rate, source) VALUES
  (CURRENT_DATE, 4300.00, 'Manual'),
  (CURRENT_DATE - INTERVAL '1 day', 4280.00, 'Manual'),
  (CURRENT_DATE - INTERVAL '2 days', 4290.00, 'Manual')
ON CONFLICT (date) DO NOTHING;

-- Insert sample orders for testing
INSERT INTO orders (
  order_number, client_name, client_email, client_phone,
  shipping_country, shipping_address, shipping_city, shipping_state, shipping_postal_code,
  product_name, product_url, product_quantity, store_name,
  product_price_usd, shipping_fee_usd, total_cost_usd,
  exchange_rate, total_cost_cop, commission_percentage, commission_cop,
  profit_margin_percentage, profit_margin_cop, final_price_cop,
  status, payment_status
) VALUES
  (
    'ORD-2024-001', 'María González', 'maria@example.com', '+57 300 123 4567',
    'Colombia', 'Calle 45 #12-34', 'Bogotá', 'Cundinamarca', '110111',
    'Vestido de verano floral', 'https://shein.com/product/123', 2, 'Shein',
    25.00, 0.00, 25.00,
    4300.00, 107500.00, 15.00, 16125.00,
    10.00, 10750.00, 134375.00,
    'in_transit', 'partial'
  ),
  (
    'ORD-2024-002', 'Carlos Rodríguez', 'carlos@example.com', '+57 301 234 5678',
    'Colombia', 'Carrera 7 #80-45', 'Medellín', 'Antioquia', '050001',
    'Audífonos Bluetooth', 'https://temu.com/product/456', 1, 'Temu',
    35.00, 0.00, 35.00,
    4300.00, 150500.00, 15.00, 22575.00,
    10.00, 15050.00, 188125.00,
    'confirmed', 'pending'
  )
ON CONFLICT (order_number) DO NOTHING;
