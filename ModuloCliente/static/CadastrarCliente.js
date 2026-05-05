document.getElementById("formCliente").addEventListener("submit", function(e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const cpf = document.getElementById("cpf").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const endereco = document.getElementById("endereco").value.trim();

    // 🔴 1. Campos obrigatórios
    if (!nome || !cpf || !telefone || !endereco) {
        mostrarMsg("Preencha todos os campos obrigatórios!", "warning");
        return;
    }

    // 🔴 2. Validar telefone (só números)
    const telefoneValido = /^[0-9]+$/.test(telefone);
    if (!telefoneValido) {
        mostrarMsg("Caracteres inválidos no telefone!", "danger");
        return;
    }

    // 🔴 3. Validar CPF/CNPJ (só números)
    const cpfValido = /^[0-9]+$/.test(cpf);
    if (!cpfValido) {
        mostrarMsg("Caracteres inválidos no CPF/CNPJ!", "danger");
        return;
    }

    const cliente = { nome, cpf, telefone, endereco };

    // 🔎 4. Verificar duplicado (simples)
    fetch("http://localhost:8080/clientes")
    .then(res => res.json())
    .then(lista => {

        const existe = lista.some(c => c.cpf === cpf);

        if (existe) {
            mostrarMsg("Já existe um cliente com esse CPF!", "warning");
            return;
        }

        // ✅ 5. Cadastrar
        fetch("http://localhost:8080/clientes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cliente)
        })
        .then(res => {
            if (!res.ok) throw new Error("Erro ao cadastrar");
            return res.json();
        })
        .then(() => {
            mostrarMsg("Cliente registrado com sucesso!", "success");
            document.getElementById("formCliente").reset();
        })
        .catch(() => {
            mostrarMsg("Erro ao cadastrar", "danger");
        });

    });
});

// 💬 Função de mensagem padrão
function mostrarMsg(texto, tipo) {
    document.getElementById("mensagem").innerHTML =
        `<div class="alert alert-${tipo}">${texto}</div>`;
}