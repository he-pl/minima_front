
# MÍNIMA LISTA | Front end

> Projeto criado como parte das exigências para a conclusão do sprint Desenvolvimento Full Stack Básico da **Especialização em Desenvolvimento Full Stack** da **PUC Rio**.

**Mínima Lista** é um app simples de gerenciamento de tarefas em formato *Single Page Application*.

Consiste de um *front end* criado em HTML, CSS e Javascript (sem frameworks), alimentado por um *back end* com uma API em Python e um banco de dados simples.

> **Este repositório contém apenas o *front end* da aplicação.**
> O *back end* está publicado e explicado [neste repositório](http://placeholder.com).

## VISÃO GERAL

O *front end* de **Mínima Lista** está organizado da seguinte forma:

### Nova Tarefa

A parte de cima da página tem um card com um formulário para incluir novas tarefas no banco de dados. 

### Lista de tarefas

Abaixo do card de Nova Tarefa, há uma tabela dinamicamente populada para exibir as tarefas já inseridas. A tabela permite editar dados e deletar (uma ou todas) tarefas.

A tabela é organizada da seguinte forma:
- **Status:** concluído/ não concluído. Uma checkbox permite alteração fácil deste dado.
- **Prazo:** É a coluna que ordena as tarefas atualmente
- **Tarefa:** As células desta coluna exibem o título da tarefa. Ao clicar no link "Mais", a célula se expande para mostrar a descrição da tarefa. Links no cabeçalho da tabela permitem também expandir ou recolher todas as descrições simultaneamente.
- **Botões de ação:** No cabeçalho, há um botão para **deletar todas as as tarefas**. Já nas linhas individuais, há há botôes **editar** (que põe a linha em "modo de edição" para alteração dos dados) e **deletar tarefa** (que deleta aquela linha)
>O id (chave primária) da tarefa não é exibido explicitamente na linha, mas armazenado como id da linha da tabela (TR)


## POSSIBILIDADES
Algumas mudanças no aplicativo cogitadas para o futuro:

***Cadastros de usuários e departamentos/equipes***
- Relacionados com a tabela de tarefas, permitindo formas mais completas de gerenciamento. 

***Tabela de tarefas***
- Criar controles no cabeçalho para filtragem por status de conclusão, prazo, responsável etc.
- Implementar subtarefas/ tarefas dependentes (autorrelacionamento).
- Atributo "Prioridade" (nivel de urgencia).

## COMO EXECUTAR

Fazer o download do projeto e abrir o arquivo index.html no seu browser.