const API_URL = 'http://localhost:8080/estoque';
let estoqueLocal = []; 
let modoEdicao = false;

// Elementos do DOM
const form = document.getElementById('estoqueForm');
const campoCodigo = document.getElementById('codigo');
const campoNome = document.getElementById('nome');
const campoQuantidade = document.getElementById('quantidade');
const campoPesquisa = document.getElementById('campoPesquisa');
const tabelaEstoque = document.getElementById('tabelaEstoque');
const btnSalvar = document.getElementById('btnSalvar');
const btnCancelar = document.getElementById('btnCancelar');
const formTitle = document.getElementById('formTitle');

// Instâncias das Abas do Bootstrap para controle via JS
const tabPesquisa = new bootstrap.Tab(document.getElementById('pesquisa-tab'));
const tabCadastro = new bootstrap.Tab(document.getElementById('cadastro-tab'));

async function carregarEstoque() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erro do servidor');
        estoqueLocal = await response.json();
        renderizarTabela(estoqueLocal);
    } catch (error) {
        console.error("Falha:", error);
        tabelaEstoque.innerHTML = `<tr><td colspan="4" class="text-center text-danger py-4">Erro ao conectar com a API Spring Boot.</td></tr>`;
    }
}

form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const produtoDTO = {
        codigo: campoCodigo.value.trim(),
        nome: campoNome.value.trim(),
        quantidade: parseInt(campoQuantidade.value)
    };

    try {
        let response;
        if (modoEdicao) {
            response = await fetch(`${API_URL}/codigo/${produtoDTO.codigo}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(produtoDTO)
            });
            
        } else {
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(produtoDTO)
            });
        }

        if (response.ok) {
            sairModoEdicao();
            await carregarEstoque(); 
            tabPesquisa.show(); // Retorna o usuário automaticamente para a lista após salvar
        } else {
            alert("Erro ao salvar. Verifique os dados.");
        }
    } catch (error) {
        console.error("Erro:", error);
    }
});

window.excluirProduto = async function(codigo) {
    if (confirm(`Atenção: Confirmar exclusão permanente do produto código ${codigo}?`)) {
        try {
            const response = await fetch(`${API_URL}/codigo/${codigo}`, { method: 'DELETE' });
            if (response.ok) carregarEstoque();
        } catch (error) {
            console.error("Erro ao excluir:", error);
        }
    }
};

campoPesquisa.addEventListener('input', function() {
    const termo = this.value.toLowerCase();
    const resultados = estoqueLocal.filter(p => 
        p.nome.toLowerCase().includes(termo) || 
        p.codigo.toLowerCase().includes(termo)
    );
    renderizarTabela(resultados);
});

function renderizarTabela(dados) {
    tabelaEstoque.innerHTML = '';

    if (dados.length === 0) {
        tabelaEstoque.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-4"><i class="bi bi-inbox fs-4 d-block mb-2"></i> Nenhum produto encontrado.</td></tr>`;
        return;
    }

    dados.forEach(produto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="ps-3"><span class="badge bg-light text-dark border">${produto.codigo}</span></td>
            <td class="fw-bold">${produto.nome}</td>
            <td>
                <span class="badge ${produto.quantidade > 5 ? 'bg-success' : 'bg-danger'}">
                    ${produto.quantidade}
                </span>
            </td>
            <td class="text-end pe-3">
                <button class="btn btn-sm btn-outline-primary" onclick="prepararEdicao('${produto.codigo}')" title="Editar">
                    <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger ms-1" onclick="excluirProduto('${produto.codigo}')" title="Excluir">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tabelaEstoque.appendChild(tr);
    });
}

window.prepararEdicao = function(codigo) {
    const produto = estoqueLocal.find(p => p.codigo === codigo);
    if (!produto) return;

    campoCodigo.value = produto.codigo;
    campoCodigo.readOnly = true; 
    campoNome.value = produto.nome;
    campoQuantidade.value = produto.quantidade;

    modoEdicao = true;
    formTitle.innerHTML = `<i class="bi bi-pencil"></i> Editando Produto: ${codigo}`;
    btnSalvar.innerHTML = '<i class="bi bi-check-circle"></i> Atualizar Produto';
    btnSalvar.classList.replace('btn-primary', 'btn-warning');
    btnCancelar.classList.remove('d-none');
    
    // Troca para a aba de cadastro automaticamente
    tabCadastro.show();
};

btnCancelar.addEventListener('click', sairModoEdicao);

function sairModoEdicao() {
    modoEdicao = false;
    form.reset();
    campoCodigo.readOnly = false;
    
    formTitle.innerHTML = "Novo Cadastro";
    btnSalvar.innerHTML = '<i class="bi bi-save"></i> Salvar Produto';
    btnSalvar.classList.replace('btn-warning', 'btn-primary');
    btnCancelar.classList.add('d-none');
    
    // Se o usuário cancelou a edição, volta para a lista
    tabPesquisa.show();
}

// Inicia buscando dados
carregarEstoque();