import React from 'react';
import './App.css';
import AppRouter from './Routes/AppRouter';
import Navbar from './components/navbar';
import Footer from './components/footer';
import Header from './components/header';
import Container from '@mui/material/Container';

function App() {

  return (
      <div className="App">
        <Header />
        <Navbar />
          <Container >
          <main className='App-main'>
            <AppRouter />          
          </main>
          </Container>
        <Footer />
      </div>
  );
}

export default App;