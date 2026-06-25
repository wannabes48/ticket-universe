const fs = require('fs');
const path = require('path');

async function main() {
  const publicDir = path.join(__dirname, '../public');
  const brandingDir = path.join(publicDir, 'branding');
  if (!fs.existsSync(brandingDir)) fs.mkdirSync(brandingDir, { recursive: true });

  const iconPath = path.join(publicDir, 'ticket-icon.png');
  const iconBase64 = fs.readFileSync(iconPath).toString('base64');
  const iconDataUrl = `data:image/png;base64,${iconBase64}`;

  // Font: Bricolage Grotesque. We'll use a standard sans-serif fallback in the SVG since the font might not be installed on the system rendering it, but for sharp it's fine.
  // We'll use SVG for master.
  
  // 1. Horizontal Logo (Aspect Ratio 4:1)
  // Let's say width 2000, height 500.
  // Icon left, text right.
  const horizontalSvg = `
  <svg width="2000" height="500" viewBox="0 0 2000 500" xmlns="http://www.w3.org/2000/svg">
    <image href="${iconDataUrl}" x="100" y="50" width="400" height="400" />
    <text x="600" y="320" font-family="Bricolage Grotesque, system-ui, sans-serif" font-size="280" font-weight="800" fill="#ffffff" letter-spacing="-0.02em">TicketUniverse</text>
  </svg>`;

  // 2. Icon Only (Square)
  // Let's say width 1024, height 1024
  const iconSvg = `
  <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
    <image href="${iconDataUrl}" x="112" y="112" width="800" height="800" />
  </svg>`;

  // 3. Stacked Version (Aspect Ratio ~1:1 or 4:3)
  // Let's say width 2000, height 2000
  const stackedSvg = `
  <svg width="2000" height="2000" viewBox="0 0 2000 2000" xmlns="http://www.w3.org/2000/svg">
    <image href="${iconDataUrl}" x="600" y="300" width="800" height="800" />
    <text x="1000" y="1400" font-family="Bricolage Grotesque, system-ui, sans-serif" font-size="280" font-weight="800" fill="#ffffff" letter-spacing="-0.02em" text-anchor="middle">TicketUniverse</text>
  </svg>`;

  fs.writeFileSync(path.join(brandingDir, 'logo-horizontal.svg'), horizontalSvg.trim());
  fs.writeFileSync(path.join(brandingDir, 'logo-icon.svg'), iconSvg.trim());
  fs.writeFileSync(path.join(brandingDir, 'logo-stacked.svg'), stackedSvg.trim());

  console.log('All branding SVGs generated successfully.');
}

main().catch(console.error);
