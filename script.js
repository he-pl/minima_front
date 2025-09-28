/*
---------------------------------------------------------------------------------------------------
MÍNIMA LISTA
Gerenciador de Tarefas

Alterações para o futuro: 

USUÁRIOS/ DEPARTAMENTOS
1. Criar relações entre Usuários/ Departamentos/ Tarefas no BD.
2. Relacionamentos de chefia (autorrelacionamentos na tabela usuários)
2. Criar uma segunda aba para adição de novos usuários e departamentos

ADIÇÃO DE TAREFAS 
1. passar a inserir linha direto na tabela, ordenada por data, sem fazer GET da lista inteira

TABELA DE TAREFAS
1. criar filtros por status, data, responsável etc
2. criar subtarefas (autorrelacionamento?)
3. criar um atributo "Prioridade" (nivel de urgencia)
---------------------------------------------------------------------------------------------------
*/


//Endereço da API 
const API_BASE = 'http://localhost:5000';


/*
----------------------------------------------------------------
Listeners e funções iniciais
----------------------------------------------------------------
*/
document.addEventListener('DOMContentLoaded', () => {
    //popula tabela de tarefas
    fetchTasks();

    //monitora botão de Adicionar nova tarefa
    document.getElementById('btnewtask').addEventListener('click', handleAddTask);

    //monitora cliques no THEAD 
    document.getElementById('t_header').addEventListener('click', handleHeaderClick);
    
    //monitora cliques no TBODY
    document.getElementById('task-list').addEventListener('click', handleTableClick);
6
    //checa se deve exibir mensagem de "Não há Tarefas!"
    checkTableRows();
    
});


/*
----------------------------------------------------------------
GET: Busca LISTA COMPLETA de tarefas no banco de dados
----------------------------------------------------------------
*/
async function fetchTasks() {
    try {
        const response = await fetch(`${API_BASE}/tasks`);
        const tasks = await response.json();
        renderTasks(tasks);
    } catch (error) {
        console.error('Erro ao recuperar as tarefas:', error);
    }
}


/*
----------------------------------------------------------------
Formata data de YYYY-MM-DD para DD/MM/YYYY
----------------------------------------------------------------
*/
function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}


/*
----------------------------------------------------------------
Popula a tabela criando uma linha para cada tarefa no BD
----------------------------------------------------------------
*/
function renderTasks(tasks) {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = ''; // Limpar o corpo da tabela
    tasks.forEach(task => {
        const row = createTaskRow(task);
        taskList.appendChild(row);
    });

    // checar se há linhas na tabela
    checkTableRows(); 
}


/*
----------------------------------------------------------------
Cria uma linha na tabela com dados de tarefa
----------------------------------------------------------------
*/
function createTaskRow(task) {
    const row = document.createElement('tr');
    row.dataset.id = task.t_id;
    row.dataset.rawDate = task.t_date;
    row.innerHTML = `
        <td class="td_done"><input type="checkbox" ${task.t_done ? 'checked' : ''} class="done-checkbox-active"></td>
        <td class="td_date">${formatDate(task.t_date)}</td>
        <td class="td_assignedto">${task.t_assignedto}</td>
        <td class="td_titledesc">
            ${createTitleDescHTML(task.t_title, task.t_description)}
        </td>
        <td class="td_action">
            ${createActionButtonsHTML()}
        </td>
    `;
    return row;
}


/*
----------------------------------------------------------------
abstração do HTML do titulo e descrição
----------------------------------------------------------------
*/
function createTitleDescHTML(title, description) {
    return `
        <span class="title">${title}</span> <a href="#" class="toggle-desc">Mais</a>
        <span class="description description-hidden"><br>${description}</span>

    `;
}


/*
----------------------------------------------------------------
abstração dos HTML dos botões da ultima coluna
----------------------------------------------------------------
*/
function createActionButtonsHTML(button1Class = 'edit-btn', button2Class = 'delete-btn') {
    return `
        <button class="${button1Class}"></button>
        <button class="${button2Class}"></button>
    `;
}


