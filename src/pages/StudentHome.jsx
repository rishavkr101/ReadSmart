import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PdfComp from '../PdfComp';

const StudentHome = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [allFiles, setAllFiles] = useState([]);
  const [learningStarted, setLearningStarted] = useState(false);
  const [singlePdf, setSinglePdf] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [isQuiz, setIsQuiz] = useState(false);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState('');
  const [allPdf, setAllPdf] = useState([]);
  

  useEffect(() => {
    const fetchUserInfo = () => {
      const userinfo = JSON.parse(localStorage.getItem('userinfo'));
      if (userinfo) {
        setUserInfo(userinfo);
        getPdfs(userinfo._id);
        getAllPdf(userinfo._id);
      } else {
        navigate('/');
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const getPdfs = async (userId) => {
    try {
      const result = await axios.get(`http://localhost:8000/student/not-completed/${userId}`);
      setAllFiles(result.data.data);
    } catch (error) {
      console.log('Error fetching PDFs', error);
    }
  };

  const getAllPdf = async (userId) => {
    try {
      const result = await axios.get(`http://localhost:8000/student/get-pdf-all/${userId}`);
      setAllPdf(result.data.data);
    } catch (error) {
      console.log('Error fetching all PDFs', error);
    }
  };

  const startLearning = (e) => {
    e.preventDefault();
    if (allFiles.length > 0) {
      setLearningStarted(true);
      showPdf(allFiles[0]);
      getQuiz(allFiles[0].serial);
    } else {
      console.log('No files to start learning.');
    }
  };

  const getQuiz = async (serial) => {
    try {
      const res = await axios.get(`http://localhost:8000/quiz/get-quiz/${serial}`);
      setQuiz(res.data.data[0]);
    } catch (error) {
      console.log('Error fetching quiz', error);
    }
  };

  const showPdf = (pdf) => {
    setSinglePdf(`http://localhost:8000/files/${pdf.pdf}`);
  };

  const attemptQuiz = (e) => {
    e.preventDefault();
    setIsQuiz(true);
  };

  const handleAnswerChange = (index, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [index]: value
    }));
  };

  const submitQuiz = async (e) => {
    e.preventDefault();
    if (!quiz) return;

    const correctAnswers = quiz.questions.map((ques) => ques.correctAnswer);
    let score = 0;

    for (let i = 0; i < quiz.questions.length; i++) {
      if (answers[i] === correctAnswers[i]) {
        score++;
      }
    }

    const obtained = (score / quiz.questions.length) * 100;
    const threshold = 50;

    if (obtained >= threshold) {
      setFeedback(`Congratulations! You scored ${score} out of ${quiz.questions.length}`);
      await updateQuiz(quiz.serial);
    } else {
      setFeedback(`Sorry, you scored ${score} out of ${quiz.questions.length}. Try again!`);
    }
  };

  const updateQuiz = async (serial) => {
    try {
      await axios.patch(`http://localhost:8000/student/complete-quiz/${userInfo._id}`, {
        serial: serial
      });
    } catch (error) {
      console.log('Error updating quiz', error);
    }
  };

  if (userInfo === null) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <h1 className="text-center">Loading...</h1>
      </div>
    );
  }

 const mainPdfShow=(pdf)=>{
  console.log("clicked", pdf);
  if(pdf?.canAccess){
    setLearningStarted(true)
    setSinglePdf(`http://localhost:8000/files/${pdf.pdf}`);
  }else{
    window.alert("Please complete the quiz to access");
  }
 
 }

  return (
    <div className="max-w-screen max-h-screen overflow-x-hidden">
      <div className="container max-w-[1400px] mx-auto py-10 flex flex-col items-center">
        <h1 className="text-center text-3xl font-bold mb-10">
          Welcome, <span className="text-purple-600">{userInfo?.email}</span>
        </h1>

        {/* PDF Details Section */}
        <div className='w-full relative bg-purple-600 px-10 py-5 rounded-md'>
          <div>
            {allPdf?.map((sPdf, index) => (
              <div key={index} className="mb-2 p-2 bg-white rounded-md" onClick={()=> mainPdfShow(sPdf)}>
                <h1 className='text-black text-lg'>{sPdf.title}</h1>
                <p className='text-gray-700'>PDF Name: {sPdf.pdf}</p>
                <p className={`text-sm ${sPdf.canAccess ? 'text-green-500' : 'text-red-500'}`}>
                  {sPdf.canAccess ? 'You can access this PDF' : 'You cannot access this PDF'}
                </p>
              </div>
            ))}
          </div>

          {/* Not Completed Section */}
          <div className="flex flex-col items-start p-4 w-[300px] bg-purple-300 rounded-md absolute right-0 top-0">
            <h1 className="text-lg font-medium mb-2 text-center w-full">
              Not Completed
            </h1>
            <hr className="w-full h-2" />
            <ul className="flex flex-col ml-4 list-disc">
              {allFiles.length > 0 ? (
                allFiles.map((file, index) => (
                  <li
                    key={index}
                    className="max-w-screen flex items-center mb-2 px-2 w-[200px] rounded-md hover:bg-purple-600 hover:text-white cursor-pointer"
                  >
                    <p className="text-gray-800 hover:text-white">{file.title}</p>
                  </li>
                ))
              ) : (
                <p className="text-gray-800">No files available</p>
              )}
            </ul>
          </div>
        </div>

        <div className="flex items-center gap-5 mt-10">
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-400"
            onClick={startLearning}
          >
            Start Learning
          </button>
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-400"
            onClick={attemptQuiz}
          >
            Attempt Quiz
          </button>
        </div>

        {learningStarted && singlePdf && <PdfComp pdfFile={singlePdf} setLearningStarted={setLearningStarted} attemptQuiz= {attemptQuiz} />}
      </div>

      {isQuiz && quiz && (
        <div className="absolute top-0 left-0 w-[100vw] h-[100vh] overflow-hidden bg-[#000]/40 flex items-center justify-center">
          <div className="container max-w-[600px] bg-white p-6 rounded-md">
            <form onSubmit={submitQuiz}>
              <h1 className="text-black text-center text-xl mb-4">{quiz.title}</h1>
              {quiz.questions.map((ques, index) => (
                <div className="flex flex-col gap-5 mb-4" key={index}>
                  <h1 className="text-xl">
                    Question {index + 1}:{' '}
                    <span className="text-md text-purple-500">
                      {ques.questionText}
                    </span>
                  </h1>
                  <p>Options</p>
                  <div className="flex flex-col gap-2 mb-4">
                    {ques.options.map((opt, i) => (
                      <label key={i} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={opt}
                          onChange={(e) => handleAnswerChange(index, e.target.value)}
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <div className='flex gap-4'>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-400"
                >
                  Submit Answers
                </button>
                <button
                  className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-400'
                  onClick={() => setIsQuiz(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
            {feedback && (
              <div className="mt-4 text-center text-lg">
                <p>{feedback}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentHome
