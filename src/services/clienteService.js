let clientesMock = [
  { id: 1, nome: 'Mariana', cpf_cnpj: '000' , telefone: "111", endereco: " Rua A"},
  { id: 2, nome: 'Mari', cpf_cnpj: '001' , telefone: "222", endereco: " Rua B"},
  { id: 3, nome: 'Maria', cpf_cnpj: '002' , telefone: "333", endereco: " Rua C"},
  
]

export const getClientes = async () => {
  return clientesMock
}

export const criarCliente = async (cliente) => {
  const novo = { ...cliente, id: Date.now() }
  clientesMock.push(novo)
  return novo
}

export const atualizarCliente = async (id, cliente) => {
  clientesMock = clientesMock.map(u => u.id === id ? { ...u, ...cliente } : u)
}

export const deletarCliente = async (id) => {
  clientesMock = clientesMock.filter(u => u.id !== id)
}