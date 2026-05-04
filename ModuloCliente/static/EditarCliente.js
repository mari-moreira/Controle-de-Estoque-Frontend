let clienteAtual = null;

// 🔍 Buscar cliente
function buscar() {
    const id = document.getElementById("idBusca").value;

    if (!id) {
        mostrarMsg("Informe um ID", "warning");
        return;
    }

    fetch(`http://localhost:8080/clientes/${id}`)
    .then(res => {
        if (!res.ok) throw new Error("Cliente não encontrado");
        return res.json();
    })
    .then(c => {
        clienteAtual = c;

        // Preenche campos
        nome.value = c.nome;
        cpf.value = c.cpf;
        telefone.value = c.telefone;
        endereco.value = c.endereco;

        // Mostra formulário
        document.getElementById("formContainer").style.display = "block";

        mostrarMsg("Cliente encontrado", "success");
    })
    .catch(err => {
        clienteAtual = null;

        // Esconde formulário se erro
        document.getElementById("formContainer").style.display = "none";

        mostrarMsg(err.message, "danger");
    });
}

// ✏️ Atualizar
document.getElementById("form").addEventListener("submit", function(e) {
    e.preventDefault();

    if (!clienteAtual) {
        mostrarMsg("Busque um cliente primeiro!", "warning");
        return;
    }

    const cliente = {
        nome: nome.value,
        cpf: cpf.value,
        telefone: telefone.value,
        endereco: endereco.value
    };

    fetch(`http://localhost:8080/clientes/${clienteAtual.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cliente)
    })
    .then(res => {
        if (!res.ok) throw new Error("Erro ao atualizar");
        return res.json();
    })
    .then(() => {
        mostrarMsg("Atualizado com sucesso!", "success");
    })
    .catch(err => {
        mostrarMsg(err.message, "danger");
    });
});

// 💬 Mensagens
function mostrarMsg(texto, tipo) {
    document.getElementById("msg").innerHTML =
        `<div class="alert alert-${tipo}">${texto}</div>`;
}