const params = new URLSearchParams(window.location.search);
const id = params.get("id");

fetch(`http://localhost:8080/fornecedores/${id}`)
.then(res => res.json())
.then(f => {
    document.getElementById("nome").value = f.nome;
    document.getElementById("cnpj").value = f.cnpj;
    document.getElementById("telefone").value = f.telefone;
    document.getElementById("endereco").value = f.endereco;
    document.getElementById("cidade").value = f.cidade;
    document.getElementById("produtoFornecidoA").value = f.produtoFornecidoA;
    document.getElementById("produtoFornecidoB").value = f.produtoFornecidoB;
});

document.getElementById("form").addEventListener("submit", function(e) {
    e.preventDefault();

    const fornecedor = {
        nome: document.getElementById("nome").value,
        cnpj: document.getElementById("cnpj").value,
        telefone: document.getElementById("telefone").value,
        endereco: document.getElementById("endereco").value,
        cidade: document.getElementById("cidade").value,
        produtoFornecidoA: document.getElementById("produtoFornecidoA").value,
        produtoFornecidoB: document.getElementById("produtoFornecidoB").value
    };

    fetch(`http://localhost:8080/fornecedores/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fornecedor)
    })
    .then(res => {
        if (!res.ok) throw new Error("Erro ao atualizar");
        return res.json();
    })
    .then(() => {
        document.getElementById("msg").innerText = "Atualizado com sucesso!";
    })
    .catch(err => {
        document.getElementById("msg").innerText = err.message;
    });
});