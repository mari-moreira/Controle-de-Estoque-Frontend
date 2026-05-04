let clientes = [];

function pesquisar() {
    const termo = document.getElementById("busca").value.toLowerCase();

    fetch("http://localhost:8080/clientes")
    .then(res => res.json())
    .then(data => {
        clientes = data;

        const filtrados = clientes.filter(c =>
            c.nome.toLowerCase().includes(termo) ||
            c.cpf.includes(termo)
        );

        const lista = document.getElementById("lista");
        lista.innerHTML = "";

        filtrados.forEach(c => {
            const li = document.createElement("li");
            li.className = "list-group-item";
            li.textContent = `${c.nome} - ${c.cpf}`;
            li.onclick = () => mostrarDetalhes(c.id);

            lista.appendChild(li);
        });
    });
}

function mostrarDetalhes(id) {
    const c = clientes.find(c => c.id == id);

    if (!c) {
        document.getElementById("detalhes").innerHTML =
            "<div class='alert alert-danger'>Cliente não encontrado</div>";
        return;
    }

    document.getElementById("detalhes").innerHTML = `
        <p><b>Nome:</b> ${c.nome}</p>
        <p><b>CPF:</b> ${c.cpf}</p>
        <p><b>Telefone:</b> ${c.telefone}</p>
        <p><b>Endereço:</b> ${c.endereco}</p>
    `;

}