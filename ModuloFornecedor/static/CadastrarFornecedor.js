document.getElementById("formFornecedor").addEventListener("submit", function(e) {
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

    fetch("http://localhost:8080/fornecedores", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(fornecedor)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Erro ao cadastrar");
        }
        return response.json();
    })
    .then(data => {
        document.getElementById("mensagem").innerText = "Fornecedor cadastrado com sucesso!";
        document.getElementById("formFornecedor").reset();
    })
    .catch(error => {
        document.getElementById("mensagem").innerText = error.message;
    });
});