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
            li.textContent = `${c.nome} - ${c.cpf}`;
            li.onclick = () => mostrarDetalhes(c.id);
            lista.appendChild(li);
        });
    });
}

function mostrarDetalhes(id) {
    const f = clientes.find(c => c.id === id);

    document.getElementById("detalhes").innerHTML = `
        <p><b>Nome:</b> ${f.nome}</p>
        <p><b>CPF:</b> ${f.cpf}</p>
        <p><b>Telefone:</b> ${f.telefone}</p>
        <p><b>Endereço:</b> ${f.endereco}</p>

    `;
}