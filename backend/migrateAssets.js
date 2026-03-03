import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseDir = path.join(__dirname, 'public', 'images', 'products');
const categories = ['equipment', 'protein', 'snacks', 'supplements', 'vitamins'];

const migrate = () => {
    categories.forEach(cat => {
        const dir = path.join(baseDir, cat);
        if (!fs.existsSync(dir)) return;

        const files = fs.readdirSync(dir);
        files.forEach(file => {
            // Matches category_N.png where N is a single digit
            const match = file.match(/^(.+)_(\d)\.png$/);
            if (match) {
                const category = match[1];
                const index = match[2];
                const newName = `${category}_0${index}.png`;

                const oldPath = path.join(dir, file);
                const newPath = path.join(dir, newName);

                console.log(`Renaming: ${file} -> ${newName}`);
                fs.renameSync(oldPath, newPath);
            }
        });
    });
    console.log('Migration complete.');
};

migrate();
