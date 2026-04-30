let clienteAtual = null;

function buscar() {
    const id = document.getElementById("id").value;

    fetch(`http://localhost:8080/clientes/${id}`)
    .then(res => {
        if (!res.ok) throw new Error("Não encontrado");
        return res.json();
    })
    .then(c => {
        clienteAtual = c;

        document.getElementById("info").innerHTML = `
            <p><b>${c.nome}</b> - ${c.cpf}</p>
        `;
    })
    .catch(err => {
        document.getElementById("msg").innerText = err.message;
    });
}

function excluir() {
    if (!clienteAtual) {
        document.getElementById("msg").innerText = "Busque um cliente primeiro!";
        return;
    }

    fetch(`http://localhost:8080/clientes/${clienteAtual.id}`, {
        method: "DELETE"
    })
    .then(() => {
        document.getElementById("msg").innerText = "Excluído com sucesso!";
        document.getElementById("info").innerHTML = "";
        clienteAtual = null;
    })
    .catch(() => {
        document.getElementById("msg").innerText = "Erro ao excluir";
    });
}