import Fs from 'fs';
import Path from 'path';

export function writeFile (fileName, buffer) {
    const writer = Fs.createWriteStream(Path.join(process.cwd(), 'uploads', fileName), {
        flags: "w",
        encoding: "utf-8"
    })
    writer.write(buffer);
}