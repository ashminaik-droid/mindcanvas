# scripts/generate-assets.py
import zlib
import struct
import math
import os

def create_png(width, height, get_pixel_rgba, filepath):
    # PNG signature
    png_data = b'\x89PNG\r\n\x1a\n'
    
    # IHDR chunk
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    ihdr_crc = zlib.crc32(b'IHDR' + ihdr_data)
    png_data += struct.pack('>I', len(ihdr_data)) + b'IHDR' + ihdr_data + struct.pack('>I', ihdr_crc)
    
    # Raw scanlines
    raw_scanlines = bytearray()
    for y in range(height):
        raw_scanlines.append(0) # Filter byte 0 (None)
        for x in range(width):
            r, g, b, a = get_pixel_rgba(x, y, width, height)
            raw_scanlines.extend((r, g, b, a))
            
    # Compress with zlib
    compressed_idat = zlib.compress(bytes(raw_scanlines), 9)
    idat_crc = zlib.crc32(b'IDAT' + compressed_idat)
    png_data += struct.pack('>I', len(compressed_idat)) + b'IDAT' + compressed_idat + struct.pack('>I', idat_crc)
    
    # IEND chunk
    iend_crc = zlib.crc32(b'IEND')
    png_data += struct.pack('>I', 0) + b'IEND' + struct.pack('>I', iend_crc)
    
    with open(filepath, 'wb') as f:
        f.write(png_data)
    print(f"Generated {filepath} ({width}x{height})")

def app_icon_pixel(x, y, w, h):
    # Normalized coordinates (-1 to 1)
    nx = (x / w) * 2 - 1
    ny = (y / h) * 2 - 1
    dist = math.sqrt(nx*nx + ny*ny)
    
    # Background: Rounded rectangle app icon container
    # Squircle distance: (|nx|^4 + |ny|^4)^(1/4)
    squircle = (abs(nx)**4.5 + abs(ny)**4.5)**(1/4.5)
    if squircle > 0.94:
        return (0, 0, 0, 0) # Transparent outside icon
        
    # Pastel gradient background: Cream -> Soft Lavender -> Light Rose
    bg_t = (nx + ny + 2) / 4.0
    r_bg = int(255 - bg_t * 22)  # 255 -> 233
    g_bg = int(248 - bg_t * 26)  # 248 -> 222
    b_bg = int(243 + bg_t * 12)  # 243 -> 255
    
    # Center Journal Canvas (rounded card)
    card_w, card_h = 0.58, 0.68
    dx = max(abs(nx) - card_w + 0.12, 0)
    dy = max(abs(ny) - card_h + 0.12, 0)
    card_dist = math.sqrt(dx*dx + dy*dy)
    
    # Card shadow
    shadow_dx = max(abs(nx) - card_w + 0.12, 0)
    shadow_dy = max(abs(ny - 0.05) - card_h + 0.12, 0)
    shadow_dist = math.sqrt(shadow_dx*shadow_dx + shadow_dy*shadow_dy)
    if shadow_dist < 0.14 and card_dist >= 0.12:
        shadow_intensity = (1.0 - (shadow_dist - 0.12) / 0.02) * 0.15
        r_bg = int(r_bg * (1 - shadow_intensity))
        g_bg = int(g_bg * (1 - shadow_intensity))
        b_bg = int(b_bg * (1 - shadow_intensity))
        
    if card_dist < 0.12:
        # Inside the Journal Canvas
        # Soft white surface with pastel border
        if card_dist > 0.10:
            return (185, 165, 232, 255) # Lavender border
            
        # Draw 5 Mood orbs (Yellow, Lavender, Pink, Peach, Light Blue) in a gentle circle
        mood_colors = [
            (255, 220, 110), # Happy (Yellow)
            (185, 165, 232), # Calm (Lavender)
            (245, 198, 214), # Loved (Pink)
            (255, 214, 176), # Anxious (Peach)
            (197, 211, 232), # Sad (Light Blue)
        ]
        
        # Center of mood circle is at (0, -0.04)
        for i, (mc_r, mc_g, mc_b) in enumerate(mood_colors):
            angle = i * (2 * math.pi / 5) - math.pi / 2
            orb_x = math.cos(angle) * 0.26
            orb_y = math.sin(angle) * 0.26 - 0.04
            
            orb_dist = math.sqrt((nx - orb_x)**2 + (ny - orb_y)**2)
            if orb_dist < 0.085:
                # Radial glow for orb
                glow = 1.0 - (orb_dist / 0.085) * 0.25
                return (int(mc_r * glow), int(mc_g * glow), int(mc_b * glow), 255)
                
        # Center Sparkle / Reflection Star
        cx, cy = nx, ny + 0.04
        # 4-pointed star: |x|*|y| < thresh
        star_r = math.sqrt(cx*cx + cy*cy)
        if star_r < 0.18:
            star_shape = (abs(cx)**0.5 + abs(cy)**0.5)
            if star_shape < 0.38:
                return (185, 165, 232, 255) # Lavender sparkle
                
        # Subtle journal lines below sparkle
        if ny > 0.28 and abs(nx) < 0.38:
            line_y1 = abs(ny - 0.32)
            line_y2 = abs(ny - 0.42)
            if line_y1 < 0.012 or line_y2 < 0.012:
                return (240, 230, 222, 255)
                
        return (255, 255, 255, 255) # Clean White Canvas
        
    return (r_bg, g_bg, b_bg, 255)

def splash_icon_pixel(x, y, w, h):
    # Normalized coords
    nx = (x / w) * 2 - 1
    ny = (y / h) * 2 - 1
    
    # Outer circle badge
    dist = math.sqrt(nx*nx + ny*ny)
    if dist > 0.88:
        return (0, 0, 0, 0)
    if dist > 0.82:
        return (245, 198, 214, 255) # Pink border
        
    # Inside badge
    if dist <= 0.82:
        # 5 Mood circles
        mood_colors = [
            (255, 220, 110), # Yellow
            (185, 165, 232), # Lavender
            (245, 198, 214), # Pink
            (255, 214, 176), # Peach
            (197, 211, 232), # Blue
        ]
        for i, (mc_r, mc_g, mc_b) in enumerate(mood_colors):
            angle = i * (2 * math.pi / 5) - math.pi / 2
            orb_x = math.cos(angle) * 0.44
            orb_y = math.sin(angle) * 0.44
            
            orb_dist = math.sqrt((nx - orb_x)**2 + (ny - orb_y)**2)
            if orb_dist < 0.18:
                return (mc_r, mc_g, mc_b, 255)
                
        # Center Star / Sparkle
        star_shape = (abs(nx)**0.5 + abs(ny)**0.5)
        if star_shape < 0.48:
            return (185, 165, 232, 255)
            
        return (255, 249, 243, 255) # Warm cream

if __name__ == '__main__':
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    images_dir = os.path.join(root, 'assets', 'images')
    
    print("Generating MindCanvas visual assets...")
    create_png(512, 512, app_icon_pixel, os.path.join(images_dir, 'app-icon.png'))
    create_png(512, 512, app_icon_pixel, os.path.join(images_dir, 'icon.png'))
    create_png(512, 512, splash_icon_pixel, os.path.join(images_dir, 'splash-icon.png'))
    create_png(512, 512, splash_icon_pixel, os.path.join(images_dir, 'android-icon-foreground.png'))
    print("All assets successfully generated!")
