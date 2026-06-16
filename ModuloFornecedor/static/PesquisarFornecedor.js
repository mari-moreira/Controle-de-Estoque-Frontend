const API = "http://localhost:8080";

// ─── Bootstrap Modais ────────────────────────────────────────────────────────
const modalEditarEl  = document.getElementById("modalEditar");
const modalExcluirEl = document.getElementById("modalExcluir");
const modalEditar    = new bootstrap.Modal(modalEditarEl);
const modalExcluir   = new bootstrap.Modal(modalExcluirEl);

// ─── Carregar todos ao abrir a página ────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    carregarTodos();

    document.getElementById("campoBusca").addEventListener("input", function () {
        const cnpj = this.value.trim();
        if (cnpj === "") {
            carregarTodos();
        } else if (/^[0-9]+$/.test(cnpj)) {
            buscarPorCnpj(cnpj);
        }
    });

    document.getElementById("formEditar").addEventListener("submit", salvarEdicao);
    document.getElementById("btnConfirmarExclusao").addEventListener("click", confirmarExclusao);
});

// ─── 1. LISTAR TODOS ─────────────────────────────────────────────────────────
function carregarTodos() {
    document.getElementById("campoBusca").value = "";

    fetch(`${API}/fornecedores`)
        .then(res => {
            if (!res.ok) throw new Error("Erro ao carregar");
            return res.json();
        })
        .then(lista => renderizarTabela(lista))
        .catch(() => mostrarMsg("Erro ao carregar fornecedores.", "danger"));
}

// ─── 2. BUSCAR POR CNPJ ──────────────────────────────────────────────────────
function buscarPorCnpj(cnpj) {
    fetch(`${API}/fornecedores/cnpj/${cnpj}`)
        .then(res => {
            if (res.status === 404 || res.status === 500) {
                renderizarTabela([]);
                return null;
            }
            if (!res.ok) throw new Error("Erro na busca");
            return res.json();
        })
        .then(fornecedor => {
            if (fornecedor) renderizarTabela([fornecedor]);
        })
        .catch(() => mostrarMsg("Erro ao buscar fornecedor.", "danger"));
}

// ─── 3. RENDERIZAR TABELA ────────────────────────────────────────────────────
function renderizarTabela(lista) {
    const tbody = document.getElementById("tabelaFornecedores");
    mostrarMsg("", "");

    if (!lista || lista.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted py-4">
                    <i class="bi bi-inbox me-2"></i>Nenhum fornecedor encontrado.
                </td>
            </tr>`;
        return;
    }

    tbody.innerHTML = lista.map(f => {
        // Converte null para string vazia — evita quebrar o template
        const produtoA = f.produtoFornecidoA || "";
        const produtoB = f.produtoFornecidoB || "";

        return `
        <tr>
            <td>${f.nome}</td>
            <td><span class="badge bg-secondary">${f.cnpj}</span></td>
            <td>${f.telefone}</td>
            <td>${f.cidade}</td>
            <td>${produtoA || '<span class="text-muted">—</span>'}</td>
            <td>${produtoB || '<span class="text-muted">—</span>'}</td>
            <td class="text-center">
                <button class="btn btn-warning btn-sm me-1"
                        onclick="abrirEditar('${f.cnpj}','${escapar(f.nome)}','${f.telefone}','${escapar(f.cidade)}','${escapar(f.endereco)}','${escapar(produtoA)}','${escapar(produtoB)}')">
                    <i class="bi bi-pencil-square"></i> Editar
                </button>
                <button class="btn btn-danger btn-sm"
                        onclick="abrirExcluir('${f.cnpj}','${escapar(f.nome)}')">
                    <i class="bi bi-trash"></i> Excluir
                </button>
            </td>
        </tr>`;
    }).join("");
}

// ─── 4. EDITAR ───────────────────────────────────────────────────────────────
function abrirEditar(cnpj, nome, telefone, cidade, endereco, produtoA, produtoB) {
    document.getElementById("editCnpj").value     = cnpj;
    document.getElementById("editNome").value     = nome;
    document.getElementById("editTelefone").value = telefone;
    document.getElementById("editCidade").value   = cidade;
    document.getElementById("editEndereco").value = endereco;
    document.getElementById("editProdutoA").value = produtoA;
    document.getElementById("editProdutoB").value = produtoB;
    document.getElementById("mensagemEditar").innerHTML = "";
    modalEditar.show();
}

function salvarEdicao(e) {
    e.preventDefault();

    const cnpj     = document.getElementById("editCnpj").value.trim();
    const nome     = document.getElementById("editNome").value.trim();
    const telefone = document.getElementById("editTelefone").value.trim();
    const cidade   = document.getElementById("editCidade").value.trim();
    const endereco = document.getElementById("editEndereco").value.trim();
    const produtoA = document.getElementById("editProdutoA").value.trim();
    const produtoB = document.getElementById("editProdutoB").value.trim();

    if (!nome || !telefone || !cidade || !endereco || !produtoA) {
        mostrarMsgModal("Preencha todos os campos obrigatórios!", "warning");
        return;
    }

    if (!/^[0-9]+$/.test(telefone)) {
        mostrarMsgModal("Telefone deve conter somente números!", "danger");
        return;
    }

    fetch(`${API}/fornecedores/cnpj/${cnpj}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, cnpj, telefone, cidade, endereco, produtoFornecidoA: produtoA, produtoFornecidoB: produtoB })
    })
        .then(res => {
            if (!res.ok) throw new Error("Erro ao atualizar");
            return res.json();
        })
        .then(() => {
            modalEditar.hide();
            mostrarMsg("Fornecedor atualizado com sucesso!", "success");
            carregarTodos();
        })
        .catch(() => mostrarMsgModal("Erro ao salvar alterações.", "danger"));
}

// ─── 5. EXCLUIR ──────────────────────────────────────────────────────────────
let cnpjParaExcluir = null;

function abrirExcluir(cnpj, nome) {
    cnpjParaExcluir = cnpj;
    document.getElementById("nomeExcluir").textContent = nome;
    document.getElementById("cnpjExcluir").textContent  = "CNPJ: " + cnpj;
    modalExcluir.show();
}

function confirmarExclusao() {
    if (!cnpjParaExcluir) return;

    fetch(`${API}/fornecedores/cnpj/${cnpjParaExcluir}`, {
        method: "DELETE"
    })
        .then(res => {
            if (!res.ok) throw new Error("Erro ao excluir");
            modalExcluir.hide();
            mostrarMsg("Fornecedor excluído com sucesso!", "success");
            cnpjParaExcluir = null;
            carregarTodos();
        })
        .catch(() => {
            modalExcluir.hide();
            mostrarMsg("Erro ao excluir fornecedor.", "danger");
        });
}

// ─── Utilitários ─────────────────────────────────────────────────────────────
function mostrarMsg(texto, tipo) {
    const el = document.getElementById("mensagem");
    el.innerHTML = texto ? `<div class="alert alert-${tipo}">${texto}</div>` : "";
}

function mostrarMsgModal(texto, tipo) {
    document.getElementById("mensagemEditar").innerHTML =
        `<div class="alert alert-${tipo} py-2">${texto}</div>`;
}

function escapar(str) {
    return str ? str.replace(/'/g, "\\'") : "";
}