import React from 'react'
import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer"

function MainLayout({children}) {
  return (
    <>
        <Header/>
        <div className="container mt-5 pt-5">{children}</div>
        <Footer/>
    </>
  )
}

export default MainLayout