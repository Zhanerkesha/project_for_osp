// Ewha Market - Shared Cloudinary for photo upload and saving
// Owner: Zhansaya 

// Uploads a photo to Cloudinary (free image hosting) and gives
// back a link to it. Save that link in Firestore, and use it as
// the <img src> on item cards.
//
// Usage in any page:
//   import { uploadImage } from "./cloudinary.js";
//   const url = await uploadImage(fileInput.files[0]);
//
// Photos are NOT stored in Firebase. Firestore keeps only the URL.


const CLOUD_NAME = "gurwgfny";
const UPLOAD_PRESET = "ewha-market-unsigned";

// Input:  `file` = an image chosen by the user (from <input type="file">)
// Output: a string, the https link to the uploaded image
export async function uploadImage(file){
    // Package the photo and the preset name as form data
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    
    // Send it to Cloudinary
    const response = await fetch(`https://api.cloudinary.com/v1_1/gurwgfny/image/upload`, {method: "POST", body: formData});

    // If rejected (wrong preset, file too big, etc)
    if(!response.ok) throw new Error("response error");

    // Cloudinary relies with details about the image
    const data = await response.json();

    // The public link to the photo
    return data.secure_url;
};

// for those who will use uploadImage function to secure it
// submitBtn.addEventListener("click", async () => {
//     const file = photoInput.files[0];

//     try {
//         const url = await uploadImage(file);
//         // save url + title + price in Firestore here
//     } catch (err) {
//         console.error(err);
//         alert("Photo upload failed. Please try again.");
//     }
// });