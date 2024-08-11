// script.js

document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskButton = document.getElementById('add-task');
    const searchInput = document.getElementById('search-input');
    const taskList = document.getElementById('task-list');
    const toggleThemeButton = document.getElementById('toggle-theme');
    const filterAllButton = document.getElementById('filter-all');
    const filterCompletedButton = document.getElementById('filter-completed');
    const filterActiveButton = document.getElementById('filter-active');

    const teamModal = document.getElementById('team-modal');
    const teamInput = document.getElementById('team-input');
    const projectInput = document.getElementById('project-input');
    const saveTeamInfoButton = document.getElementById('save-team-info');
    const teamList = document.getElementById('team-list');
    const projectList = document.getElementById('project-list');
    const sidebar = document.getElementById('sidebar');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || []; // 로컬 스토리지에서 할 일 불러오기

    // 팀 정보 확인
    const teamInfo = sessionStorage.getItem('teamInfo'); // 세션 스토리지에서 팀 정보 가져오기

    if (!teamInfo) {
        teamModal.style.display = "block"; // 팀 정보 모달 열기
    } else {
        const { teamName, projectName } = JSON.parse(teamInfo); // 세션 스토리지에서 팀 정보 가져오기
        if (teamName) {
            const teamItem = document.createElement('li');
            teamItem.textContent = teamName;
            teamList.appendChild(teamItem);
        }
        if (projectName) {
            const projectItem = document.createElement('li');
            projectItem.textContent = projectName;
            projectList.appendChild(projectItem);
        }
        sidebar.style.display = "block"; // 사이드바 표시
    }

    saveTeamInfoButton.addEventListener('click', () => {
        const teamName = teamInput.value.trim();
        const projectName = projectInput.value.trim();

        if (teamName || projectName) {
            const teamInfo = { teamName, projectName };
            sessionStorage.setItem('teamInfo', JSON.stringify(teamInfo)); // 세션 스토리지에 팀 정보 저장

            // 팀 및 프로젝트 리스트 업데이트
            if (teamName) {
                const teamItem = document.createElement('li');
                teamItem.textContent = teamName;
                teamList.appendChild(teamItem);
            }

            if (projectName) {
                const projectItem = document.createElement('li');
                projectItem.textContent = projectName;
                projectList.appendChild(projectItem);
            }
            sidebar.style.display = "block"; // 사이드바 표시
            teamModal.style.display = "none"; // 모달 닫기
        }
    });

    addTaskButton.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            addTaskToDOM(taskText, false); // 새로운 할 일을 추가
            tasks.push({ text: taskText, completed: false, dueDate: '' }); // 할 일 목록에 추가
            localStorage.setItem('tasks', JSON.stringify(tasks)); // 로컬 스토리지에 저장
            taskInput.value = '';
        }
    });

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredTasks = tasks.filter(task => task.text.toLowerCase().includes(searchTerm));
        renderTasks(filteredTasks); // 검색된 항목만 렌더링
    });

    filterAllButton.addEventListener('click', () => {
        renderTasks(tasks); // 모든 할 일 렌더링
    });

    filterCompletedButton.addEventListener('click', () => {
        const completedTasks = tasks.filter(task => task.completed);
        renderTasks(completedTasks); // 완료된 항목만 렌더링
    });

    filterActiveButton.addEventListener('click', () => {
        const activeTasks = tasks.filter(task => !task.completed);
        renderTasks(activeTasks); // 미완료된 항목만 렌더링
    });

    toggleThemeButton.addEventListener('click', () => {
        document.body.classList.toggle('dark'); // 다크 클래스 토글
        document.querySelector('.container').classList.toggle('dark'); // 컨테이너 클래스 토글
        document.querySelectorAll('button').forEach(button => button.classList.toggle('dark')); // 버튼 클래스 토글
    });

    function addTaskToDOM(taskText, isCompleted = false, dueDate = '') {
        const li = document.createElement('li');
        li.classList.toggle('completed', isCompleted); // 완료 상태 클래스 추가

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = isCompleted; // 체크 상태 설정
        checkbox.addEventListener('change', () => {
            li.classList.toggle('completed'); // 클래스 토글로 스타일 적용
            isCompleted = !isCompleted; // 완료 상태 업데이트
            tasks[tasks.indexOf(taskText)].completed = isCompleted; // 배열에서 상태 업데이트
            localStorage.setItem('tasks', JSON.stringify(tasks)); // 로컬 스토리지 업데이트
        });

        li.appendChild(checkbox); // 체크박스를 리스트 항목에 추가
        li.appendChild(document.createTextNode(taskText)); // 할 일 텍스트 추가

        const dueDateInput = document.createElement('input');
        dueDateInput.type = 'date';
        dueDateInput.value = dueDate; // 초기 마감 날짜 설정
        dueDateInput.addEventListener('change', () => {
            const selectedDate = dueDateInput.value;
            tasks[tasks.indexOf(taskText)].dueDate = selectedDate; // 선택된 날짜를 할 일에 저장
            localStorage.setItem('tasks', JSON.stringify(tasks)); // 로컬 스토리지 업데이트
            renderTasks(tasks); // 전체 목록 렌더링
        });
        
        li.appendChild(dueDateInput); // 마감 날짜 입력 추가

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '삭제';
        deleteButton.addEventListener('click', () => {
            tasks.splice(tasks.indexOf(taskText), 1); // 배열에서 삭제
            localStorage.setItem('tasks', JSON.stringify(tasks)); // 로컬 스토리지 업데이트
            renderTasks(tasks); // 전체 목록 렌더링
        });

        li.appendChild(deleteButton); // 삭제 버튼 추가

        taskList.appendChild(li); // 할 일 목록에 항목 추가
    }

    function renderTasks(tasksToRender) {
        taskList.innerHTML = ''; // 기존 목록 초기화
        tasksToRender.forEach(task => addTaskToDOM(task.text, task.completed, task.dueDate)); // 필터링된 할 일 렌더링
    }

    document.querySelectorAll('.close').forEach(closeButton => {
        closeButton.addEventListener('click', () => {
            teamModal.style.display = "none"; // 팀 모달 닫기
        });
    });
});
