export const getCanvas = (base64) => {
    return new Promise(resolve => {
        const image = new Image();
        image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(image, 0, 0);
            resolve(canvas);
        };
        image.src = base64;
    });
};
//# sourceMappingURL=canvas.js.map