import { useState, useEffect } from 'react'
import { validarCPF, validarCNPJ, validarTelefone } from '../utils/validacoes'

export default function ModalCliente({ clienteEditando, onSalvar, onFechar }) {
  const [form, setForm] = useState({
    nome: '', cpf_cnpj: '', telefone: '', endereco: ''
  })
  const [erros, setErros] = useState({})

  useEffect(() => {
    if (clienteEditando) setForm(clienteEditando)
    else setForm({ nome: '', cpf_cnpj: '', telefone: '', endereco: '' })
    setErros({})
  }, [clienteEditando])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErros({ ...erros, [e.target.name]: '' })
  }

  const validar = () => {
    const novosErros = {}

    if (!form.nome.trim())
      novosErros.nome = 'Nome é obrigatório'

    if (!form.cpf_cnpj.trim()) {
      novosErros.cpf_cnpj = 'CPF/CNPJ é obrigatório'
    } else {
      const numeros = form.cpf_cnpj.replace(/\D/g, '')
      if (numeros.length === 11 && !validarCPF(form.cpf_cnpj))
        novosErros.cpf_cnpj = 'CPF inválido. Ex: 000.000.000-00'
      else if (numeros.length === 14 && !validarCNPJ(form.cpf_cnpj))
        novosErros.cpf_cnpj = 'CNPJ inválido. Ex: 00.000.000/0001-00'
      else if (numeros.length !== 11 && numeros.length !== 14)
        novosErros.cpf_cnpj = 'Digite um CPF ou CNPJ válido'
    }

    if (!form.telefone.trim())
      novosErros.telefone = 'Telefone é obrigatório'
    else if (!validarTelefone(form.telefone))
      novosErros.telefone = 'Telefone inválido. Ex: (99) 99999-9999'

    if (!form.endereco.trim())
      novosErros.endereco = 'Endereço é obrigatório'

    setErros(novosErros)
    return Object.keys(novosErros).length === 0
  }

  const handleSalvar = () => {
    if (validar()) onSalvar(form)
  }

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">
              {clienteEditando ? 'Alterar Cliente' : 'Novo Cliente'}
            </h5>
            <button className="btn-close" onClick={onFechar} />
          </div>

          <div className="modal-body">

            <div className="mb-3">
              <label className="form-label">Nome <span className="text-danger">*</span></label>
              <input
                className={`form-control ${erros.nome ? 'is-invalid' : ''}`}
                name="nome" value={form.nome}
                onChange={handleChange} placeholder="Digite o nome" />
              {erros.nome && <div className="invalid-feedback">{erros.nome}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">CPF/CNPJ <span className="text-danger">*</span></label>
              <input
                className={`form-control ${erros.cpf_cnpj ? 'is-invalid' : ''}`}
                name="cpf_cnpj" value={form.cpf_cnpj}
                onChange={handleChange} placeholder="000.000.000-00 ou 00.000.000/0001-00" />
              {erros.cpf_cnpj && <div className="invalid-feedback">{erros.cpf_cnpj}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Telefone <span className="text-danger">*</span></label>
              <input
                className={`form-control ${erros.telefone ? 'is-invalid' : ''}`}
                name="telefone" value={form.telefone}
                onChange={handleChange} placeholder="(99) 99999-9999" />
              {erros.telefone && <div className="invalid-feedback">{erros.telefone}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Endereço <span className="text-danger">*</span></label>
              <input
                className={`form-control ${erros.endereco ? 'is-invalid' : ''}`}
                name="endereco" value={form.endereco}
                onChange={handleChange} placeholder="Digite o endereço" />
              {erros.endereco && <div className="invalid-feedback">{erros.endereco}</div>}
            </div>

            <small className="text-muted">
              <span className="text-danger">*</span> Campos obrigatórios
            </small>

          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onFechar}>Cancelar</button>
            <button className="btn btn-success" onClick={handleSalvar}>Salvar</button>
          </div>

        </div>
      </div>
    </div>
  )
}