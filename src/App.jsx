import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import TeacherHome from './pages/TeacherHome'
import Login  from './pages/Login'
import StudentHome from './pages/StudentHome'
import Teacherquiz from './pages/teacher quiz/Teacherquiz'
// import Logout from './components/Navbar'
import Navbar from './components/Navbar'

const App = () => {
  return (
    <Router>
      <Navbar/>
      <Routes>
      <Route path='/' element={<Login/>}/>
        <Route path="/teacher-home" element={<TeacherHome/>}/>
        
        <Route path='/student-home' element={<StudentHome/>}/>
        <Route path='/teacher-quiz/:id' element={<Teacherquiz/>}/>
      </Routes>
    </Router>
  )
}

export default App
