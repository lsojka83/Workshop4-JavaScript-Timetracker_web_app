const apikey = 'enter key';
const apihost = 'enter URL';

document.addEventListener('DOMContentLoaded', function () {
    apiListTasks().then(
        function (response) {

            // "response" zawiera obiekt z kluczami "error" i "data" (zob. wyżej)
            // "data" to tablica obiektów-zadań
            // uruchamiamy funkcję renderTask dla każdego zadania jakie dał nam backend
            response.data.forEach(
                function (task) {
                    renderTask(task.id, task.title, task.description, task.status);
                }
            );
        }
    );

    const form = document.querySelector("form.js-task-adding-form");
    cleanFormInputs(form);
    form.addEventListener("submit", handleNewTaskSubmit);

});

function cleanFormInputs(form) {
    form.elements.title.value = "";
    form.elements.description.value = "";
}

//obsluga dodania nowego zadania
function handleNewTaskSubmit(e) {
    e.preventDefault();
    const title = this.elements.title.value;
    const description = this.elements.description.value;

        //dodanie do API i wysw. nowego zadania z API
        apiCreateTask(title, description).then(
            function (resp) {
                let task = resp.data;
                renderTask(task.id, task.title, task.description, task.status);
            }
        )
    cleanFormInputs(this);
}

