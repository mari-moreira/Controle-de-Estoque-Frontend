import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import CadastroCliente from './pages/CadastroCliente'

function App(){
  return (
    <BrowserRouter>
    <Layout>
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/clientes" element={<CadastroCliente />}></Route>
    </Routes>
    </Layout>
    </BrowserRouter>
  )
}

export default App