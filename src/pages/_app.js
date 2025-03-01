import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/globals.css";  // Ensure global styles are imported

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* Basic Meta Tags for SEO */}
        <title>EFG Games - Play and Learn Your Way</title>
        <meta
          name="description"
          content="EFG Games offers interactive educational games for all grade levels. Learn math, science, and more while having fun!"
        />
        <meta name="keywords" content="EFG Games, educational games, K-12 learning, math games, science games" />
        <meta name="author" content="EFG Games" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph Meta Tags (For Social Media Sharing) */}
        <meta property="og:title" content="EFG Games - Play and Learn Your Way" />
        <meta
          property="og:description"
          content="EFG Games offers interactive educational games for all grade levels. Learn math, science, and more while having fun!"
        />
        <meta property="og:image" content="/path-to-image.jpg" />
        <meta property="og:url" content="https://www.efggames.com" />
        <meta property="og:type" content="website" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="EFG Games - Play and Learn Your Way" />
        <meta
          name="twitter:description"
          content="EFG Games offers interactive educational games for all grade levels. Learn math, science, and more while having fun!"
        />
        <meta name="twitter:image" content="/EFG_Games.jpg" />

        {/* Favicon and Other Meta Tags */}
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#ffffff" />
      </Head>

      <Header />  {/* Add the header to every page */}
      <Component {...pageProps} />
      <Footer />  {/* Add the footer to every page */}
    </>
  );
}

export default MyApp;
