let fornecedores = [];

function pesquisar() {
    const termo = document.getElementById("busca").value.toLowerCase();

    fetch("http://localhost:8080/fornecedores")
    .then(res => res.json())
    .then(data => {
        fornecedores = data;

        const filtrados = fornecedores.filter(f =>
            f.nome.toLowerCase().includes(termo) ||
            f.cnpj.includes(termo)
        );

        const lista = document.getElementById("lista");
        lista.innerHTML = "";

        filtrados.forEach(f => {
            const li = document.createElement("li");
            li.textContent = `${f.nome} - ${f.cnpj}`;
            li.onclick = () => mostrarDetalhes(f.id);
            lista.appendChild(li);
        });
    });
}

function mostrarDetalhes(id) {
    const f = fornecedores.find(f => f.id === id);

    document.getElementById("detalhes").innerHTML = `
        <p><b>Nome:</b> ${f.nome}</p>
        <p><b>CNPJ:</b> ${f.cnpj}</p>
        <p><b>Telefone:</b> ${f.telefone}</p>
        <p><b>Endereço:</b> ${f.endereco}</p>
        <p><b>Cidade:</b> ${f.cidade}</p>
        <p><b>Produto Fornecido A:</b> ${f.produtoFornecidoA}</p>
        <p><b>Produto Fornecido B:</b> ${f.produtoFornecidoB}</p>
    `;
}