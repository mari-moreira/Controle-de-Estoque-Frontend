import { useNavigate } from 'react-router-dom'

export default function Header() {
  const navigate = useNavigate()

  return (
    <header className="navbar navbar-dark bg-dark px-4">
      <span
        className="navbar-brand mb-0 h1"
        style={{ cursor: 'pointer' }}
        onClick={() => navigate('/')}>
        🏪 Distribuidora Rocha
      </span>
    </header>
  )
}