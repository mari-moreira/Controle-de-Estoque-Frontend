const API = "http://localhost:8080";

// ─── Bootstrap Modais ────────────────────────────────────────────────────────
const modalEditarEl  = document.getElementById("modalEditar");
const modalExcluirEl = document.getElementById("modalExcluir");
const modalEditar    = new bootstrap.Modal(modalEditarEl);
const modalExcluir   = new bootstrap.Modal(modalExcluirEl);

// ─── Carregar todos ao abrir a página ────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    carregarTodos();

    // Busca em tempo real ao digitar CPF
    document.getElementById("campoBusca").addEventListener("input", function () {
        const cpf = this.value.trim();
        if (cpf === "") {
            carregarTodos();
        } else if (/^[0-9]+$/.test(cpf)) {
            buscarPorCpf(cpf);
        }
    });

    // Formulário de edição
    document.getElementById("formEditar").addEventListener("submit", salvarEdicao);

    // Botão de confirmar exclusão
    document.getElementById("btnConfirmarExclusao").addEventListener("click", confirmarExclusao);
});

// ─── 1. LISTAR TODOS ─────────────────────────────────────────────────────────
function carregarTodos() {
    document.getElementById("campoBusca").value = "";

    fetch(`${API}/clientes`)
        .then(res => {
            if (!res.ok) throw new Error("Erro ao carregar");
            return res.json();
        })
        .then(lista => renderizarTabela(lista))
        .catch(() => mostrarMsg("Erro ao carregar clientes.", "danger"));
}

// ─── 2. BUSCAR POR CPF ───────────────────────────────────────────────────────
function buscarPorCpf(cpf) {
    fetch(`${API}/clientes/cpf/${cpf}`)
        .then(res => {
            if (res.status === 404) {
                renderizarTabela([]); // sem resultados
                return null;
            }
            if (!res.ok) throw new Error("Erro na busca");
            return res.json();
        })
        .then(cliente => {
            if (cliente) renderizarTabela([cliente]); // retorna objeto único → transforma em array
        })
        .catch(() => mostrarMsg("Erro ao buscar cliente.", "danger"));
}

// ─── 3. RENDERIZAR TABELA ────────────────────────────────────────────────────
function renderizarTabela(lista) {
    const tbody = document.getElementById("tabelaClientes");
    mostrarMsg("", ""); // limpa mensagem

    if (!lista || lista.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted py-4">
                    <i class="bi bi-inbox me-2"></i>Nenhum cliente encontrado.
                </td>
            </tr>`;
        return;
    }

    tbody.innerHTML = lista.map(c => `
        <tr>
            <td>${c.nome}</td>
            <td><span class="badge bg-secondary">${c.cpf}</span></td>
            <td>${c.telefone}</td>
            <td>${c.endereco}</td>
            <td class="text-center">
                <button class="btn btn-warning btn-sm me-1"
                        onclick="abrirEditar('${c.cpf}', '${escapar(c.nome)}', '${c.telefone}', '${escapar(c.endereco)}')">
                    <i class="bi bi-pencil-square"></i> Editar
                </button>
                <button class="btn btn-danger btn-sm"
                        onclick="abrirExcluir('${c.cpf}', '${escapar(c.nome)}')">
                    <i class="bi bi-trash"></i> Excluir
                </button>
            </td>
        </tr>
    `).join("");
}

// ─── 4. EDITAR ───────────────────────────────────────────────────────────────
function abrirEditar(cpf, nome, telefone, endereco) {
    document.getElementById("editCpf").value      = cpf;
    document.getElementById("editNome").value     = nome;
    document.getElementById("editTelefone").value = telefone;
    document.getElementById("editEndereco").value = endereco;
    document.getElementById("mensagemEditar").innerHTML = "";
    modalEditar.show();
}

function salvarEdicao(e) {
    e.preventDefault();

    const cpf      = document.getElementById("editCpf").value.trim();
    const nome     = document.getElementById("editNome").value.trim();
    const telefone = document.getElementById("editTelefone").value.trim();
    const endereco = document.getElementById("editEndereco").value.trim();

    if (!nome || !telefone || !endereco) {
        mostrarMsgModal("Preencha todos os campos!", "warning");
        return;
    }

    if (!/^[0-9]+$/.test(telefone)) {
        mostrarMsgModal("Telefone deve conter somente números!", "danger");
        return;
    }

    // PUT /clientes/cpf/{cpf}
    fetch(`${API}/clientes/cpf/${cpf}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, cpf, telefone, endereco })
    })
        .then(res => {
            if (!res.ok) throw new Error("Erro ao atualizar");
            return res.json();
        })
        .then(() => {
            modalEditar.hide();
            mostrarMsg("Cliente atualizado com sucesso!", "success");
            carregarTodos();
        })
        .catch(() => mostrarMsgModal("Erro ao salvar alterações.", "danger"));
}

// ─── 5. EXCLUIR ──────────────────────────────────────────────────────────────
let cpfParaExcluir = null;

function abrirExcluir(cpf, nome) {
    cpfParaExcluir = cpf;
    document.getElementById("nomeExcluir").textContent = nome;
    document.getElementById("cpfExcluir").textContent  = "CPF: " + cpf;
    modalExcluir.show();
}

function confirmarExclusao() {
    if (!cpfParaExcluir) return;

    // DELETE /clientes/cpf/{cpf}
    fetch(`${API}/clientes/cpf/${cpfParaExcluir}`, {
        method: "DELETE"
    })
        .then(res => {
            if (!res.ok) throw new Error("Erro ao excluir");
            modalExcluir.hide();
            mostrarMsg("Cliente excluído com sucesso!", "success");
            cpfParaExcluir = null;
            carregarTodos();
        })
        .catch(() => {
            modalExcluir.hide();
            mostrarMsg("Erro ao excluir cliente.", "danger");
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

// Evita quebrar aspas simples no onclick inline do HTML
function escapar(str) {
    return str.replace(/'/g, "\\'");
}