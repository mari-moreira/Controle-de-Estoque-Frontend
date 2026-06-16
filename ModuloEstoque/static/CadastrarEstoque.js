const API = "http://localhost:8080/estoque";

document.getElementById("formCadastro").addEventListener("submit", function (e) {
    e.preventDefault();

    const codigo     = document.getElementById("codigo").value.trim();
    const nome       = document.getElementById("nome").value.trim();
    const quantidade = document.getElementById("quantidade").value.trim();

    if (!codigo || !nome || !quantidade) {
        mostrarMsg("Preencha todos os campos obrigatórios!", "warning");
        return;
    }

    if (!/^[0-9]+$/.test(quantidade)) {
        mostrarMsg("A quantidade deve conter somente números inteiros!", "danger");
        return;
    }

    const produto = { codigo, nome, quantidade: parseInt(quantidade) };
    cadastrar(produto);
});

function cadastrar(produto) {
    fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produto)
    })
    .then(res => {
        if (res.status === 409) {
            mostrarMsg("Já existe um produto com esse Código (SKU)!", "warning");
            return null;
        }
        if (!res.ok) throw new Error("Erro ao cadastrar");
        return res.json();
    })
    .then(data => {
        if (!data) return;
        mostrarMsg("Produto cadastrado com sucesso!", "success");
        document.getElementById("formCadastro").reset();
    })
    .catch(() => {
        mostrarMsg("Erro ao cadastrar. Verifique o servidor.", "danger");
    });
}

function mostrarMsg(texto, tipo) {
    const divMensagem = document.getElementById("mensagem");
    divMensagem.innerHTML = `<div class="alert alert-${tipo}">${texto}</div>`;
    setTimeout(() => divMensagem.innerHTML = "", 4000);
}