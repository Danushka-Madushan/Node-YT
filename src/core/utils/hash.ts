import crypto from 'crypto'

export const generateMD5 = (inputString: string) => {
    try {
        const hash = crypto.createHash('md5').update(inputString).digest('hex');
        return hash;
    } catch (e) {
        return false
    }
}
