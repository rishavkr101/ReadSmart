import { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function TeacherQuiz() {
  const [title, setTitle] = useState('');
  const {id} = useParams()
  console.log("da",id);
  const [questions, setQuestions] = useState([{ questionText: '', options: [''], correctAnswer: '' }]);

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[optIndex] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { questionText: '', options: [''], correctAnswer: '' }]);
  };

  const addOption = (index) => {
    const newQuestions = [...questions];
    newQuestions[index].options.push('');
    setQuestions(newQuestions);
  };

  const removeOption = (qIndex, optIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.splice(optIndex, 1);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if(!id){
        alert("something went")
        return;
      }
      
      const res = await axios.post(`http://localhost:8000/quiz/teacher-quiz/${id}`, { title, questions });
      console.log("dadadad",res.data);
      if(res.data.sucess){
        const res1 = await axios.patch(`http://localhost:8000/teacher/patch-pdf?id=${id}`) 
        alert('Quiz created successfully');
      }
      
      
      setTitle('');
      setQuestions([{ questionText: '', options: [''], correctAnswer: '' }]);
      // console.log(res);
    } catch (error) {
      alert('Error creating quiz');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Create Quiz</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Quiz Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-2 border rounded w-full"
            required
          />
        </div>
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="border p-4 rounded">
            <h2 className="text-xl mb-2">Question {qIndex + 1}</h2>
            <label className="block mb-2">Question Text</label>
            <input
              type="text"
              value={q.questionText}
              onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
              className="p-2 border rounded w-full mb-2"
              required
            />
            <div className="mb-2">
              <label className="block mb-2">Options</label>
              {q.options.map((opt, optIndex) => (
                <div key={optIndex} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                    className="p-2 border rounded w-full"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(qIndex, optIndex)}
                    className="ml-2 p-2 bg-red-500 text-white rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addOption(qIndex)}
                className="p-2 bg-blue-500 text-white rounded"
              >
                Add Option
              </button>
            </div>
            <div>
              <label className="block mb-2">Correct Answer</label>
              <input
                type="text"
                value={q.correctAnswer}
                onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)}
                className="p-2 border rounded w-full"
                required
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addQuestion}
          className="p-2 bg-green-500 text-white rounded"
        >
          Add Question
        </button>
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded"
        >
          Create Quiz
        </button>
      </form>
    </div>
  );
}

export default TeacherQuiz;
