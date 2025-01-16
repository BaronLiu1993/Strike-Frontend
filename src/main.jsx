import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import Register2 from './pages/auth/Register2.jsx';

import StudentHome from './pages/home/StudentHome.jsx';
import TeacherHome from './pages/home/TeacherHome.jsx';

import CreateCourse from './pages/create/CreateCourse.jsx';
import SubmissionPage from './pages/create/SubmissionPage.jsx';
import ViewSubmissions from './pages/views/ViewSubmissions.jsx'

import AddComment from './pages/create/AddComment.jsx';
import AddStudents from './pages/create/AddStudents.jsx';

import StudentCourse from './pages/course/StudentCourse.jsx';
import TeacherCourse from './pages/course/TeacherCourse.jsx';
import TeacherCourseView from './pages/course/TeacherCourseView.jsx';

import Homework from './pages/views/Homework.jsx'
import Leaderboard from './pages/rank/TopRank.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/teacher-home" element={<TeacherHome />} />
        <Route path="/student-home" element = {<StudentHome />} />
        <Route path="/leaderboard" element = {<Leaderboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register2" element={<Register2 />} />
        <Route path="/course-teacher/:courseId" element={<TeacherCourse />} />
        <Route path="/course-student/:courseId" element={<StudentCourse />} />
        <Route path="/course-teacher-view/:courseId" element = {<TeacherCourseView />} />
        <Route path="/course-student/:courseId/:homeworkId" element={<Homework />} />
        <Route path="/create-course" element={<CreateCourse />} />
        <Route path="/submission/:courseId/:homeworkId" element={<SubmissionPage />} />
        <Route path="/submissionview/:courseId/:homeworkId" element={<ViewSubmissions />} />
        <Route path="/add-comment" element={<AddComment />} />
        <Route path="/add-students" element={<AddStudents />} />
      </Routes>
    </Router>
  </StrictMode>
);
