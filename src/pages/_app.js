import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/globals.css";  // Ensure global styles are imported

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Header />  {/* Add the header to every page */}
      <Component {...pageProps} />
      <Footer />  {/* Add the footer to every page */}
    </>
  );
}

export default MyApp;