/*
----------------------------------------------------------------
Checa se há linhas na tabela para mostrar "não há tarefas"
----------------------------------------------------------------
*/
function checkTableRows() {
  const tableBody = document.getElementById('task-list');
  const noRowsMessage = document.getElementById('noRowsMessage');

  if (tableBody.getElementsByTagName('tr').length === 0) {
    noRowsMessage.classList.remove('noTaskHidden');
  } else {
    noRowsMessage.classList.add('noTaskHidden');
  }
}


/*
----------------------------------------------------------------
ADICIONA TAREFA ao BD e à tabela
----------------------------------------------------------------
*/
async function handleAddTask(event) {
    event.preventDefault();

    const taskData = taskFormInput();

    try {
        const response = await fetch(`${API_BASE}/tasks`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(taskData)
        });

        if (response.ok) {
            // Resetar o formulario
            resetTaskForm();

            // Recarrega a tabela para manter a ordenação
            fetchTasks();
        }
    } catch (error) {
        console.error('Erro ao adicionar tarefa:', error);
    }
}


/*
----------------------------------------------------------------
Reseta inputs de Nova Tarefa
----------------------------------------------------------------
*/
function resetTaskForm() {
    document.getElementById('t_date').value = '';
    document.getElementById('t_date').placeholder = '';
    document.getElementById('t_assignedto').value = '';
    document.getElementById('t_assignedto').placeholder = 'Responsável';
    document.getElementById('t_title').value = '';
    document.getElementById('t_title').placeholder = 'Tarefa';
    document.getElementById('t_description').value = '';
    document.getElementById('t_description').placeholder = 'Descrição até 200 caracteres';
}


/*
----------------------------------------------------------------
Coleta os dados dos inputs de Nova Tarefa
----------------------------------------------------------------
*/
function taskFormInput() {
    return {
        t_date: document.getElementById('t_date').value,
        t_assignedto: document.getElementById('t_assignedto').value,
        t_title: document.getElementById('t_title').value,
        t_description: document.getElementById('t_description').value
    };
}


/*
----------------------------------------------------------------
Monitora cliques no THEAD e delega reação
----------------------------------------------------------------
*/
function handleHeaderClick(event) {
    const target = event.target;
    
    //clique no botão de deletar tabela
    if (target.id === 'delete-all-btn') {
        handleDeleteAll();
    
    //clique no link "Expandir"
    } else if (target.id === 'show-desc') {
        showAllDescriptions();
    
    // clique no link "Esconder"
    } else if (target.classList.contains('hide-desc')) {
        hideAllDescriptions();
    }
}


/*
----------------------------------------------------------------
DELETA TODAS AS LINHAS da tabela e do BD
----------------------------------------------------------------
*/
async function handleDeleteAll() {
    if (confirm("Deletar todas as tarefas? Isto não pode ser desfeito")) {
        try {
            await fetch(`${API_BASE}/tasks`, { method: 'DELETE' });
            fetchTasks(); // atualizar lista
        } catch (error) {
            console.error('Erro ao deletar todas as tarefas:', error);
        }
    }
}


/*
----------------------------------------------------------------
Expande todas descrições ocultas
----------------------------------------------------------------
*/
function showAllDescriptions() {
    const rows = document.querySelectorAll('#task-list tr');
    if (rows.length === 0) return;
    
    rows.forEach(row => {
        const description = row.querySelector('.description');
        if (description && description.classList.contains('description-hidden')) {
            const toggleLink = row.querySelector('.toggle-desc');
            if (toggleLink) {
                toggleDescription(toggleLink);
            }
        }
    });
}

/*
----------------------------------------------------------------
Recolhe todas descrições visíveis
----------------------------------------------------------------
*/
function hideAllDescriptions() {
    const rows = document.querySelectorAll('#task-list tr');
    if (rows.length === 0) return;
    
    rows.forEach(row => {
        const description = row.querySelector('.description');
        if (description && !description.classList.contains('description-hidden')) {
            const toggleLink = row.querySelector('.toggle-desc');
            if (toggleLink) {
                toggleDescription(toggleLink);
            }
        }
    });
}


