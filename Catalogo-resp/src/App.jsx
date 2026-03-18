import './App.css'
import Header from "./components/Header/Header";
import Banner from "./components/Banner/Banner";
import Features from "./components/Features";
import Footer from './components/Footer/Footer';
export default function App() {
  return (
    <div className="page">
      <Header />
      <main className="container">
        <Banner />
        <Features />
      </main>
      <Footer />
    </div>
  );
}