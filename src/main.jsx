import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { App } from '@capacitor/app';

import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';

import StudentHome from './pages/home/StudentHome.jsx';
import TeacherHome from './pages/home/TeacherHome.jsx';

import CreateCourse from './pages/create/CreateCourse.jsx';
import SubmissionPage from './pages/create/SubmissionPage.jsx';
import ViewSubmissions from './pages/views/ViewSubmissions.jsx';

import AddComment from './pages/create/AddComment.jsx';
import AddStudents from './pages/create/AddStudents.jsx';

import TeacherHomework from './pages/course/TeacherHomework.jsx';
import Homework from './pages/course/Homework.jsx'; 
import Lesson from './pages/course/Lesson.jsx'; 

import StudentCourse from './pages/course/StudentCourse.jsx';
import TeacherCourseView from './pages/course/TeacherCourseView.jsx';

import Leaderboard from './pages/rank/TopRank.jsx';

const BackButtonHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleBackButton = () => {
      if (location.pathname === '/' || location.pathname === '/login') {
        App.exitApp();
      } else {
        navigate(-1);
      }
    };

    const addBackListener = () => {
      App.addListener('backButton', handleBackButton);
    };

    addBackListener();

    return () => {
      App.removeAllListeners();
    };
  }, [navigate, location]);

  return null;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <BackButtonHandler />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/teacher-home" element={<TeacherHome />} />
        <Route path="/student-home" element={<StudentHome />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/course-student/:courseId" element={<StudentCourse />} />
        <Route path="/course-teacher-view/:courseId" element={<TeacherCourseView />} />
        <Route path="/create-course" element={<CreateCourse />} />
        <Route path="/submission/:courseId/:homeworkId" element={<SubmissionPage />} />
        <Route path="/submissionview/:courseId/:homeworkId" element={<ViewSubmissions />} />
        <Route path="/add-comment" element={<AddComment />} />
        <Route path="/add-students" element={<AddStudents />} />
        <Route path="/homework/:courseId" element={<Homework />} />
        <Route path="/lesson/:courseId" element={<Lesson />} />
        <Route path="/homework-teacher/:courseId" element={<TeacherHomework />} />
      </Routes>
    </Router>
  </StrictMode>
);
