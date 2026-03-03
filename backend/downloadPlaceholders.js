import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const links = [
    "https://m.media-amazon.com/images/I/616i0zIQEvL._AC_UF1000,1000_QL80_.jpg",
    "https://m.media-amazon.com/images/I/71Wn5hNRtAL._AC_UF1000,1000_QL80_.jpg",
    "https://m.media-amazon.com/images/I/71m1xqLiCoL._AC_UF1000,1000_QL80_.jpg",
    "https://m.media-amazon.com/images/I/61aJxbymKVL._AC_UF1000,1000_QL80_.jpg",
    "https://m.media-amazon.com/images/I/71tL3aTGvWL._AC_UF1000,1000_QL80_.jpg",
    "https://m.media-amazon.com/images/I/81hBfPv6QFL._AC_UF1000,1000_QL80_.jpg",
    "https://m.media-amazon.com/images/I/71mE9xMJBQL._AC_UF1000,1000_QL80_.jpg",
    "https://m.media-amazon.com/images/I/61w3iEfxrPL._AC_UF1000,1000_QL80_.jpg",
    "https://m.media-amazon.com/images/I/61r5OGRMNKL._AC_UF1000,1000_QL80_.jpg",
    "https://m.media-amazon.com/images/I/61dqFWTVSFL._AC_UF1000,1000_QL80_.jpg",
    "https://m.media-amazon.com/images/I/71qpRMNH9HL._AC_UF1000,1000_QL80_.jpg",
    "https://m.media-amazon.com/images/I/71QP0NcPg5L._AC_UF1000,1000_QL80_.jpg",
    "https://m.media-amazon.com/images/I/61sOmIdGwpL._AC_UF1000,1000_QL80_.jpg",
    "https://m.media-amazon.com/images/I/81JDh2pjkVL._AC_UF1000,1000_QL80_.jpg",
    "https://m.media-amazon.com/images/I/71gBL0YlTtL._AC_UF1000,1000_QL80_.jpg",
    "https://m.media-amazon.com/images/I/71-YzHOxDzL._AC_UF1000,1000_QL80_.jpg",
    "https://m.media-amazon.com/images/I/71QZ1sJhUsL._AC_UF1000,1000_QL80_.jpg",
    "https://m.media-amazon.com/images/I/71cKP6HuMYL._AC_UF1000,1000_QL80_.jpg",
    "https://m.media-amazon.com/images/I/71s0TlrWKqL._AC_UF1000,1000_QL80_.jpg",
    "https://m.media-amazon.com/images/I/71HkNnQaZRL._AC_UF1000,1000_QL80_.jpg",
    "https://airavatindia.com/cdn/shop/files/FoamRollerHollow33CM_1_800x.jpg",
    "https://airavatindia.com/cdn/shop/files/FoamRollerHollow33CM_Black_800x.jpg",
    "https://airavatindia.com/cdn/shop/files/FoamRollerHollow45CM_Blue_800x.jpg",
    "https://airavatindia.com/cdn/shop/files/FoamRollerSolid45CM_Blue_800x.jpg",
    "https://airavatindia.com/cdn/shop/files/FoamRollerHollow33CM_Purple_800x.jpg",
    "https://assets.moglix.com/p/1_large/msn4k6ze4ew3kq.jpg",
    "https://assets.moglix.com/p/1_large/msnz5268e80m9x.jpg",
    "https://assets.moglix.com/p/1_large/msn39yr6g63l5q.jpg",
    "https://assets.moglix.com/p/1_large/msnpkep1g17d9g.jpg",
    "https://assets.moglix.com/p/1_large/msnl5gl434jyk4.jpg",
    "https://assets.moglix.com/p/1_large/msn4k6ze4ej3kq.jpg",
    "https://assets.moglix.com/p/1_large/msn457m3d3gq9j.jpg",
    "https://www.taurus-fitness.com/media/catalog/product/t/f/tf-asa326-o-1.jpg",
    "https://www.taurus-fitness.com/media/catalog/product/t/f/tf-asa326-b-1.jpg",
    "https://img3.exportersindia.com/product_images/bc-full/2019/7/5694133/foam-roller-for-muscle-massage-1562829043-4895804.jpeg",
    "https://4.imimg.com/data4/SELLER/Default/2022/8/QZ/JZ/LJ/117543093/yoga-foam-roller.jpg",
    "https://5.imimg.com/data5/SELLER/Default/2022/3/DW/VI/SF/3174454/foam-massage-roller.jpg",
    "https://5.imimg.com/data5/SELLER/Default/2022/4/SQ/LF/UF/3174454/gym-foam-roller.jpg",
    "https://5.imimg.com/data5/SELLER/Default/2022/5/AA/BB/CC/3174454/pvc-foam-roller.jpg",
    "https://5.imimg.com/data5/SELLER/Default/2022/6/QQ/WW/EE/3174454/curve-foam-roller.jpg",
    "https://worldfitness.com.au/cdn/shop/products/triggerpoint-grid-2-0-foam-roller-66cm-1.jpg",
    "https://yorkfitness.com.au/wp-content/uploads/2021/03/York-Fitness-Hollow-EVA-Foam-Roller.jpg",
    "https://rollga.com/cdn/shop/products/Rollga_Standard_Hard_Foam_Roller.jpg",
    "https://blackroll.com/cdn/shop/products/BLACKROLL-STANDARD-Foam-Roller-Black.jpg",
    "https://victorsports.com.au/cdn/shop/products/66fit-soft-foam-roller-round-blue.jpg",
    "https://sfhealthtech.com/cdn/shop/products/SF-Healthtech-EVA-Foam-Roller.jpg",
    "https://www.wodarmour.in/cdn/shop/products/Grid-Foam-Roller-Black.jpg",
    "https://jalandharstyle.com/cdn/shop/products/fitness-massage-foam-roller-33cm.jpg",
    "https://quickshel.in/cdn/shop/products/foam-roller-black.jpg",
    "https://www.acmefitness.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/W/1/W1810-90CM-Blue-Foam-Roller.jpg"
];

const baseDir = path.join(__dirname, 'public/images/products');
const categories = ['protein', 'snacks', 'supplements', 'vitamins'];

// Map of missing files based on verified local existence
const missingFiles = [];

// Determine missing files
categories.forEach(cat => {
    for (let i = 1; i <= 10; i++) {
        const padded = String(i).padStart(2, '0');
        const fileName = `${cat}_${padded}.png`;
        const fullPath = path.join(baseDir, cat, fileName);
        if (!fs.existsSync(fullPath)) {
            missingFiles.push({ cat, fileName, fullPath });
        }
    }
});

console.log(`Detected ${missingFiles.length} missing files.`);

missingFiles.forEach((file, index) => {
    if (index >= links.length) return;

    const url = links[index];
    console.log(`Downloading placeholder for ${file.fileName}...`);
    try {
        // Use curl.exe to download the image
        execSync(`curl.exe -L -o "${file.fullPath}" "${url}"`, { stdio: 'inherit' });
    } catch (e) {
        console.error(`Failed to download ${url}: ${e.message}`);
    }
});

console.log('Download complete.');
