document.addEventListener("DOMContentLoaded", () => {
  const screen = document.querySelector(".taskScreen");
  const logo = document.querySelectorAll(".logo")[1];
  const sss = document.querySelector(".fi-rr-search");
  const homeTasks = document.querySelector("#home > .list");
  const boxes = document.querySelectorAll(".fi-br-square");
  const delIcons = document.querySelectorAll(".fi-br-trash");
  const backdrop = document.querySelector(".toastBackdrop");
  const delBtn = backdrop.querySelector(".delOptions").children[0];
  const delCancel = backdrop.querySelector(".delOptions").children[1];
  const registerBtn = document.querySelector(".registerBtn");
  const loginBtn = document.querySelector(".loginBtn");
  const logoutBtn = document.querySelector(".logout");
  const dashboard = document.querySelector(".dashboard");
  const landing = document.querySelector(".landing");
  const addTaskBtn = document.querySelector(".addTaskBtn");
  // let totalTasks =
  //   personalTasks.children.length +
  //   workTasks.children.length +
  //   socialTasks.children.length +
  //   shoppingTasks.children.length +
  //   schoolTasks.children.length +
  //   workTasks.children.length;
  //---------------Task num------------------//

  // document.querySelector("#home > ul > li:nth-child(1)");

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
    const taskText = taskInput.ariaValueMax.trim();
    if (taskText === "") return;
    const date = new Date();
    const timestamp = date.toLocaleString();
    const task = {
      text: taskText,
      timestamp: timestamp,
      completed: false,
    };
    let users = JSON.parse(localStorage.getItem("users"));
    users[currentUser].tasks.push(task);
    localStorage.setItem("users", JSON.stringify(users));
    taskInput.value = "";
    loadTasks(currentUser);
    document.querySelector(".taskBackdrop").style.display = "none";
  };
  document.querySelector(".taskBackdrop").addEventListener("click", (e) => {
    if (
      e.target == document.querySelector(".taskBackdrop") ||
      e.target == document.querySelector(".cancelAddTask")
    ) {
      document.querySelector(".taskBackdrop").style.display = "none";
    }
  });
  addTaskBtn.onclick = () => {
    addTask();
  };

  //-----------------Load Tasks-------------------//
  function loadTasks(username) {
    const users = JSON.parse(localStorage.getItem("users")) || {};
    const tasks = users[username].tasks || [];

    homeTasks.innerHTML = "";

    let homeTaskCount = 0;

    tasks.forEach((task, index) => {
      const taskItem = document.createElement("li");
      taskItem.innerHTML = `<i class="${
        task.completed ? "fi fi-br-checkbox" : "fi fi-br-square"
      }"></i>
      <div class="text">
        <p>${task.text}</p>
        <p>${task.timestamp}</p>
      </div>
      <i class="fi fi-br-trash"></i>`;
      if (!task.completed) {
        homeTaskCount++;
      }
      delBtn.onclick = () => {
        backdrop.style.display = "none";
        deleteTask(index);
      };
      homeTasks.appendChild(taskItem.cloneNode(true));
    });

    //--------------Number Of Tasks Update---------------//
    document.querySelector(
      ".title"
    )[0].innerHTML = `All tasks: <span class="homeTaskCount">${homeTaskCount}</span>`;
    document.querySelector(".taskNum").textContent = `${homeTaskCount}`;
  }

  //----------------checkbox style
  boxes.forEach((box) => {
    let checked = false;
    box.onclick = () => {
      toggleTask(index);
      if (!checked) {
        box.classList.add("checked");
        box.nextElementSibling.children[0].classList.add("cross");
      } else {
        box.classList.remove("checked");
        box.nextElementSibling.children[0].classList.remove("cross");
      }
      checked = !checked;
    };
  });

  //----------------Toggle Task-----------------//
  function toggleTask(taskIndex) {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) return;

    let users = JSON.parse(localStorage.getItem("users"));
    let task = users[currentUser].tasks[taskIndex];
    task.completed = !task.completed;

    localStorage.setItem("users", JSON.stringify(users));
    loadTasks(currentUser);
  }

  //--------------Delete Tasks-------------------//
  function deleteTask(taskIndex) {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) return;

    let users = JSON.parse(localStorage.getItem("users"));
    let task = users[currentUser].tasks[taskIndex];

    users[currentUser].tasks.splice(taskIndex, 1);
    localStorage.setItem("users", JSON.stringify(users));
    loadTasks(currentUser);
  }

  //--------------Decrease Task Count-------------------//
  function decrementTaskCount(category) {
    // Decrement the overall task count
    let homeTaskCount = parseInt(
      document.querySelector(".homeTaskCount").textContent
    );
    homeTaskCount--;
    document.querySelector(".homeTaskCount").textContent = homeTaskCount;
  }
  // Decrement the category-specific task count

  //--------------Logo to HomeScreen-------------------//

  //------------------Sidebar Navigation----------------//

  //----------Checkbox & Number Of Tasks Update-----------//
  // boxes.forEach((box) => {
  //   let checked = false;
  //   box.onclick = () => {
  //     if (!checked) {
  //       box.classList.add("fi-br-checkbox", "checked");
  //       box.classList.remove("fi-br-square");
  //       box.nextElementSibling.children[0].classList.add("cross");
  //       homeTasks--;
  //       box.parentElement.parentElement.children.length--;
  //     } else {
  //       box.classList.remove("fi-br-checkbox", "checked");
  //       box.classList.add("fi-br-square");
  //       box.nextElementSibling.children[0].classList.remove("cross");
  //       totalTasks++;
  //       box.parentElement.parentElement.children.length++;
  //     }

  //     box.parentElement.parentElement.previousElementSibling.textContent = `Personal Tasks (${catNum})`;

  //     //------------------Title Update-------------//
  //     // document.querySelector(
  //     //   "#home > .title"
  //     // ).textContent = `All Tasks (${totalTasks})`;
  //     // document.querySelector(
  //     //   "#personal > .title"
  //     // ).textContent = `Personal Tasks (${cattt})`;
  //     // document.querySelector(
  //     //   "#work > .title"
  //     // ).textContent = `All Tasks (${catNum})`;
  //     // document.querySelector(
  //     //   "#social > .title"
  //     // ).textContent = `All Tasks (${socialTasks.children.length})`;
  //     // document.querySelector(
  //     //   "#shopping > .title"
  //     // ).textContent = `All Tasks (${shoppingTasks.children.length})`;
  //     // document.querySelector(
  //     //   "#school > .title"
  //     // ).textContent = `All Tasks (${schoolTasks.children.length})`;
  //     // document.querySelector(
  //     //   "#workout > .title"
  //     // ).textContent = `All Tasks (${workTasks.children.length})`;
  //     document.querySelector(".right").querySelector("span").textContent =
  //       totalTasks;
  //     checked = !checked;
  //   };
  // });

  //------Delete & Toast & Number Of Tasks Update-------//
  // delIcons.forEach((delIcon) => {
  //   delIcon.onclick = () => {
  //     backdrop.style.display = "flex";
  //     (delCancel || backdrop).onclick = () => {
  //       backdrop.style.display = "none";
  //     };
  //     // delBtn.onclick = () => {
  //     //   backdrop.style.display = "none";
  //     //   delIcon.parentElement.parentElement.removeChild(delIcon.parentElement);
  //     //   if (
  //     //     delIcon.previousElementSibling.previousElementSibling.className.includes(
  //     //       "checked"
  //     //     )
  //     //   ) {
  //     //     num = num;
  //     //   } else {
  //     //     num--;
  //     //   }
  //     //   document.querySelector(".title").textContent = `All Tasks (${num})`;
  //     //   document.querySelector(".right").querySelector("span").textContent =
  //     //     num;
  //     // };
  //     backdrop.addEventListener("click", (e) => {
  //       if (e.target == backdrop) {
  //         backdrop.style.display = "none";
  //       }
  //     });
  //   };
  // });
});
