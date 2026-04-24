import { useState, useEffect, use } from 'react'
import { useNavigate } from 'react-router-dom'
import ModalCliente from '../components/ModalCliente'
import { getClientes, criarCliente, atualizarCliente, deletarCliente } from '../services/clienteService'

export default function CadastroCliente() {
  const navigate = useNavigate()
  const [clientes, setClientes] = useState([])
  const [busca, setBusca] = useState('')
  const [modalAberto, setModalAberto] = useState(false)
  const [clienteEditando, setClienteEditando] = useState(null)

  useEffect(() => { carregarClientes() }, [])

  const carregarClientes = async () => {
    const dados = await getClientes()
    setClientes(dados)
  }

  const handleSalvar = async (form) => {
    if (clienteEditando) {
      await atualizarCliente(clienteEditando.id, form)
    } else {
      await criarCliente(form)
    }
    setModalAberto(false)
    setClienteEditando(null)
    carregarClientes()
  }

  const handleEditar = (cliente) => {
    setClienteEditando(cliente)
    setModalAberto(true)
  }

  const handleExcluir = async (id) => {
    if (confirm('Deseja realmente excluir este cliente?')) {
      await deletarCliente(id)
      carregarClientes()
    }
  }

  const clientesFiltrados = clientes.filter(u =>
    u.nome.toLowerCase().includes(busca.toLowerCase()) 
  )

    return (
    <div className="container py-4">

      <div className="d-flex align-items-center gap-3 mb-4">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate('/')}>
          ← Voltar
        </button>
        <h2 className="mb-0">Cadastro de Cliente</h2>
      </div>

      <div className="d-flex flex-wrap gap-2 mb-3 align-items-center justify-content-between">
        <button className="btn btn-success"
          onClick={() => { setClienteEditando(null); setModalAberto(true) }}>
          + Cadastrar Novo Cliente
        </button>
        <input
          className="form-control w-auto flex-grow-1"
          style={{ maxWidth: '300px' }}
          placeholder=" 🔍 Pesquisar Cliente"
          value={busca}
          onChange={e => setBusca(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th  style={{ width: '50%' }}>Nome ↓</th>
              <th style={{ width: '50%' }}>Ação</th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.map(u => (
              <tr key={u.id}>
                <td>{u.nome}</td>
                <td>
                  <div className="d-flex gap-2 flex-wrap">
                    <button className="btn btn-primary btn-sm"
                      onClick={() => handleEditar(u)}>
                      ✏️ Alterar
                    </button>
                    <button className="btn btn-danger btn-sm"
                      onClick={() => handleExcluir(u.id)}>
                      🗑️ Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalAberto && (
        <ModalCliente
          clienteEditando={clienteEditando}
          onSalvar={handleSalvar}
          onFechar={() => { setModalAberto(false); setClienteEditando(null) }}
        />
      )}
    </div>
  )
}