import { storage } from "@/lib/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { toast } from "sonner";

export const handleUploadImage = async (file: Blob): Promise<string> => {
  if (!file || !(file instanceof Blob)) {
    return "Invalid file provided. Please upload a valid image file.";
  }

  try {
    const fileName = `image_${new Date().getTime()}_${Math.floor(
      Math.random() * 1000
    )}.jpg`;
    const storageRef = ref(storage, `images/${fileName}`);

    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (error: any) {
    toast.error("Failed to upload file. Please try again.", error.message);
    return "";
  }
};