/*
----------------------------------------------------------------
Monitora cliques no TBODY e chama funções dependendo do alvo
----------------------------------------------------------------
*/
function handleTableClick(event) {
    const target = event.target;
    const row = target.closest('tr');
    if (!row) return;

    const taskId = row.dataset.id;

    switch (true) {
        //clique na checkbox
        case target.classList.contains('done-checkbox-active'):
            handlePatchTask(taskId, target.checked);
            break;
        //clique no Mais/Menos 
        case target.classList.contains('toggle-desc'):
            toggleDescription(target);
            break;
        //clique no botao de deletar linha
        case target.classList.contains('delete-btn'):
            handleDelete(taskId);
            break;
        //clique no botão de editar linha
        case target.classList.contains('edit-btn'):
            handleEdit(row);
            break;
        //clique no botão de OK (confirmar edição)
        case target.classList.contains('ok-btn'):
            handleOk(row, taskId);
            break;
        //clique no botão de cancelar edição
        case target.classList.contains('cancel-btn'):
            handleCancel(row);
            break;
        //nada se clicar em qualquer outro lugar
        default:
            break;
    }
}


/*
----------------------------------------------------------------
PATCH: clique na checkbox ATUALIZA STATUS da tarefa
----------------------------------------------------------------
*/
async function handlePatchTask(taskId, isDone) {
    try {
        await fetch(`${API_BASE}/tasks/${taskId}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ t_done: isDone })
        });
    } catch (error) {
        console.error('Erro ao alterar status da tarefa:', error);
    }
}


/*
----------------------------------------------------------------
Expande ou recolhe a descrição da tarefa
----------------------------------------------------------------
*/
function toggleDescription(toggleLink) {
    const descriptionSpan = toggleLink.parentNode.querySelector('.description');
    
    // Tirar ou colocar a classe 'description-hidden' na descrição
    descriptionSpan.classList.toggle('description-hidden');

    // Trocar "Mais" pra "Menos"
    if (descriptionSpan.classList.contains('description-hidden')) {
        toggleLink.textContent = 'Mais';
    } else {
        toggleLink.textContent = 'Menos';
    }
}


/*
----------------------------------------------------------------
DELETAR TAREFA 
----------------------------------------------------------------
*/
async function handleDelete(taskId) {
    if (confirm("Quer mesmo excluir esta tarefa?")) { 
        try {
            const response = await fetch(`${API_BASE}/tasks/${taskId}`, { method: 'DELETE' });
            
            if (response.ok) {
                
                removeTaskRow(taskId);
            }
        } catch (error) {
            console.error('Erro ao excluir a tarefa:', error);
        }
    }
}


/*
----------------------------------------------------------------
Remove uma linha da tabela
----------------------------------------------------------------
*/
function removeTaskRow(taskId) {
    const rowToRemove = document.querySelector(`tr[data-id="${taskId}"]`);
    if (rowToRemove) {
        rowToRemove.remove();
        // Check the table status after the row is removed
        checkTableRows();
    }
}


/*
----------------------------------------------------------------
Ativa o "modo de edição" da linha
----------------------------------------------------------------
*/
function handleEdit(row) {

    // Pega dados iniciais da linha e guarda, para o caso de cancelamento
    const data = storeOriginalData(row);

    // Coloca campos input nas celulas 
    row.querySelector('.td_date').innerHTML = `<input type="date" value="${data.date}" class="edit-date">`;
    row.querySelector('.td_assignedto').innerHTML = `<input type="text" value="${data.assignedto}" class="edit-assignedto">`;
    row.querySelector('.td_titledesc').innerHTML = `
        <input type="text" value="${data.title}" class="edit-title" maxlength="50"><br>
        <input type="text" value="${data.description}" class="edit-description" maxlength="150">

    `;

    // Troca classe da checkbox (para que handleTableClick nao capture o clique)
    const checkbox = row.querySelector('.done-checkbox-active');
    checkbox.className = 'done-checkbox-editmode';

    // Cria botões OK e Cancel
    changeActionButtons(row, 'edit');
}


/*
----------------------------------------------------------------
Altera os botões da linha baseado no modo (edit/display)
----------------------------------------------------------------
*/
function changeActionButtons(row, mode) {
    const buttonCell = row.querySelector('.td_action');
    switch (mode) {
        // Modo 'edit' cria os botões de confirmar/ cancelar edição da linha
        case 'edit':
            buttonCell.innerHTML = createActionButtonsHTML('ok-btn', 'cancel-btn');
            break;
        
        // Modo 'display" cria os botões de editar/ deletar a linha
        case 'display':
            buttonCell.innerHTML = createActionButtonsHTML('edit-btn', 'delete-btn');
            break;
        
        default:
            console.error('Modo incorreto solicitado');
    }
}


/*
----------------------------------------------------------------
Armazena os dados originais da linha
----------------------------------------------------------------
*/
function storeOriginalData(row) {
    const data = {
        taskId: row.dataset.id,
        isDone: row.querySelector('.done-checkbox-active').checked,
        date: row.dataset.rawDate,
        assignedto: row.querySelector('.td_assignedto').textContent,
        title: row.querySelector('.title').textContent,
        description: row.querySelector('.description').textContent
    };

    row.originalData = data;

    row.dataset.originalDate = data.date;
    row.dataset.originalAssignedto = data.assignedto;
    row.dataset.originalTitle = data.title;
    row.dataset.originalDescription = data.description;
    row.dataset.originalDone = data.isDone;

    return data;
}


/*
----------------------------------------------------------------
UPDATE: Commit na tarefa editada e retorna linha a modo display
----------------------------------------------------------------
*/
async function handleOk(row, taskId) {

    // Recolhe os valores dos campos input
    const newDate = row.querySelector('.edit-date').value;
    const newAssignedTo = row.querySelector('.edit-assignedto').value;
    const newTitle = row.querySelector('.edit-title').value;
    const newDescription = row.querySelector('.edit-description').value; 

    const updatedTask = {
        t_id: taskId,
        t_done: row.querySelector('.done-checkbox-editmode').checked,
        t_date: newDate,
        t_assignedto: newAssignedTo,
        t_title: newTitle,
        t_description: newDescription
    };

    try {

        // Envia PUT para a API
        const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedTask)
        });

        if (response.ok) {
            // Se a data mudou, recarrega tabela toda para reordenar
            if (newDate !== row.originalData.date) {
                fetchTasks();
            } else {
                // Se data não mudou, apenas atualiza as infos da TR
                row.dataset.rawDate = newDate;
                row.querySelector('.td_date').textContent = formatDate(newDate);
                row.querySelector('.td_assignedto').textContent = newAssignedTo;

                const taskTitleCell = row.querySelector('.td_titledesc');
                taskTitleCell.innerHTML = createTitleDescHTML(newTitle, newDescription);

                // Restaura funcionalidade PATCH da checkbox
                const checkbox = row.querySelector('.done-checkbox-editmode');
                checkbox.className = 'done-checkbox-active';

                // Oculta botões OK/Cancelar e retorna Editar/Excluir
                changeActionButtons(row, 'display');
            }
        } else {
            // Se PUT falhar, alerta usuário e mantem a linha em modo de edição
            alert('Falha ao atualizar a tarefa. Verifique seus dados e tente novamente.');
        }
    } catch (error) {
        console.error('Erro na requisição PUT:', error);
        alert('Erro de conexão. Tente novamente.');
    }
}


/*
----------------------------------------------------------------
Cancela edição da linha e restaura dados
----------------------------------------------------------------
*/
function handleCancel(row) {
    const data = row.originalData;

    // Restaurar o conteúdo original da linha
    row.dataset.rawDate = data.date;
    row.querySelector('.td_date').textContent = formatDate(data.date);
    row.querySelector('.td_assignedto').textContent = data.assignedto;

    const taskTitleCell = row.querySelector('.td_titledesc');
    taskTitleCell.innerHTML = createTitleDescHTML(data.title, data.description);

    // Restaura funcionalidade PATCH do checkbox
    const checkbox = row.querySelector('.done-checkbox-editmode');

    checkbox.checked = data.isDone;
    checkbox.className = 'done-checkbox-active';

    //Traz de volta botões editar e excluir
    changeActionButtons(row, 'display');
}

