import imageCompression from "browser-image-compression";

const compressImage = async (file: File) => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
    maxIteration: 10,
    quality: 0.8,
    useBlob: true,
  };

  try {
    if (!file || !file.type.startsWith("image/")) {
      return "The provided file is not a valid image.";
    }

    const img = new Image();
    const imgUrl = URL.createObjectURL(file);

    const imgLoaded = new Promise<HTMLImageElement>((resolve, reject) => {
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
      img.src = imgUrl;
    });

    const image = await imgLoaded;

    const aspectRatio = image.width / image.height;
    const maxSize = options.maxWidthOrHeight;

    let newWidth = maxSize;
    let newHeight = Math.round(maxSize / aspectRatio);

    if (newHeight > maxSize) {
      newHeight = maxSize;
      newWidth = Math.round(maxSize * aspectRatio);
    }

    options.maxWidthOrHeight = newWidth > newHeight ? newWidth : newHeight;

    const compressedFile = await imageCompression(file, options);

    return compressedFile;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return "Compression process was aborted.";
    } else {
      return "An unknown error occurred during compression.";
    }
  }
};

export default compressImage;
