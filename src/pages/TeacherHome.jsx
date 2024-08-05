import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { pdfjs } from 'react-pdf';
import PdfComp from '../PdfComp';
import { useNavigate } from 'react-router-dom';
// adding this
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
  ).toString();

const TeacherHome = () => {
  const navigate = useNavigate()
    const [title, setTitle] = useState('');
    const [serial, setSerial] = useState('');
  const [file, setFile] = useState(null);
  const [allFiles, setAllFiles] = useState([]);// in app
  const [pdfFile, setPdfFile] = useState(null);  // Add state for selected PDF
  const [userInfo, setUserInfo] = useState(null);
  // const navigate = useNavigate()

  useEffect(() => {
    if(localStorage.getItem("userinfo")){
      setUserInfo(JSON.parse(localStorage.getItem("userinfo")))
      getPdfs();
    }else{
      navigate("/")
    }
  }, []);
  console.log(userInfo);
  const getPdfs = async () => {
    try {
      const result = await axios.get('http://localhost:8000/teacher/get-files');
      setAllFiles(result.data.data);
    } catch (error) {
      console.log('Error fetching PDFs', error);
    }
  };
  const submitFile = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('serial', serial)
      await axios.post('http://localhost:8000/upload-files', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      getPdfs(); // Refresh the list after uploading
    } catch (error) {
      console.log('Error uploading file', error.message);
    }
  };
  const showPdf = (pdf) => {
    setPdfFile(`http://localhost:8000/files/${pdf}`);
  };

  //create quiz
   const createQuiz = async(file)=>{
    // console.log(file._id);
     const id = file._id
     if(id){
     
      var answer = window.confirm("Want to Create Quiz");
      if (answer) {
        console.log(id);
      navigate(`/teacher-quiz/${id}`)
      }
   
     }
    // try {
    //   const res = await axios.patch(`http://localhost:8000/teacher/patch-pdf?id=${id}`)
    //   console.log(res);
    // } catch (error) {
    //   console.log(error);
    // }
    

   }


  return (
    <div className="flex justify-center items-center h-screen bg-gray-500">
    <div className="w-full max-w-md bg-gray-200 rounded-lg shadow-lg p-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Upload PDF 
      </h2>
      <form onSubmit={submitFile}>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-gray-800 mb-1"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            className="form-input w-full px-4 py-3 rounded-lg bg-gray-300 text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-gray-800 mb-1"
          >
            Serial
          </label>
          <input
            type="number"
            id="title"
            className="form-input w-full px-4 py-3 rounded-lg bg-gray-300 text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter serial number"
            required
            value={serial}
            onChange={(e) => setSerial(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="pdfFile"
            className="block text-sm font-semibold text-gray-800 mb-1"
          >
            PDF File
          </label>
          <input
            type="file"
            id="pdfFile"
            className="form-input w-full px-4 py-3 rounded-lg bg-gray-300 text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            accept=".pdf"
            required
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 focus:outline-none focus:bg-purple-700"
        >
          Upload
        </button>
      </form>

      {/* Display uploaded files */}
      {allFiles.length > 0 && (
        <div className="mt-8 bg-white p-4 rounded-lg shadow-lg">
          <h4 className="text-xl font-bold mb-4 text-center text-gray-800">
            Uploaded PDFs
          </h4>
          {allFiles.map((file, index) => (
            <div key={index} className="flex justify-between items-center mb-2">
              <span className="text-gray-800">{file.title}</span>
              <p>{file.serial}</p>
            <div className='flex gap-3'>
            <button
                onClick={() => showPdf(file.pdf)}  // Assuming the backend returns the file URL in `file.pdf`
                className="bg-purple-600 text-white py-1 px-4 rounded-lg hover:bg-purple-700 focus:outline-none"
              >
                Show PDF
              </button>
             {
              file?.isQuiz ? <button
    
              className="bg-purple-600 text-white py-1 px-4 rounded-lg hover:bg-purple-700 focus:outline-none"
            >
              Created
            </button>: <button
                onClick={()=> createQuiz(file)}  
                className="bg-purple-600 text-white py-1 px-4 rounded-lg hover:bg-purple-700 focus:outline-none"
              >
                Create Quiz
              </button>
             }
            </div>
            </div>
          ))}
        </div>
      )}
    </div>

    
    {pdfFile && <PdfComp pdfFile={pdfFile} />}
  </div>

  )
}

export default TeacherHome
