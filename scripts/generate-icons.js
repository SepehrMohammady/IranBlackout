const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const projectRoot = path.join(__dirname, '..');
const inputFile = path.join(projectRoot, 'assets', 'Logo.png');

// Android mipmap sizes
const sizes = [
    { name: 'mipmap-mdpi', size: 48 },
    { name: 'mipmap-hdpi', size: 72 },
    { name: 'mipmap-xhdpi', size: 96 },
    { name: 'mipmap-xxhdpi', size: 144 },
    { name: 'mipmap-xxxhdpi', size: 192 },
];

const baseDir = path.join(projectRoot, 'android', 'app', 'src', 'main', 'res');

async function generateIcons() {
    console.log('Generating Android app icons from Logo.png...');

    for (const { name, size } of sizes) {
        const outputDir = path.join(baseDir, name);

        // Create ic_launcher.png
        await sharp(inputFile)
            .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
            .png()
            .toFile(path.join(outputDir, 'ic_launcher.png'));

        // Create ic_launcher_round.png (same for now)
        await sharp(inputFile)
            .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
            .png()
            .toFile(path.join(outputDir, 'ic_launcher_round.png'));

        console.log(`  ✓ ${name}: ${size}x${size}px`);
    }

    console.log('\nDone! App icons generated.');
}

generateIcons().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
