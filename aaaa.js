document.addEventListener("DOMContentLoaded", () => {
  const registerBtn = document.querySelector(".registerBtn");
  const loginBtn = document.querySelector(".loginBtn");
  const logoutBtn = document.querySelector(".logout");
  const dashboard = document.querySelector(".dashboard");
  const landing = document.querySelector(".landing");
  const addTaskBtn = document.querySelector(".addTaskBtn");
  const taskList = document.querySelector(".list");
  const unchecks = document.querySelectorAll(".fi-br-square");
  const checks = document.querySelectorAll(".fi-br-checkbox");
  //----------------showDashboard--------------------//
  const showDashboard = () => {
    landing.style.display = "none";
    dashboard.style.display = "flex";
  };

  //----------------showLanding--------------------//
  const showLanding = () => {
    landing.style.display = "block";
    dashboard.style.display = "none";
  };

  //-------------Register & Login buttons----------------//
  document.querySelector(".landing").addEventListener("click", (e) => {
    if (
      e.target == document.querySelector(".landingSpan") ||
      e.target == document.querySelector(".signNav").children[0]
    ) {
      document.querySelector(".auth").style.display = "flex";
      document.querySelector(".register").style.display = "flex";
      document.querySelector(".login").style.display = "none";
    } else if (e.target == document.querySelector(".signNav").children[1]) {
      document.querySelector(".auth").style.display = "flex";
      document.querySelector(".login").style.display = "flex";
      document.querySelector(".register").style.display = "none";
    } else if (e.target == document.querySelector(".auth")) {
      document.querySelector(".auth").style.display = "none";
    }
  });

  document.querySelectorAll(".cancelBtn").forEach((cancel) => {
    cancel.onclick = () => {
      document.querySelector(".auth").style.display = "none";
    };
  });

  //------------------Register function------------//
  const register = () => {
    const username = document.querySelector("#registerName").value.trim();
    const password = document.querySelector("#registerPassword").value.trim();
    const confirmPassword = document
      .querySelector("#confirmPassword")
      .value.trim();

    if (username === "" || password === "") {
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
  };

  registerBtn.onclick = () => {
    register();
  };

  //-----------------Login function----------------------//
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
  };

  loginBtn.onclick = () => {
    login();
  };

  //----------------Logout function--------------------//
  const logout = () => {
    localStorage.removeItem("currentUser");
    showLanding();
  };

  logoutBtn.onclick = () => {
    logout();
  };

  //-----------------Add Tasks-----------------//
  document.querySelector(".fi-sr-plus").onclick = () => {
    document.querySelector(".taskBackdrop").style.display = "flex";
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
    };

    let users = JSON.parse(localStorage.getItem("users"));
    users[currentUser].tasks.push(task);
    localStorage.setItem("users", JSON.stringify(users));
    taskInput.value = "";
    loadTasks(currentUser);
    document.querySelector(".taskBackdrop").style.display = "none";
  };

  addTaskBtn.onclick = () => {
    addTask();
  };
  addTaskBtn.nextElementSibling.onclick = () => {
    document.querySelector(".taskBackdrop").style.display = "none";
  };
  //-----------------Load Tasks-------------------//
  function loadTasks(username) {
    const users = JSON.parse(localStorage.getItem("users")) || {};
    const tasks = users[username].tasks || [];

    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
      const taskItem = document.createElement("li");
      taskItem.innerHTML = `
        <i class= "fi fi-br-square"></i>
        <div class="text">
          <p>${task.text}</p>
          <p>${task.timestamp}</p>
        </div>
        <i class="fi fi-br-trash"></i>`;

      taskList.appendChild(taskItem);

      document.querySelector(".taskNum").textContent = taskList.children.length;
      taskItem.querySelector("i").addEventListener("click", (e) => {
        if (e.target.className.includes("fi-br-square")) {
          e.target.classList.remove("fi-br-square");
          e.target.classList.add("fi-br-checkbox", "checked");
          e.target.nextElementSibling.children[0].classList.add("cross");
        } else if (e.target.className.includes("fi-br-checkbox")) {
          e.target.classList.remove("fi-br-checkbox", "checked");
          e.target.classList.add("fi-br-square");
          e.target.nextElementSibling.children[0].classList.remove("cross");
        }
      });

      // Handle task deletion
      taskItem.querySelector(".fi-br-trash").onclick = () => {
        document.querySelector(".toastBackdrop").style.display = "flex";
        document.querySelector(".delOptions").children[0].onclick = () => {
          deleteTask(index);
          document.querySelector(".toastBackdrop").style.display = "none";
        };
      };
      document.querySelector(".delOptions").children[1].onclick = () => {
        document.querySelector(".toastBackdrop").style.display = "none";
      };
    });
  }

  //--------------Delete Tasks-------------------//
  function deleteTask(taskIndex) {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) return;

    let users = JSON.parse(localStorage.getItem("users"));
    users[currentUser].tasks.splice(taskIndex, 1);
    localStorage.setItem("users", JSON.stringify(users));
    loadTasks(currentUser);
  }
});
taskList.appendChild(taskItem);
document.querySelector(".taskNum").textContent = taskList.children.length;
taskItem.querySelector(".fi-br-square").addEventListener("click", (e) => {
  e.target.classList.toggle("fi-br-checkbox");
  e.target.classList.toggle("fi-br-square");
  taskItem.querySelector("p").classList.toggle("cross");
  taskItem.querySelector("p").classList.add("cross");
  users[currentUser].tasks[index].completed = true;
  let newNum = Number(document.querySelector(".taskNum").textContent);
  if (e.target.className.includes("fi-br-checkbox")) {
    e.target.classList.add("checked");
    newNum--;
  } else {
    e.target.classList.remove("checked");
    newNum++;
  }
  document.querySelector(".taskNum").textContent = newNum;
});
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
