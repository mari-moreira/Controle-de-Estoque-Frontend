let clienteAtual = null;

// 🔍 Buscar cliente
function buscar() {
    const id = document.getElementById("id").value;

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

        document.getElementById("info").innerHTML = `
            <div class="alert alert-secondary">
                <b>${c.nome}</b><br>
                CPF: ${c.cpf}
            </div>
        `;

        mostrarMsg("", ""); // limpa msg
    })
    .catch(err => {
        clienteAtual = null;
        document.getElementById("info").innerHTML = "";
        mostrarMsg(err.message, "danger");
    });
}

// 🗑️ Excluir cliente
function excluir() {
    if (!clienteAtual) {
        mostrarMsg("Busque um cliente primeiro!", "warning");
        return;
    }

    if (!confirm("Tem certeza que deseja excluir?")) return;

    fetch(`http://localhost:8080/clientes/${clienteAtual.id}`, {
        method: "DELETE"
    })
    .then(res => {
        if (!res.ok) throw new Error("Erro ao excluir");

        mostrarMsg("Excluído com sucesso!", "success");
        document.getElementById("info").innerHTML = "";
        clienteAtual = null;
    })
    .catch(() => {
        mostrarMsg("Erro ao excluir", "danger");
    });
}

// 💬 Mensagens padrão
function mostrarMsg(texto, tipo) {
    if (!texto) {
        document.getElementById("msg").innerHTML = "";
        return;
    }

    document.getElementById("msg").innerHTML =
        `<div class="alert alert-${tipo}">${texto}</div>`;
}