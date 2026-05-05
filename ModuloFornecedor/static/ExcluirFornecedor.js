let fornecedorAtual = null;

// 🔍 Buscar
function buscar() {
    const id = document.getElementById("id").value;

    if (!id) {
        mostrarMsg("Informe um ID", "warning");
        return;
    }

    fetch(`http://localhost:8080/fornecedores/${id}`)
    .then(res => {
        if (!res.ok) throw new Error("Fornecedor não encontrado");
        return res.json();
    })
    .then(f => {
        fornecedorAtual = f;

        document.getElementById("info").innerHTML = `
            <div class="alert alert-secondary">
                <b>${f.nome}</b> - ${f.cnpj}
            </div>
        `;

        mostrarMsg("Fornecedor carregado", "success");
    })
    .catch(err => {
        fornecedorAtual = null;
        document.getElementById("info").innerHTML = "";
        mostrarMsg(err.message, "danger");
    });
}

// Excluir
function excluir() {
    if (!fornecedorAtual) {
        mostrarMsg("Busque um fornecedor primeiro!", "warning");
        return;
    }

    const confirmar = confirm("Tem certeza que deseja excluir este fornecedor?");

    if (!confirmar) return;

    fetch(`http://localhost:8080/fornecedores/${fornecedorAtual.id}`, {
        method: "DELETE"
    })
    .then(() => {
        mostrarMsg("Excluído com sucesso!", "success");
        document.getElementById("info").innerHTML = "";
        fornecedorAtual = null;
    })
    .catch(() => {
        mostrarMsg("Erro ao excluir", "danger");
    });
}

//  Mensagens
function mostrarMsg(texto, tipo) {
    document.getElementById("msg").innerHTML =
        `<div class="alert alert-${tipo}">${texto}</div>`;
}