import React, { useEffect, useState } from 'react';
import { baseURL } from '../variables';
import axios from 'axios';
import Dropzone from 'react-dropzone';

const App = () => {
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [data, setData] = useState([]);
  const [isUploading, setIsUploading] = useState(false); // Track upload status
  const [fileName, setFileName] = useState(''); // Track file name
  const [expandedImage, setExpandedImage] = useState(null); // Track the expanded image

  // Handle form submission for image upload
  const imageUpload = async (e) => {
    e.preventDefault();

    if (!image) {
      setMessage('Please select an image to upload.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await axios.post(`${baseURL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      setMessage(response.data.message || 'Image uploaded successfully!');
      setImage(null);
      setFileName('');
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Fetch images from the server
  const getImages = async () => {
    try {
      const response = await axios.get(`${baseURL}/getImage`, {
        withCredentials: true,
      });
      setData(response.data.Images || []);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  // Call getImages after upload completes
  const handleSubmit = async (e) => {
    await imageUpload(e);
    await getImages();
  };

  useEffect(() => {
    getImages();
  }, []);

  const toggleImageExpand = (image) => {
    setExpandedImage(expandedImage === image ? null : image); // Toggle expanded image
  };

  return (
    <div className="flex flex-col p-5 items-center bg-[#bceff4]">
      {!expandedImage && (
        <>
          <div className="flex flex-col gap-6 items-center sm:flex-row sm:gap-12 font-chakra">
            <div className="flex items-center gap-2">
              <img src="/Icon.png" className="h-12" alt="" />
              <h1 className="text-4xl text-center font-bold">Image Gallery</h1>
            </div>

            <Dropzone
              onDrop={(acceptedFiles) => {
                if (acceptedFiles.length > 1) {
                  setMessage('Please upload only one file at a time.');
                  setImage(null);
                  setFileName('');
                  return;
                }

                if (acceptedFiles.length === 1) {
                  setImage(acceptedFiles[0]);
                  setFileName(acceptedFiles[0].name);
                  setMessage('');
                } else {
                  setMessage('No file selected. Please try again.');
                }
              }}
              multiple={false}
            >
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div
                    {...getRootProps()}
                    className="border-4 border-dashed rounded p-10 border-black cursor-pointer"
                  >
                    <input {...getInputProps()} disabled={isUploading} />
                    <p>
                      {fileName
                        ? `Selected file: ${fileName}`
                        : "Drag 'n' drop a file here, or click to select files"}
                    </p>
                  </div>
                </section>
              )}
            </Dropzone>

            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-gray-800 text-white p-4 rounded-md hover:font-bold"
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </>
      )}
      <div
        id="image-container"
        className={`flex flex-wrap justify-center mt-2 ${expandedImage ? 'hidden' : ''
          }`}
      >
        {data &&
          data.map((img, index) => (
            <div
              key={index}
              className="flex flex-col justify-center items-center sm:m-4 m-[1px] cursor-pointer"
              onClick={() => toggleImageExpand(img.image)}
            >
              <img
                src={img.image}
                alt="Uploaded"
                className="h-20 w-20 sm:h-64 sm:w-72 object-cover rounded-md border border-blue-900"
                id={img._id}
              />
            </div>
          ))}
      </div>
      {expandedImage && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex justify-center items-center z-50"
          onClick={() => toggleImageExpand(null)}
        >
          <img
            src={expandedImage}
            alt="Expanded"
            className="max-w-full max-h-full"
          />
        </div>
      )}
      {message && <p className="mt-4 text-lg">{message}</p>}
    </div>
  );
};

export default App;
