import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './component/Home';
import Login from './component/Login';
import Register from './component/Register';
import Upload from './component/Upload';
import Shop from './component/Shop';
import Detail from './component/Detail';
import Post from './component/Post';
import PostDetail from './component/Postdetail';
import Write from './component/Write';
import Chat from './component/Chat';
import Chatlist from './component/Chatlist';
import Cart from './component/Cart';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/post" element={<Post />} />
        <Route path="/postdetail/:id" element={<PostDetail />} />
        <Route path="/write" element={<Write />} />
        <Route path="/chat" element={<Chat />} />  {/* 기존 채팅 경로 */}
        <Route path="/chats/:username" element={<Chat />} />  {/* 추가된 채팅 경로 */}
        <Route path="/chatlist" element={<Chatlist />} />
        <Route path="/cart" element={<Cart />} />

      </Routes>
    </Router>
  );
};

export default App;
