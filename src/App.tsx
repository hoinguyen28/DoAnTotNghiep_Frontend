import React from 'react';
import logo from './logo.svg';
import './App.css';

import { getAllImageByArt } from "./api/ImageApi";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
    
  );
}
async function testGetAllImageByArt(idArt: number): Promise<void> {
  try {
    // Gọi hàm getAllImageByArt và chờ kết quả
    const images = await getAllImageByArt(idArt);
    
    // Hiển thị kết quả ra cửa sổ console
    console.log('Images:', images);
  } catch (error) {
    console.error('Error fetching images:', error);
  }
}

// Gọi hàm testGetAllImageByArt với idArt là 1 (hoặc bất kỳ idArt nào bạn muốn thử)
testGetAllImageByArt(1);
export default App;
