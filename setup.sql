-- Run in Supabase SQL Editor

CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price_range TEXT NOT NULL,
  estimated_hours TEXT NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time TIME NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow public read of active services
CREATE POLICY "Public can read active services" ON services
  FOR SELECT USING (is_active = true);

-- Allow public insert into bookings
CREATE POLICY "Public can create bookings" ON bookings
  FOR INSERT WITH CHECK (true);

CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_title TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT NOT NULL,
  avatar_url TEXT,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read visible reviews" ON reviews
  FOR SELECT USING (is_visible = true);

-- Insert sample reviews
INSERT INTO reviews (customer_name, customer_title, rating, content, avatar_url) VALUES
  ('Sarah Mitchell', 'Homeowner', 5, 'Absolutely transformed our living room. The team was punctual, professional, and the finish is flawless. We''ve already booked them for the bedrooms.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80'),
  ('James Whittaker', 'Property Manager', 5, 'We used PaintBooking for 12 apartment units. Consistently excellent quality, minimal disruption to tenants, and they finished ahead of schedule.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80'),
  ('Eleanor Chen', 'Interior Designer', 5, 'As a designer, I''m particular about finishes. PaintBooking''s attention to detail is exceptional. They understand color theory and prep work better than any crew I''ve worked with.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80'),
  ('Marcus Rivera', 'Restaurant Owner', 4, 'Painted our entire restaurant over a weekend. Great communication, fair pricing, and the space looks incredible. Would recommend without hesitation.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80'),
  ('Claire Beaumont', 'Homeowner', 5, 'From the free estimate to the final walkthrough, everything was seamless. They protected our floors and furniture meticulously. Worth every penny.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80'),
  ('David Okonkwo', 'Office Manager', 5, 'Painted our open-plan office during off-hours. Zero disruption to our workday. The matte finish they recommended looks incredibly professional.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80');

CREATE TABLE gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  label TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read visible gallery" ON gallery
  FOR SELECT USING (is_visible = true);

INSERT INTO gallery (image_url, label, sort_order) VALUES
  ('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80', 'Interior Living Room', 1),
  ('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80', 'Dining Room', 2),
  ('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80', 'Kitchen Cabinets', 3),
  ('https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600&q=80', 'Exterior Residence', 4),
  ('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80', 'Bathroom', 5),
  ('https://images.unsplash.com/photo-1600566753086-00f18f6b0052?w=600&q=80', 'Commercial Office', 6);

-- Enable Realtime for bookings table (live admin updates)
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;

-- Insert sample services
INSERT INTO services (name, description, price_range, estimated_hours, image_url) VALUES
  ('Interior Painting', 'Professional interior wall painting for rooms of all sizes. Includes preparation, priming, and two coats of premium paint.', '$200 - $800', '2-6 hours', 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80'),
  ('Exterior Painting', 'Full exterior painting service for houses and buildings. Pressure washing, scraping, priming, and painting included.', '$500 - $2,500', '4-12 hours', 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=800&q=80'),
  ('Cabinet Painting', 'Transform your kitchen or bathroom cabinets with professional painting. Includes sanding, priming, and painting.', '$300 - $1,000', '3-8 hours', 'https://images.unsplash.com/photo-1586208958839-06c17cacdf08?w=800&q=80'),
  ('Deck & Fence Staining', 'Protect and beautify your outdoor wood surfaces with professional staining and sealing.', '$250 - $1,200', '3-8 hours', 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80'),
  ('Wallpaper Removal', 'Professional wallpaper removal and wall preparation for repainting.', '$150 - $600', '2-6 hours', 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=800&q=80'),
  ('Commercial Painting', 'Painting services for offices, retail spaces, and commercial properties. Minimal disruption to your business.', '$1,000 - $5,000', 'varies', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80');
