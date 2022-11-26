(()=>{"use strict";class e{static createHTMLPattern(){const e=document.createElement("div"),t=document.createElement("textarea"),s=document.createElement("button"),a=document.createElement("a");return e.className="new-card-container",t.className="new-card-text",t.rows="3",s.className="new-card-add",s.textContent="Add",a.className="new-card-close",a.href="#0",a.innerHTML="&#9587;",e.appendChild(t),e.appendChild(s),e.appendChild(a),e}static callAddCardForm(t){t.closest(".task-list__wrapper").querySelector(".task-list").appendChild(e.createHTMLPattern())}}class t{static getTasksFromLocalStorage(){return localStorage.tasks||(localStorage.tasks="[]"),JSON.parse(localStorage.tasks)}static writeTaskToLocalStorage(e){const s=t.getTasksFromLocalStorage();s.push(e),localStorage.tasks=JSON.stringify(s),t.renderTaskHTML(e)}static renderTasksFromLocalStorage(){t.getTasksFromLocalStorage().forEach((e=>{t.renderTaskHTML(e)}))}static removeFromLocalStorage(e){const s=e.dataset.taskId,a=t.getTasksFromLocalStorage().filter((e=>e.taskId!==s));localStorage.tasks=JSON.stringify(a)}static generateTaskId(){const e=[];t.getTasksFromLocalStorage().forEach((t=>{t&&e.push(t.taskId)}));let s=1;for(;e.includes(s);)s++;return s}static renderTaskHTML(e){const s=document.querySelector(`[data-list-name="${e.listName}"]`),a=document.createElement("div"),n=document.createElement("h4"),r=document.createElement("a");a.className="task-container",a.dataset.taskId=e.taskId,n.className="task-header",n.textContent=e.taskText,r.className="task-close",r.innerHTML="&#9587;";let o=null,l=null,c=null,d=null,i=null,m=null;a.addEventListener("mousedown",(e=>{e.preventDefault();const{currentTarget:s}=e;e.target.classList.contains("task-close")&&(s.onmouseup=null,s.addEventListener("mouseup",(()=>{t.removeFromLocalStorage(s),s.remove()}))),o=e.currentTarget;const a=document.querySelector(".ghost-task");a&&a.remove();const n=o.offsetWidth,r=o.offsetHeight,{x:u,y:g}=o.getBoundingClientRect();l=e.pageX-u,c=e.pageY-g,o.style.width=`${n}px`,o.style.height=`${r}px`,o.style.left=`${u}px`,o.style.top=`${g}px`,[d,i]=t.getClosestEls(e),m=document.createElement("div"),m.className="task-container ghost-task",m.style.height=o.style.height,i&&i.insertBefore(m,o),o.classList.add("dragged"),d&&i.insertBefore(m,d),document.body.appendChild(o)})),a.addEventListener("mousemove",(e=>{e.preventDefault(),o&&([d,i]=t.getClosestEls(e),i&&d&&(t.removeGhostTasks(),m=document.createElement("div"),m.className="task-container ghost-task",m.style.height=o.style.height,t.plantElement(e,m,d)),i&&!i.querySelector(".task-header")&&(t.removeGhostTasks(),m=document.createElement("div"),m.className="task-container ghost-task",m.style.height=o.style.height,i.appendChild(m)),o.style.left=e.pageX-l+"px",o.style.top=e.pageY-c+"px")})),a.addEventListener("mouseleave",(e=>{e.preventDefault(),o&&(o=null)})),a.addEventListener("mouseup",(e=>{if(e.preventDefault(),!o)return;[d,i]=t.getClosestEls(e),o.style.top=0,o.style.left=0,o.classList.remove("dragged");const{width:s}=o.getBoundingClientRect();o.style.width=s,i&&d&&(o.style.width="100%",t.plantElement(e,o,d)),i&&!d&&t.plantElement(e,o,m),t.removeGhostTasks(),o.closest(".task-lists-container")&&(o.style.width="100%"),o=null;const a=document.querySelectorAll(".task-container"),n=[];for(const e of a){const t=e.closest(".task-list__wrapper");let s;t&&(s={listName:t.querySelector(".task-list__header").textContent,taskText:e.querySelector(".task-header").textContent,taskId:e.dataset.taskId}),n.push(s)}localStorage.tasks=JSON.stringify(n)})),a.appendChild(n),a.appendChild(r),s.appendChild(a)}static removeGhostTasks(){const e=document.querySelectorAll(".ghost-task");if(e)for(const t of e)t.remove()}static getClosestEls(e){const t=Array.from(document.elementsFromPoint(e.clientX,e.clientY)),s=t.find((e=>"task-list__wrapper"===e.className)),a=t.find((e=>"task-container"===e.className));let n=null;return s&&(n=s.querySelector(".task-list")),[a,n]}static plantElement(e,t,s){const a=s.offsetHeight,{y:n}=s.getBoundingClientRect(),r=e.pageY;r<n+a/2&&r>n&&s.insertAdjacentElement("beforebegin",t),r>n+a/2&&r<n+a&&s.insertAdjacentElement("afterend",t)}}document.addEventListener("DOMContentLoaded",(()=>{t.renderTasksFromLocalStorage();const s=document.querySelectorAll(".task-list__wrapper");for(const a of s)a.addEventListener("click",(s=>{const a=document.querySelector(".new-card-container");if(s.target.classList.contains("task-add-link")&&e.callAddCardForm(s.target),(!a||!s.target.classList.contains("task-add-link"))&&(a&&s.target.classList.contains("new-card-close")&&a.remove(),a&&s.target.classList.contains("new-card-add"))){const e={listName:a.closest(".task-list").dataset.listName,taskText:a.querySelector(".new-card-text").value.trim(),taskId:t.generateTaskId()};t.writeTaskToLocalStorage(e),a.remove()}}))}))})();