const API = "http://localhost:8080";

document.getElementById("formCliente").addEventListener("submit", function (e) {
    e.preventDefault();

    const nome     = document.getElementById("nome").value.trim();
    const cpf      = document.getElementById("cpf").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const endereco = document.getElementById("endereco").value.trim();

    // 1. Campos obrigatórios
    if (!nome || !cpf || !telefone || !endereco) {
        mostrarMsg("Preencha todos os campos obrigatórios!", "warning");
        return;
    }

    // 2. Validar telefone (só números)
    if (!/^[0-9]+$/.test(telefone)) {
        mostrarMsg("Telefone deve conter somente números!", "danger");
        return;
    }

    // 3. Validar CPF (só números)
    if (!/^[0-9]+$/.test(cpf)) {
        mostrarMsg("CPF deve conter somente números!", "danger");
        return;
    }

    const cliente = { nome, cpf, telefone, endereco };

    // 4. Tenta cadastrar direto — a API rejeita se o CPF já existir (conflito)
    cadastrar(cliente);
});

function cadastrar(cliente) {
    fetch(`${API}/clientes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cliente)
    })
        .then(res => {
            if (res.status === 409) {
                mostrarMsg("Já existe um cliente com esse CPF!", "warning");
                return null;
            }
            if (!res.ok) throw new Error("Erro ao cadastrar");
            return res.json();
        })
        .then(data => {
            if (!data) return;
            mostrarMsg("Cliente cadastrado com sucesso!", "success");
            document.getElementById("formCliente").reset();
        })
        .catch(() => {
            mostrarMsg("Erro ao cadastrar cliente. Verifique se o servidor está rodando.", "danger");
        });
}

function mostrarMsg(texto, tipo) {
    document.getElementById("mensagem").innerHTML =
        `<div class="alert alert-${tipo}">${texto}</div>`;
}