const API = "http://localhost:8080";

document.getElementById("formFornecedor").addEventListener("submit", function (e) {
    e.preventDefault();

    const nome     = document.getElementById("nome").value.trim();
    const cnpj     = document.getElementById("cnpj").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const endereco = document.getElementById("endereco").value.trim();
    const cidade   = document.getElementById("cidade").value.trim();
    const produtoA = document.getElementById("produtoFornecidoA").value.trim();
    const produtoB = document.getElementById("produtoFornecidoB").value.trim();

    // 1. Campos obrigatórios (produtoB é opcional)
    if (!nome || !cnpj || !telefone || !endereco || !cidade || !produtoA) {
        mostrarMsg("Preencha todos os campos obrigatórios!", "warning");
        return;
    }

    // 2. Validar telefone (só números)
    if (!/^[0-9]+$/.test(telefone)) {
        mostrarMsg("Telefone deve conter somente números!", "danger");
        return;
    }

    // 3. Validar CNPJ (só números)
    if (!/^[0-9]+$/.test(cnpj)) {
        mostrarMsg("CNPJ deve conter somente números!", "danger");
        return;
    }

    const fornecedor = { nome, cnpj, telefone, endereco, cidade, produtoFornecidoA: produtoA, produtoFornecidoB: produtoB };

    // 4. Tenta cadastrar direto — a API rejeita se o CNPJ já existir
    cadastrar(fornecedor);
});

function cadastrar(fornecedor) {
    fetch(`${API}/fornecedores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fornecedor)
    })
        .then(res => {
            if (res.status === 409) {
                mostrarMsg("Já existe um fornecedor com esse CNPJ!", "warning");
                return null;
            }
            if (!res.ok) throw new Error("Erro ao cadastrar");
            return res.json();
        })
        .then(data => {
            if (!data) return;
            mostrarMsg("Fornecedor cadastrado com sucesso!", "success");
            document.getElementById("formFornecedor").reset();
        })
        .catch(() => {
            mostrarMsg("Erro ao cadastrar fornecedor. Verifique se o servidor está rodando.", "danger");
        });
}

function mostrarMsg(texto, tipo) {
    document.getElementById("mensagem").innerHTML =
        `<div class="alert alert-${tipo}">${texto}</div>`;
}