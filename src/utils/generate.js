import { v4 as uuidv4 } from 'uuid';

export function generateFileName(fileName) {
    const extension = fileName.split(".").slice(-1);
    return `${uuidv4()}.${extension}`
}