function apiCreateTask(title, description) {
    return fetch(
        apihost + '/api/tasks',
        {
            headers: {
                Authorization: apikey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({title: title, description: description, status: 'open'}),
            method: 'POST'
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        }
    )
}


//obsluga zamkniecia zadania
function getHandleTaskCloseButton(taskId, title, description, section) {

    function handleTaskCloseButton(e) {

        let status = "close";

        //zmiana zadania w API
        apiUpdateTask(taskId, title, description, status).then(
            function (resp) {
                const buttonsToRemove = section.querySelectorAll("button.js-task-open-only");
                buttonsToRemove.forEach(function (btn) {
                    btn.parentElement.removeChild(btn);
                })
                const divToRemove = section.querySelector("div.js-task-open-only")
                divToRemove.parentElement.removeChild(divToRemove);
            }
        )
    }

    return handleTaskCloseButton
}

function apiUpdateTask(taskId, title, description, status) {
    return fetch(
        apihost + `/api/tasks/${taskId}`,
        {
            headers: {
                Authorization: apikey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({title: title, description: description, status: status}),
            method: 'PUT'
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd zmiany zadania! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        }
    )
}

//usuwanie zadania z serwera
function getHandleTaskDeleteButtonCallBack(taskId, section) {
    function handleTaskDeleteButton(e) {
        e.preventDefault();
        apiDeleteTask(taskId);

        //usuwanie wyswietlania na stronie
        section.parentElement.removeChild(section);
    };
    return handleTaskDeleteButton;
}

function apiDeleteTask(taskId) {
    return fetch(
        apihost + `/api/tasks/${taskId}`,
        {
            headers: {Authorization: apikey, 'Content-Type': 'application/json'},
            method: 'DELETE'
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd usuwania! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        }
    )
}

//wyswietlanie zadan
function apiListTasks() {
    return fetch(
        apihost + '/api/tasks',
        {
            headers: {Authorization: apikey}
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        }
    )
}

function apiListOperationsForTask(taskId) {
    return fetch(
        apihost + `/api/tasks/${taskId}/operations`,
        {
            headers: {Authorization: apikey}
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        }
    );
}

function renderTask(taskId, title, description, status) {
    const section = document.createElement('section');
    section.className = 'card mt-5 shadow-sm';
    document.querySelector('main').appendChild(section);

    const headerDiv = document.createElement('div');
    headerDiv.className = 'card-header d-flex justify-content-between align-items-center';
    section.appendChild(headerDiv);

    const headerLeftDiv = document.createElement('div');
    headerDiv.appendChild(headerLeftDiv);

    const h5 = document.createElement('h5');
    h5.innerText = title;
    headerLeftDiv.appendChild(h5);

    const h6 = document.createElement('h6');
    h6.className = 'card-subtitle text-muted';
    h6.innerText = description;
    headerLeftDiv.appendChild(h6);

    const headerRightDiv = document.createElement('div');
    headerDiv.appendChild(headerRightDiv);

    if (status == 'open') {
        const finishButton = document.createElement('button');
        finishButton.className = 'btn btn-dark btn-sm js-task-open-only';
        finishButton.innerText = 'Finish';
        headerRightDiv.appendChild(finishButton);

        finishButton.addEventListener("click", getHandleTaskCloseButton(taskId, title, description, section));
    }

    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-outline-danger btn-sm ml-2';
    deleteButton.innerText = 'Delete';
    headerRightDiv.appendChild(deleteButton);
    deleteButton.addEventListener('click', getHandleTaskDeleteButtonCallBack(taskId, section));

    //tworzenie listy do pokazania operacji
    const ul = document.createElement('ul');
    ul.className = "list-group list-group-flush";
    section.appendChild(ul);

    //pobieranie operacji
    apiListOperationsForTask(taskId).then(
        function (response) {
            response.data.forEach(
                function (operation) {
                    renderOperation(ul, operation.id, status, operation.description, operation.timeSpent);
                }
            );
        }
    )

    if (status == "open") {
        const opFormDiv = document.createElement("div");
        opFormDiv.className = "card-body js-task-open-only";
        section.appendChild(opFormDiv);
        const opForm = document.createElement("form");
        opFormDiv.appendChild(opForm);
        const opFormDivInner = document.createElement("div");
        opFormDivInner.className = "input-group";
        opForm.appendChild(opFormDivInner);
        const opInput = document.createElement("input");
        opInput.type = "text";
        opInput.placeholder = "Operation description";
        opInput.className = "form-control";
        opInput.minLength = 5;
        opFormDivInner.appendChild(opInput);
        const opFormInputDiv = document.createElement("div");
        opFormInputDiv.className = "input-group-append";
        opFormDivInner.appendChild(opFormInputDiv);
        const addTaskButton = document.createElement("button");
        addTaskButton.className = "btn btn-info";
        addTaskButton.innerText = "Add";
        opFormInputDiv.appendChild(addTaskButton);

        opForm.addEventListener("submit", getHandleAddOperationToTask(taskId, opInput, ul, status));
    } else {

    }
}

function renderOperation(operationsList, operationId, status, operationDescription, timeSpent) {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';

    operationsList.appendChild(li);

    const descriptionDiv = document.createElement('div');
    descriptionDiv.innerText = operationDescription;
    li.appendChild(descriptionDiv);

    const time = document.createElement('span');
    time.className = 'badge badge-success badge-pill ml-2';
    // time.innerText = timeSpent + 'm';
    time.innerText = convertTimeToHoursAndMinutes(timeSpent);
    descriptionDiv.appendChild(time);

    if (status == "open") {
        const buttonsDiv = document.createElement("div");
        li.appendChild(buttonsDiv);
        const buttonAdd15 = document.createElement("button");
        buttonAdd15.className = "btn btn-outline-success btn-sm mr-2 js-task-open-only";
        buttonAdd15.innerText = "+15m";
        buttonsDiv.appendChild(buttonAdd15);
        const buttonAdd60 = document.createElement("button");
        buttonAdd60.className = "btn btn-outline-success btn-sm mr-2 js-task-open-only";
        buttonAdd60.innerText = "+1h";
        buttonsDiv.appendChild(buttonAdd60);
        const buttonDelete = document.createElement("button");
        buttonDelete.className = "btn btn-outline-danger btn-sm js-task-open-only";
        buttonDelete.innerText = "Delete";
        buttonsDiv.appendChild(buttonDelete);

        buttonAdd15.addEventListener("click", function (e) {
                apiUpdateOperation(operationId, operationDescription,
                    parseInt(convertTimeToMinutes(time.innerText)) + 15, time);
            }
        )

        buttonAdd60.addEventListener("click", function (e) {
            apiUpdateOperation(operationId, operationDescription,
                parseInt(convertTimeToMinutes(time.innerText)) + 60, time);
        })

        buttonDelete.addEventListener("click", function (e) {
            apiDeleteOperation(operationId);
            let toDelete = e.target.parentElement.parentElement;
            toDelete.parentElement.removeChild(toDelete);
        })
    }
}

//nadpisanie czasu wykonania operacji
function apiUpdateOperation(operationId, description, timeSpent, time) {
    return fetch(
        apihost + `/api/operations/${operationId}`,
        {
            headers: {
                Authorization: apikey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                description: description,
                timeSpent: timeSpent
            }),
            method: 'PUT'
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd nadpisania czasu operacji! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        }
    ).then(
        function (resp) {
            time.innerText = convertTimeToHoursAndMinutes(resp.data.timeSpent);
        }
    )
}

//pobranie aktualnie zapisanego czasu wykonania operacji
function getCurrentOperationTimeSpent(operationId, time) {
    return fetch(
        apihost + `/api/operations/${operationId}`,
        {
            headers: {
                Authorization: apikey,
                'Content-Type': 'application/json'
            },
            method: 'GET'
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd pobierania czasu operacji! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        }
    ).then(
        function (resp) {
            // console.log(resp.data.timeSpent);
            // time.innerText = resp.data.timeSpent;
            return resp.data.timeSpent;
        }
    )
}

function apiDeleteOperation(operationId) {

    return fetch(
        apihost + `/api/operations/${operationId}`,
        {
            headers: {
                Authorization: apikey,
                'Content-Type': 'application/json'
            },
            method: 'DELETE'
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd pobierania czasu operacji! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        }
    ).then(
        function (resp) {
            resp.data;
        }
    )
}

function getHandleAddOperationToTask(taskId, input, ul, status) {
    function handleAddOperationToTask(e) {
        e.preventDefault();

        if (input.value !== "") {
            apiCreateOperationForTask(taskId, input.value).then(
                function (resp) {
                    renderOperation(ul, resp.data.id, status, resp.data.description, resp.data.timeSpent);
                }
            )
            input.value = "";
        }
    }

    return handleAddOperationToTask;
}

function apiCreateOperationForTask(taskId, description) {
    return fetch(
        apihost + `/api/tasks/${taskId}/operations`,
        {
            headers: {
                Authorization: apikey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({description: description, timeSpent: 0}),
            method: 'POST'
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd dodawnia operacji! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        }
    )
}

function convertTimeToHoursAndMinutes(minutes) {

    if (minutes >= 60) {
        let hours = Math.floor(parseInt(minutes) / 60);
        let leftMinuter = parseInt(minutes) % 60;
        return `${hours}h ${leftMinuter}m`;
    } else {
        return `${minutes}m`;
    }
}

function convertTimeToMinutes(time) {

    if (time.indexOf("h") >= 0) {
        let hours = time.substring(0, time.indexOf("h"));
        let minutes = time.substring(time.indexOf("h") + 2, time.indexOf("m"));
        return parseInt(hours) * 60 + parseInt(minutes);
    } else {
        let minutes = time.substring(0, time.indexOf("m"));
        return parseInt(minutes);
    }
}










