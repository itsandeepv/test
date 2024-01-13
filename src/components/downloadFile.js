export const downloadImage = (base64Data, fileName) => {
    const byteCharacters = atob(base64Data.split('base64,')[1]);
    const byteArrays = [];

    for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays.push(byteCharacters.charCodeAt(i));
    }

    const byteArray = new Uint8Array(byteArrays);
    const blob = base64Data.split('base64,')[0] === "data:image/png;" ? new Blob([byteArray], { type: 'image/png' }) : base64Data.split('base64,')[0] === "data:application/pdf;" ? new Blob([byteArray], { type: 'application/pdf' }) : ""
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
};
