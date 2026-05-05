let fornecedorAtual = null;

// 🔍 Buscar fornecedor
function buscar() {
    const id = document.getElementById("idBusca").value;

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

        nome.value = f.nome;
        cnpj.value = f.cnpj;
        telefone.value = f.telefone;
        endereco.value = f.endereco;
        cidade.value = f.cidade;
        produtoFornecidoA.value = f.produtoFornecidoA;
        produtoFornecidoB.value = f.produtoFornecidoB;

        document.getElementById("formContainer").style.display = "block";

        mostrarMsg("Fornecedor carregado", "success");
    })
    .catch(err => {
        fornecedorAtual = null;
        document.getElementById("formContainer").style.display = "none";
        mostrarMsg(err.message, "danger");
    });
}

// ✏️ Atualizar
document.getElementById("form").addEventListener("submit", function(e) {
    e.preventDefault();

    if (!fornecedorAtual) {
        mostrarMsg("Busque um fornecedor primeiro!", "warning");
        return;
    }

    const fornecedor = {
        nome: nome.value,
        cnpj: cnpj.value,
        telefone: telefone.value,
        endereco: endereco.value,
        cidade: cidade.value,
        produtoFornecidoA: produtoFornecidoA.value,
        produtoFornecidoB: produtoFornecidoB.value
    };

    fetch(`http://localhost:8080/fornecedores/${fornecedorAtual.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fornecedor)
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