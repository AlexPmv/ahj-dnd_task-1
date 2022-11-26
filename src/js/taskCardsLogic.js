export default class TaskCardsLogic {
  static getTasksFromLocalStorage() {
    if (!localStorage.tasks) {
      localStorage.tasks = '[]';
    }

    return JSON.parse(localStorage.tasks);
  }

  static writeTaskToLocalStorage(taskObj) {
    const currentTasksList = TaskCardsLogic.getTasksFromLocalStorage();

    currentTasksList.push(taskObj);

    localStorage.tasks = JSON.stringify(currentTasksList);

    TaskCardsLogic.renderTaskHTML(taskObj);
  }

  static renderTasksFromLocalStorage() {
    TaskCardsLogic.getTasksFromLocalStorage().forEach((taskObj) => {
      TaskCardsLogic.renderTaskHTML(taskObj);
    });
  }

  static removeFromLocalStorage(targetEl) {
    const taskIdToRemove = targetEl.dataset.taskId;
    const currentTaskArray = TaskCardsLogic.getTasksFromLocalStorage();
    const newTaskArray = currentTaskArray.filter((task) => task.taskId !== taskIdToRemove);

    localStorage.tasks = JSON.stringify(newTaskArray);
  }

  static generateTaskId() {
    const taskIdArray = [];

    TaskCardsLogic.getTasksFromLocalStorage().forEach((taskObj) => {
      if (taskObj) {
        taskIdArray.push(taskObj.taskId);
      }
    });

    let i = 1;
    while (taskIdArray.includes(i)) {
      i++;
    }

    return i;
  }

  static renderTaskHTML(taskObj) {
    const currentList = document.querySelector(`[data-list-name="${taskObj.listName}"]`);

    const taskContainer = document.createElement('div');
    const taskHeader = document.createElement('h4');
    const taskClose = document.createElement('a');

    taskContainer.className = 'task-container';
    taskContainer.dataset.taskId = taskObj.taskId;

    taskHeader.className = 'task-header';
    taskHeader.textContent = taskObj.taskText;

    taskClose.className = 'task-close';
    taskClose.innerHTML = '&#9587;';

    let targetTask = null;
    let xGap = null;
    let yGap = null;
    let closestTask = null;
    let taskList = null;
    let ghostTask = null;

    taskContainer.addEventListener('mousedown', (e) => {
      e.preventDefault();
      const { currentTarget } = e;

      if (e.target.classList.contains('task-close')) {
        currentTarget.onmouseup = null;
        currentTarget.addEventListener('mouseup', () => {
          TaskCardsLogic.removeFromLocalStorage(currentTarget);
          currentTarget.remove();
        });
      }

      targetTask = e.currentTarget;
      const ghostTaskToRemove = document.querySelector('.ghost-task');
      if (ghostTaskToRemove) {
        ghostTaskToRemove.remove();
      }

      const taskWidth = targetTask.offsetWidth;
      const taskHeight = targetTask.offsetHeight;
      const { x, y } = targetTask.getBoundingClientRect();
      xGap = e.pageX - x;
      yGap = e.pageY - y;

      targetTask.style.width = `${taskWidth}px`;
      targetTask.style.height = `${taskHeight}px`;
      targetTask.style.left = `${x}px`;
      targetTask.style.top = `${y}px`;

      [closestTask, taskList] = TaskCardsLogic.getClosestEls(e);

      ghostTask = document.createElement('div');
      ghostTask.className = 'task-container ghost-task';
      ghostTask.style.height = targetTask.style.height;

      if (taskList) {
        taskList.insertBefore(ghostTask, targetTask);
      }

      targetTask.classList.add('dragged');

      if (closestTask) {
        taskList.insertBefore(ghostTask, closestTask);
      }

      document.body.appendChild(targetTask);
    });

    taskContainer.addEventListener('mousemove', (e) => {
      e.preventDefault();
      if (!targetTask) {
        return;
      }

      [closestTask, taskList] = TaskCardsLogic.getClosestEls(e);

      if (taskList && closestTask) {
        TaskCardsLogic.removeGhostTasks();

        ghostTask = document.createElement('div');
        ghostTask.className = 'task-container ghost-task';
        ghostTask.style.height = targetTask.style.height;

        TaskCardsLogic.plantElement(e, ghostTask, closestTask);
      }

      if (taskList && !taskList.querySelector('.task-header')) {
        TaskCardsLogic.removeGhostTasks();

        ghostTask = document.createElement('div');
        ghostTask.className = 'task-container ghost-task';
        ghostTask.style.height = targetTask.style.height;
        taskList.appendChild(ghostTask);
      }

      targetTask.style.left = `${e.pageX - xGap}px`;
      targetTask.style.top = `${e.pageY - yGap}px`;
    });

    taskContainer.addEventListener('mouseleave', (e) => {
      e.preventDefault();
      if (!targetTask) {
        return;
      }

      targetTask = null;
    });

    taskContainer.addEventListener('mouseup', (e) => {
      e.preventDefault();

      if (!targetTask) {
        return;
      }

      [closestTask, taskList] = TaskCardsLogic.getClosestEls(e);

      targetTask.style.top = 0;
      targetTask.style.left = 0;
      targetTask.classList.remove('dragged');
      const { width } = targetTask.getBoundingClientRect();
      targetTask.style.width = width;

      if (taskList && closestTask) {
        targetTask.style.width = '100%';
        TaskCardsLogic.plantElement(e, targetTask, closestTask);
      }

      if (taskList && !closestTask) {
        TaskCardsLogic.plantElement(e, targetTask, ghostTask);
      }

      TaskCardsLogic.removeGhostTasks();
      if (targetTask.closest('.task-lists-container')) {
        targetTask.style.width = '100%';
      }
      targetTask = null;

      const allTasks = document.querySelectorAll('.task-container');
      const newLocalStorageArray = [];

      for (const task of allTasks) {
        const taskListWrp = task.closest('.task-list__wrapper');

        let currentTaskObj;

        if (taskListWrp) {
          currentTaskObj = {
            listName: taskListWrp.querySelector('.task-list__header').textContent,
            taskText: task.querySelector('.task-header').textContent,
            taskId: task.dataset.taskId,
          };
        }

        newLocalStorageArray.push(currentTaskObj);
      }

      localStorage.tasks = JSON.stringify(newLocalStorageArray);
    });

    taskContainer.appendChild(taskHeader);
    taskContainer.appendChild(taskClose);

    currentList.appendChild(taskContainer);
  }

  static removeGhostTasks() {
    const ghostTasksToRemove = document.querySelectorAll('.ghost-task');

    if (ghostTasksToRemove) {
      for (const el of ghostTasksToRemove) { el.remove(); }
    }
  }

  static getClosestEls(e) {
    const closestEls = Array.from(document.elementsFromPoint(e.clientX, e.clientY));
    const taskListWrp = closestEls.find((el) => el.className === 'task-list__wrapper');
    const closestTask = closestEls.find((el) => el.className === 'task-container');
    let taskList = null;

    if (taskListWrp) {
      taskList = taskListWrp.querySelector('.task-list');
    }

    return [closestTask, taskList];
  }

  static plantElement(e, el, closestEl) {
    const closestElHeight = closestEl.offsetHeight;
    const { y } = closestEl.getBoundingClientRect();
    const eY = e.pageY;

    if (eY < y + (closestElHeight / 2) && eY > y) {
      closestEl.insertAdjacentElement('beforebegin', el);
    }

    if (eY > y + (closestElHeight / 2) && eY < y + closestElHeight) {
      closestEl.insertAdjacentElement('afterend', el);
    }
  }
}
