export const validarCPF = (cpf) => {
  const numeros = cpf.replace(/\D/g, '')
  if (numeros.length !== 11) return false
  if (/^(\d)\1+$/.test(numeros)) return false

  let soma = 0
  for (let i = 0; i < 9; i++) soma += parseInt(numeros[i]) * (10 - i)
  let primeiro = (soma * 10) % 11
  if (primeiro === 10 || primeiro === 11) primeiro = 0
  if (primeiro !== parseInt(numeros[9])) return false

  soma = 0
  for (let i = 0; i < 10; i++) soma += parseInt(numeros[i]) * (11 - i)
  let segundo = (soma * 10) % 11
  if (segundo === 10 || segundo === 11) segundo = 0
  return segundo === parseInt(numeros[10])
}

export const validarCNPJ = (cnpj) => {
  const numeros = cnpj.replace(/\D/g, '')
  if (numeros.length !== 14) return false
  if (/^(\d)\1+$/.test(numeros)) return false

  const calcular = (nums, tamanho) => {
    let soma = 0
    let pos = tamanho - 7
    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(nums[tamanho - i]) * pos--
      if (pos < 2) pos = 9
    }
    return soma % 11 < 2 ? 0 : 11 - (soma % 11)
  }

  const primeiro = calcular(numeros, 12)
  if (primeiro !== parseInt(numeros[12])) return false
  const segundo = calcular(numeros, 13)
  return segundo === parseInt(numeros[13])
}

export const validarTelefone = (telefone) => {
  const numeros = telefone.replace(/\D/g, '')
  return numeros.length === 10 || numeros.length === 11
}