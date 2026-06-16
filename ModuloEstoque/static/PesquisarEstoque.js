const API = "http://localhost:8080/estoque";
let estoqueLocal = []; 

// Instância do Modal do Bootstrap
const modalEdicao = new bootstrap.Modal(document.getElementById('modalEditar'));

function carregarEstoque() {
    fetch(API)
    .then(res => {
        if (!res.ok) throw new Error("Erro ao buscar dados");
        return res.json();
    })
    .then(data => {
        estoqueLocal = data;
        renderizarTabela(estoqueLocal);
    })
    .catch(() => {
        document.getElementById('tabelaEstoque').innerHTML = 
            `<tr><td colspan="4" class="text-center text-danger">Erro de conexão com o servidor.</td></tr>`;
    });
}

// --- PESQUISA LOCAL ---
document.getElementById('campoPesquisa').addEventListener('input', function() {
    const termo = this.value.toLowerCase();
    const resultados = estoqueLocal.filter(p => 
        p.nome.toLowerCase().includes(termo) || 
        p.codigo.toLowerCase().includes(termo)
    );
    renderizarTabela(resultados);
});

function renderizarTabela(dados) {
    const tabelaEstoque = document.getElementById('tabelaEstoque');
    tabelaEstoque.innerHTML = '';

    if (dados.length === 0) {
        tabelaEstoque.innerHTML = `<tr><td colspan="4" class="text-center text-muted">Nenhum produto listado.</td></tr>`;
        return;
    }

    dados.forEach(produto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="ps-3"><span class="badge bg-secondary">${produto.codigo}</span></td>
            <td class="fw-bold">${produto.nome}</td>
            <td>${produto.quantidade}</td>
            <td class="text-end pe-3">
                <button class="btn btn-sm btn-outline-primary" onclick="abrirEdicao('${produto.codigo}')">Editar</button>
                <button class="btn btn-sm btn-outline-danger ms-1" onclick="excluirProduto('${produto.codigo}')">Excluir</button>
            </td>
        `;
        tabelaEstoque.appendChild(tr);
    });
}

// --- EXCLUSÃO (DELETE) ---
window.excluirProduto = function(codigo) {
    if (confirm(`Excluir permanentemente o produto ${codigo}?`)) {
        fetch(`${API}/codigo/${codigo}`, { method: "DELETE" })
        .then(res => {
            if (!res.ok) throw new Error("Erro ao excluir");
            mostrarMsg("mensagemListagem", "Produto excluído com sucesso!", "success");
            carregarEstoque();
        })
        .catch(() => mostrarMsg("mensagemListagem", "Erro ao excluir.", "danger"));
    }
};

// --- EDIÇÃO (PUT) VIA MODAL ---
window.abrirEdicao = function(codigo) {
    const produto = estoqueLocal.find(p => p.codigo === codigo);
    if (!produto) return;

    document.getElementById("editCodigo").value = produto.codigo;
    document.getElementById("editNome").value = produto.nome;
    document.getElementById("editQuantidade").value = produto.quantidade;
    
    document.getElementById("mensagemModal").innerHTML = ""; // Limpa mensagens antigas
    modalEdicao.show();
};

document.getElementById("formEdicao").addEventListener("submit", function(e) {
    e.preventDefault();
    
    const codigo = document.getElementById("editCodigo").value;
    const nome = document.getElementById("editNome").value.trim();
    const quantidade = document.getElementById("editQuantidade").value.trim();

    if (!/^[0-9]+$/.test(quantidade)) {
        mostrarMsg("mensagemModal", "Quantidade inválida!", "danger");
        return;
    }

    const produtoAtualizado = { codigo, nome, quantidade: parseInt(quantidade) };

    fetch(`${API}/codigo/${codigo}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produtoAtualizado)
    })
    .then(res => {
        if (!res.ok) throw new Error("Erro ao atualizar");
        return res.json();
    })
    .then(data => {
        modalEdicao.hide();
        mostrarMsg("mensagemListagem", "Produto atualizado com sucesso!", "success");
        carregarEstoque();
    })
    .catch(() => mostrarMsg("mensagemModal", "Erro ao atualizar no servidor.", "danger"));
});

// Utilitário de mensagens que aceita o ID da div alvo
function mostrarMsg(idAlvo, texto, tipo) {
    const divMensagem = document.getElementById(idAlvo);
    divMensagem.innerHTML = `<div class="alert alert-${tipo}">${texto}</div>`;
    setTimeout(() => divMensagem.innerHTML = "", 4000);
}

// Inicializa a tabela
carregarEstoque();