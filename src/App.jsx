import { useState } from 'react'
import NavBar from './components/NavBar'
import FittsTest1 from './components/FittsTest1'
import FittsTest2 from './components/FittsTest2'

function App() {
  const [activeTab, setActiveTab] = useState('cube')

  return (
    <>
      <NavBar activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'cube' && <FittsTest1 />}
      {activeTab === 'fitts' && <FittsTest2 />}
    </>
  )
}

export default App
