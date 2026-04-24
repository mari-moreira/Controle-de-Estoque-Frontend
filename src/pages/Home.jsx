import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="container py-5">
      <h1 className="mb-2">🏪 Controle de Estoque</h1>
      <p className="text-muted mb-5">Selecione uma opção abaixo</p>

      <div className="row g-4">

        <div className="col-12 col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center p-4">
              <div style={{ fontSize: '3rem' }}>👤</div>
              <h5 className="card-title mt-3">Cadastro de Cliente</h5>
              <p className="card-text text-muted">Gerenciar clientes do sistema</p>
              <button
                className="btn btn-success w-100 mt-3"
                onClick={() => navigate('/clientes')}>
                Acessar
              </button>
            </div>
          </div>
        </div>

   

   

      </div>
    </div>
  )
}