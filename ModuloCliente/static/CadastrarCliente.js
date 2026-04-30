document.getElementById("formCliente").addEventListener("submit", function(e) {
    e.preventDefault();

    const cliente = {
        nome: document.getElementById("nome").value,
        cpf: document.getElementById("cpf").value,
        telefone: document.getElementById("telefone").value,
        endereco: document.getElementById("endereco").value,
    };

    fetch("http://localhost:8080/clientes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(cliente)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Erro ao cadastrar");
        }
        return response.json();
    })
    .then(data => {
        document.getElementById("mensagem").innerText = "Cliente cadastrado com sucesso!";
        document.getElementById("formCliente").reset();
    })
    .catch(error => {
        document.getElementById("mensagem").innerText = error.message;
    });
});