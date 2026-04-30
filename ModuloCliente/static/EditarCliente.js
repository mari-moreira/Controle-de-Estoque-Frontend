const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// carregar dados
fetch(`http://localhost:8080/clientes/${id}`)
.then(res => res.json())
.then(c => {
    document.getElementById("nome").value = c.nome;
    document.getElementById("cpf").value = c.cnpj;
    document.getElementById("telefone").value = c.telefone;
    document.getElementById("endereco").value = c.endereco;
});

// atualizar
document.getElementById("form").addEventListener("submit", function(e) {
    e.preventDefault();

    const fornecedor = {
        nome: document.getElementById("nome").value,
        cpf: document.getElementById("cpf").value,
        telefone: document.getElementById("telefone").value,
        endereco: document.getElementById("endereco").value,
    };

    fetch(`http://localhost:8080/clientes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cliente)
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