document.addEventListener("DOMContentLoaded", () => {
  const signNav = document.querySelector(".signNav");
  const registerBtn = document.querySelector(".registerBtn");
  const loginBtn = document.querySelector(".loginBtn");
  const logoutBtn = document.querySelector(".logout");
  const dashboard = document.querySelector(".dashboard");
  const landing = document.querySelector(".landing");
  const landingSpan = document.querySelector(".landingSpan");
  const addTaskBtn = document.querySelector(".addTaskBtn");
  const taskList = document.querySelector(".list");
  const authBackdrop = document.querySelector(".auth");
  const registerForm = document.querySelector(".register");
  const loginForm = document.querySelector(".login");
  const registerNav = signNav.children[0];
  const loginNav = signNav.children[1];
  const toastBackdrop = document.querySelector(".toastBackdrop");
  const taskBackdrop = document.querySelector(".taskBackdrop");
  const searchBox = document.querySelector("#search");

  // Show the dashboard
  const showDashboard = () => {
    landing.style.display = "none";
    dashboard.style.display = "flex";

    //-----------------Greating-----------------------//
    const date = new Date();
    let hours = date.getHours();
    let greeting;
    if (hours < 12) {
      greeting = "Morning";
    } else if (hours >= 12 && hours < 18) {
      greeting = "Afternoon";
    } else if (hours >= 18) {
      greeting = "Evening";
    }
    document.querySelector(
      ".right"
    ).firstElementChild.textContent = `Good ${greeting},`;
  };

  // Show the landing page
  const showLanding = () => {
    landing.style.display = "flex";
    dashboard.style.display = "none";
  };

  // Initialize the application by checking if the user is logged in
  const initializeApp = () => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      showDashboard();
      loadTasks(currentUser);
      displayUsername();
    } else {
      showLanding();
    }
  };

  // Register button and login button event listeners
  landing.addEventListener("click", (e) => {
    if (e.target === landingSpan || e.target === registerNav) {
      authBackdrop.style.display = "flex";
      registerForm.style.display = "flex";
      loginForm.style.display = "none";
      document.querySelector("#registerName").value = "";
      document.querySelector("#registerPassword").value = "";
      document.querySelector("#confirmPassword").value = "";
    } else if (e.target === loginNav) {
      authBackdrop.style.display = "flex";
      loginForm.style.display = "flex";
      registerForm.style.display = "none";
      document.querySelector("#loginName").value = "";
      document.querySelector("#loginPassword").value = "";
    } else if (e.target === authBackdrop) {
      authBackdrop.style.display = "none";
    }
  });

  document.querySelectorAll(".cancelBtn").forEach((cancel) => {
    cancel.onclick = () => {
      authBackdrop.style.display = "none";
    };
  });

  // Register function
  const register = () => {
    const username = document.querySelector("#registerName").value.trim();
    const password = document.querySelector("#registerPassword").value.trim();
    const confirmPassword = document
      .querySelector("#confirmPassword")
      .value.trim();

    if (username === "" || password === "" || confirmPassword === "") {
      alert("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || {};

    if (users[username]) {
      alert("User already exists");
      return;
    }

    users[username] = { password: password, tasks: [] };
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registration Successful");

    localStorage.setItem("currentUser", username);
    showDashboard();
    loadTasks(username);
    displayUsername();
  };

  registerBtn.onclick = () => {
    register();
  };

  // Login function
  const login = () => {
    const username = document.querySelector("#loginName").value.trim();
    const password = document.querySelector("#loginPassword").value.trim();

    if (username === "" || password === "") {
      alert("Please fill in all fields");
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || {};

    if (!users[username] || users[username].password !== password) {
      alert("Invalid username or password");
      return;
    }

    localStorage.setItem("currentUser", username);
    showDashboard();
    loadTasks(username);
    displayUsername();
  };

  loginBtn.onclick = () => {
    login();
  };

  const displayUsername = () => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      document.querySelector(".right").children[1].textContent = currentUser;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("currentUser");
    showLanding();
    authBackdrop.style.display = "none";
  };

  logoutBtn.onclick = () => {
    logout();
  };

  // Add Task function
  document.querySelector(".fi-sr-plus").onclick = () => {
    taskBackdrop.style.display = "flex";
  };
  const addTask = () => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) return;

    const taskInput = document.querySelector("#taskInput");
    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    const date = new Date();
    const timestamp = date.toLocaleString();

    let task = {
      text: taskText,
      timestamp: timestamp,
      completed: false,
    };

    let users = JSON.parse(localStorage.getItem("users"));
    users[currentUser].tasks.push(task);
    localStorage.setItem("users", JSON.stringify(users));
    taskInput.value = "";
    loadTasks(currentUser);
    updateTaskCount();
    taskBackdrop.style.display = "none";
  };

  addTaskBtn.onclick = () => {
    addTask();
  };
  addTaskBtn.nextElementSibling.onclick = () => {
    taskBackdrop.style.display = "none";
  };

  // Load Tasks function
  function loadTasks(username) {
    const users = JSON.parse(localStorage.getItem("users")) || {};
    const tasks = users[username].tasks || [];

    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
      const taskItem = document.createElement("li");
      taskItem.innerHTML = `
       <i class="fi ${
         task.completed ? "fi-br-checkbox checked" : "fi-br-square"
       }"></i>
      <div class="text">
        <p class="${task.completed ? "cross" : ""}">${task.text}</p>
          <p>${task.timestamp}</p>
        </div>
        <i class="fi fi-br-trash"></i>`;

      taskList.appendChild(taskItem);

      taskItem
        .querySelector(".fi-br-square, .fi-br-checkbox")
        .addEventListener("click", (e) => {
          let users = JSON.parse(localStorage.getItem("users"));
          const currentUser = localStorage.getItem("currentUser");
          if (e.target.classList.contains("fi-br-square")) {
            e.target.classList.remove("fi-br-square");
            e.target.classList.add("fi-br-checkbox", "checked");
            taskItem.querySelector("p").classList.add("cross");
            users[currentUser].tasks[index].completed = true;
          } else {
            e.target.classList.remove("fi-br-checkbox", "checked");
            e.target.classList.add("fi-br-square");
            taskItem.querySelector("p").classList.remove("cross");
            users[currentUser].tasks[index].completed = false;
          }

          localStorage.setItem("users", JSON.stringify(users));
          updateTaskCount();
        });

      // Handle task deletion
      taskItem.querySelector(".fi-br-trash").onclick = () => {
        toastBackdrop.style.display = "flex";
        document.querySelector(".delOptions").children[0].onclick = () => {
          deleteTask(index);
          toastBackdrop.style.display = "none";
        };
        updateTaskCount();
      };
      document.querySelector(".delOptions").children[1].onclick = () => {
        toastBackdrop.style.display = "none";
      };
    });
    updateTaskCount();
  }

  // Delete Task function
  function deleteTask(taskIndex) {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) return;

    let users = JSON.parse(localStorage.getItem("users"));
    users[currentUser].tasks.splice(taskIndex, 1);
    localStorage.setItem("users", JSON.stringify(users));
    loadTasks(currentUser);
    updateTaskCount();
  }

  // Update task count

  function updateTaskCount() {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) return;

    const users = JSON.parse(localStorage.getItem("users")) || {};
    const tasks = users[currentUser].tasks || [];

    const uncompletedTasks = tasks.filter((task) => !task.completed).length;
    document.querySelector(".taskNum").textContent = uncompletedTasks;
    document.querySelector(
      ".title"
    ).innerHTML = `<h2>${currentUser}: <span>${uncompletedTasks}</span> Tasks</h2>`;
  }

  //------------------search function----------------//
  searchBox.addEventListener("keyup", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const tasks = taskList.querySelectorAll("li");
    tasks.forEach((task) => {
      const taskTitle =
        task.children[1].firstElementChild.textContent.toLowerCase();
      if (taskTitle.indexOf(searchTerm) != -1) {
        task.style.display = "flex";
      } else {
        task.style.display = "none";
      }
    });
  });

  // Initialize the application
  initializeApp();
});
