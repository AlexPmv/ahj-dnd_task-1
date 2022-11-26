export default class TaskCardCreate {
  static createHTMLPattern() {
    const container = document.createElement('div');
    const taskText = document.createElement('textarea');
    const addButton = document.createElement('button');
    const closeLink = document.createElement('a');

    container.className = 'new-card-container';

    taskText.className = 'new-card-text';
    taskText.rows = '3';

    addButton.className = 'new-card-add';
    addButton.textContent = 'Add';

    closeLink.className = 'new-card-close';
    closeLink.href = '#0';
    closeLink.innerHTML = '&#9587;';

    container.appendChild(taskText);
    container.appendChild(addButton);
    container.appendChild(closeLink);

    return container;
  }

  static callAddCardForm(addLinkEl) {
    const currentTaskList = addLinkEl.closest('.task-list__wrapper').querySelector('.task-list');
    currentTaskList.appendChild(TaskCardCreate.createHTMLPattern());
  }
}
