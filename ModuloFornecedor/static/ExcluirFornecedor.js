let fornecedorAtual = null;

function buscar() {
    const id = document.getElementById("id").value;

    fetch(`http://localhost:8080/fornecedores/${id}`)
    .then(res => {
        if (!res.ok) throw new Error("Não encontrado");
        return res.json();
    })
    .then(f => {
        fornecedorAtual = f;

        document.getElementById("info").innerHTML = `
            <p><b>${f.nome}</b> - ${f.cnpj}</p>
        `;
    })
    .catch(err => {
        document.getElementById("msg").innerText = err.message;
    });
}

function excluir() {
    if (!fornecedorAtual) {
        document.getElementById("msg").innerText = "Busque um fornecedor primeiro!";
        return;
    }

    fetch(`http://localhost:8080/fornecedores/${fornecedorAtual.id}`, {
        method: "DELETE"
    })
    .then(() => {
        document.getElementById("msg").innerText = "Excluído com sucesso!";
        document.getElementById("info").innerHTML = "";
        fornecedorAtual = null;
    })
    .catch(() => {
        document.getElementById("msg").innerText = "Erro ao excluir";
    });
}