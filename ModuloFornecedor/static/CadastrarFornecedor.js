document.getElementById("formFornecedor").addEventListener("submit", function(e) {
    e.preventDefault();

    const nome     = document.getElementById("nome").value.trim();
    const cnpj     = document.getElementById("cnpj").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const endereco = document.getElementById("endereco").value.trim();
    const cidade   = document.getElementById("cidade").value.trim();
    const produtoA = document.getElementById("produtoFornecidoA").value.trim();
    const produtoB = document.getElementById("produtoFornecidoB").value.trim();

    // 🔴 1. Campos obrigatórios (produtoB é opcional)
    if (!nome || !cnpj || !telefone || !endereco || !cidade || !produtoA) {
        mostrarMsg("Preencha todos os campos obrigatórios!", "warning");
        return;
    }

    // 🔴 2. Validar telefone (só números)
    const telefoneValido = /^[0-9]+$/.test(telefone);
    if (!telefoneValido) {
        mostrarMsg("Caracteres inválidos inseridos no Número de Telefone!", "danger");
        return;
    }

    // 🔴 3. Validar CNPJ (só números)
    const cnpjValido = /^[0-9]+$/.test(cnpj);
    if (!cnpjValido) {
        mostrarMsg("Caracteres inválidos inseridos no CNPJ!", "danger");
        return;
    }

    const fornecedor = { nome, cnpj, telefone, endereco, cidade, produtoFornecidoA: produtoA, produtoFornecidoB: produtoB };

    // 🔎 4. Verificar duplicado
    fetch("http://localhost:8080/fornecedores")
    .then(res => res.json())
    .then(lista => {

        const existe = lista.some(f => f.cnpj === cnpj);

        if (existe) {
            mostrarMsg("Já existe um fornecedor cadastrado com essas informações!", "warning");
            return;
        }

        // ✅ 5. Cadastrar
        fetch("http://localhost:8080/fornecedores", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(fornecedor)
        })
        .then(res => {
            if (!res.ok) throw new Error("Erro ao cadastrar");
            return res.json();
        })
        .then(() => {
            mostrarMsg("Fornecedor Registrado com Sucesso!", "success");
            document.getElementById("formFornecedor").reset();
        })
        .catch(() => {
            mostrarMsg("Erro ao cadastrar fornecedor!", "danger");
        });

    });
});

// 💬 Função de mensagem padrão
function mostrarMsg(texto, tipo) {
    document.getElementById("mensagem").innerHTML =
        `<div class="alert alert-${tipo}">${texto}</div>`;
}