const fs = require('fs');
const https = require('https');
const path = require('path');

const animations = [
  {
    name: 'sunny',
    url: 'https://assets9.lottiefiles.com/packages/lf20_2cwDXD.json'
  },
  {
    name: 'cloudy',
    url: 'https://assets5.lottiefiles.com/packages/lf20_2cwDXD.json'
  },
  {
    name: 'rainy',
    url: 'https://assets3.lottiefiles.com/packages/lf20_2cwDXD.json'
  },
  {
    name: 'stormy',
    url: 'https://assets4.lottiefiles.com/packages/lf20_2cwDXD.json'
  },
  {
    name: 'snowy',
    url: 'https://assets6.lottiefiles.com/packages/lf20_2cwDXD.json'
  },
  {
    name: 'misty',
    url: 'https://assets7.lottiefiles.com/packages/lf20_2cwDXD.json'
  }
];

const downloadAnimation = (url, filename) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${filename}`));
        return;
      }

      const file = fs.createWriteStream(path.join(__dirname, 'weather', filename));
      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filename, () => {});
      reject(err);
    });
  });
};

const downloadAllAnimations = async () => {
  // Create weather directory if it doesn't exist
  const weatherDir = path.join(__dirname, 'weather');
  if (!fs.existsSync(weatherDir)) {
    fs.mkdirSync(weatherDir, { recursive: true });
  }

  for (const animation of animations) {
    try {
      await downloadAnimation(animation.url, `${animation.name}.json`);
    } catch (error) {
      console.error(`Error downloading ${animation.name}:`, error);
    }
  }
};

downloadAllAnimations(); 