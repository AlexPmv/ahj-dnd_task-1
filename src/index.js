import './css/style.css';
import TaskCardCreate from './js/taskCardCreate';
import TaskCardsLogic from './js/taskCardsLogic';

document.addEventListener('DOMContentLoaded', () => {
  TaskCardsLogic.renderTasksFromLocalStorage();

  const taskListNodes = document.querySelectorAll('.task-list__wrapper');

  for (const node of taskListNodes) {
    node.addEventListener('click', (e) => {
      const newCardEl = document.querySelector('.new-card-container');

      if (e.target.classList.contains('task-add-link')) {
        TaskCardCreate.callAddCardForm(e.target);
      }

      if (newCardEl && e.target.classList.contains('task-add-link')) {
        return;
      }

      if (newCardEl && e.target.classList.contains('new-card-close')) {
        newCardEl.remove();
      }

      if (newCardEl && e.target.classList.contains('new-card-add')) {
        const taskObj = {
          listName: newCardEl.closest('.task-list').dataset.listName,
          taskText: (newCardEl.querySelector('.new-card-text').value).trim(),
          taskId: TaskCardsLogic.generateTaskId(),
        };

        TaskCardsLogic.writeTaskToLocalStorage(taskObj);

        newCardEl.remove();
      }
    });
  }
});
