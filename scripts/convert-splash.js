const sharp = require('sharp');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const inputFile = path.join(projectRoot, 'assets', 'Splash Screen.jpg');
const outputFile = path.join(projectRoot, 'assets', 'splash_screen.png');

async function convertSplash() {
    console.log('Converting Splash Screen.jpg to PNG...');

    await sharp(inputFile)
        .png()
        .toFile(outputFile);

    console.log('Done! Saved as:', outputFile);
}

convertSplash().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
