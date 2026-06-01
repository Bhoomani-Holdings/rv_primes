import React from 'react'
import BasicInfo from './pages/Registration/BasicInfo/BasicInfo'
// import AppRoutes from './routes/AppRoutes'
import AddressInfo from'./pages/Registration/AddressInfo/AddressInfo'
import NomineeInfo from './pages/Registration/NomineeInfo/NomineeInfo'
import   AboutUs from './pages/public/about/AboutUs'
import AppRoutes from './routes/AppRoutes'
import Home from './pages/public/home/Home'

function App() {
  return (
   <>
   {/* <AboutUs/> */}
   <AppRoutes/>
   <Home />
   
   </>
  )
}

export default App