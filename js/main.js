$(function(){
    let usersCheck = getLocalStorageData("users");
    if (usersCheck.length == 0) {
      let users =
      [
       {
         "username":"admin",
         "password":"12345",
         "firstname":"Marwan",
         "lastname":"Sayed",
         "age":"27",
           "date":"2022-01-14",
         "email":"marwan.ss2595@gmail.com",
         "address":"ssss",
         "role":"admin",
         "status":true,
       },
       {
         "username":"sec",
         "password":"12345",
         "firstname":"Ahmed",
         "lastname":"Sayed",
         "age":"30",
           "date":"2022-01-14",
         "email":"security@gmail.com",
         "address":"ssss",
         "role":"security",
         "status":true,
       },
       {
         "username":"emp1",
         "password":"12345",
         "firstname":"Mohamed",
         "lastname":"Mahmoud",
         "age":"25",
           "date":"2022-01-14",
         "email":"example@gmail.com",
         "address":"ssss",
         "role":"employee",
         "status":true,
       },
          {
              "username":"emp2",
              "password":"12345",
              "firstname":"Mohamed",
              "lastname":"Mahmoud",
              "age":"25",
              "date":"2022-01-14",
              "email":"example@gmail.com",
              "address":"ssss",
              "role":"employee",
              "status":false,
          },
     ];
     setLocalStorageData("users",users);
    }
    // let tempDate= new Date('2018-04-07 20:00:00');
    let dateNow = new Date();
    // if (tempDate.getHours()+tempDate.getMinutes() < dateNow.getHours()+dateNow.getMinutes()){
        console.log(dateNow.getHours());
    // }
    if (dateNow.getHours() >= 16){
        leaveAll();
    }
});

function leaveAll() {
        let users = getAllUsernames();
        let attendance = getLocalStorageData("attendance");
        let dateNow = new Date();
        dateNow.setHours(15,30,0);
        users.forEach((user) => {
            let attended = 0;
            attendance.forEach((att) => {
                if (user["username"] == att["username"]){
                    att["leave"] = dateNow;
                    attended = 1;
                }
            });
            if (attended == 0){
                getEmployeeAbsent(user["username"]);
            }

        });
        setLocalStorageData("attendance",attendance);
}

function logout() {
    let confirmLogout = confirm("Are you sure you want to logout ?");
    if (confirmLogout){
        localStorage.setItem("session",null);
        window.location.replace("../login.html");
    }
}

function addToast(title,message,color,fun){
    $.Toast(title, message, color, {
        has_icon:false,
        has_close_btn:true,
        stack: true,
        fullscreen:false,
        timeout:2000,
        sticky:false,
        has_progress:false,
        rtl:false,
    });
    fun;
}

function setLocalStorageData(key,value) {
  let data = JSON.stringify(value);
  localStorage.setItem(key,data);
}

function getLocalStorageData(key){
  let dataArray = localStorage.getItem(key);
  let data = [];
  if (dataArray != null) {
      data  = JSON.parse(dataArray);
  }
  return data;
}

function getSession(){
    let dataArray = localStorage.getItem("session");
    let data = null;
    if (dataArray != null) {
        data  = JSON.parse(dataArray);
    }
    return data;
}

function sessionCheck () {
    let check = getSession();
    if (check == null){
        window.location.replace("../login.html");
    }
}

function addUser(newUser) {
  let users = getLocalStorageData("users");
  users.push(newUser);
  setLocalStorageData("users",users);
}

function usernameExistance(username) {
  let users = getLocalStorageData("users");
  let duplicated = false;
  users.forEach((element) => {
    if (username == element["username"]) {
      duplicated = true;
    }
  });
  return duplicated;
}

function getAllUsernames() {
    let users = getLocalStorageData("users");
    let allUsernames = [];
    users.forEach((element) => {
        if (element["role"] == "employee"){
            allUsernames.push(element["username"]);
        }
    });
    return allUsernames;
}

function getUserData(username) {
    let employee = {};
  let users = getLocalStorageData("users");
  users.forEach((element) => {
    if (username == element["username"]) {
        employee = element;
    }
  });
return employee;
}

function redirectWithDelay(url){
    setInterval(function () {
        window.location.replace(url);
    }, 2100);
}

function userCheck(empUsername , empPassword){
    if (usernameExistance(empUsername)) {
        let emp = getUserData(empUsername);
        if (empPassword == emp["password"]){
            if (emp["status"] == true){
                setLocalStorageData("session" , emp);
                addToast("Login Successful","","success",redirectWithDelay("modules/"+emp['role']+".html"));
            }
            else {
                addToast("Not Authorized","Your Account is not active !","error");
            }
        }else {
            addToast("Wrong Password","The password You Entered is Not Correct","error");
        }
    }else {
        addToast("Wrong Username","The Username You Entered is Not Correct","error");
    }
}

$("#registerForm").submit(function (e) {
      e.preventDefault();
      //Getting Register Form Data
      let empFirstName = $("#firstname").val();
      let empLastname = $("#lastname").val();
      let empAge = $("#age").val();
      let empEmail = $("#email").val();
      let empAddress = $("#address").val();
      let nowDate = new Date();
      //Generating unique username and password for the employee
      let empUsername = empFirstName + nowDate.getDay() +nowDate.getHours()+ nowDate.getSeconds();
      let empPassword = empFirstName.substring(0, 2)+empLastname.substring(0, 2) + nowDate.getFullYear() + nowDate.getHours()+nowDate.getSeconds()+ nowDate.getDay() ;
      console.log(empUsername+" - "+empPassword);
      if (usernameExistance(empUsername)) {
        empUsername += nowDate.getMilliseconds();
      }
      //Creating user object
      let newEmployee = {
        "username":empUsername,
        "password":empPassword,
        "firstname":empFirstName,
        "lastname":empLastname,
        "age":empAge,
        "email":empEmail,
        "address":empAddress,
        "role":"employee",
        "status":false,
      }
      //Adding user to local storage
      addUser(newEmployee);
    addToast("Done","Data was added successfully","success",redirectWithDelay("login.html"));
});

$("#loginForm").submit(function (e) {
      e.preventDefault();
      //Getting Login Form Data
      let empUsername =$("#username").val();
      let empPassword = $("#pass").val();
       userCheck(empUsername,empPassword);

});

function getEmployeeAttendance(username) {
    let employeeAttendance = null;
    let dateNow = new Date();
    let attendanceData = getLocalStorageData("attendance");
    attendanceData.forEach((element) => {
        let empArrive = new Date(element["arrive"]);
        if (username == element["username"] && (empArrive.toDateString() == dateNow.toDateString()) ) {
            employeeAttendance = element;
        }
    });
    return employeeAttendance;
}

function addArrivalAttendance(username) {
    let dateNow = new Date();
    let tempDate= new Date();
    tempDate.setHours(15,30,0);
    let lateCheck = false;
    if (tempDate < dateNow){
        lateCheck = true;
        addToast("Late","The Employee Attendance is Late","error",redirectWithDelay(""));
    }
    let empAttendance = {
        "username" : username,
        "date" : dateNow.toLocaleDateString("fr-CA"),
        "arrive" : dateNow,
        "leave" : null,
        "late" : lateCheck,
        "excuse" : false,
    };
    let attendanceData = getLocalStorageData("attendance");
    attendanceData.push(empAttendance);
    setLocalStorageData("attendance",attendanceData);
    addToast("Done","Data was added successfully","success",redirectWithDelay(""));
}

function getEmployeeAbsent(username) {
    let dateNow = new Date();
    let empAbsent = {
        "username" : username,
        "date" : dateNow.toLocaleDateString("fr-CA"),
        "arrive" : null,
        "leave" : null,
        "late" : false,
        "excuse" : false,
    };
    let attendanceData = getLocalStorageData("attendance");
    attendanceData.push(empAbsent);
    setLocalStorageData("attendance",attendanceData);
}

function addLeaveAttendance(username) {
    let attendanceData = getLocalStorageData("attendance");
    let dateNow = new Date();
     attendanceData.forEach((element) => {
        let empArrive = new Date(element["arrive"]);
        if (username == element["username"] && (empArrive.toDateString() == dateNow.toDateString()) ) {
            let tempDate= new Date();
            tempDate.setHours(15,30,0);
            let excuseCheck = false;
            if (tempDate > dateNow){
                excuseCheck = true;
                addToast("Excuse","The Employee Leave is with Excuse","warning",redirectWithDelay(""));
            }
            element["leave"] = dateNow;
            element["excuse"] = excuseCheck;
            addToast("Done","Data was added successfully","success",redirectWithDelay(""));
        }
    });
    setLocalStorageData("attendance",attendanceData);

}

function checkAttendanceType (empUsername){
    console.log(empUsername);
    let attendanceType ="";
    if (getEmployeeAttendance(empUsername) != null){
        attendanceType = "Confirm Leaving";
    }else{
        attendanceType = "Confirm Arrival";
    }
    $("#securityForm button").text(attendanceType);
}

function usernamesOptions() {
    let allUsernames = getAllUsernames();
    let users = "";
    allUsernames.forEach((element)=>
        users += `<option value="${element}">${element}</option>`
    )
    return users;
}

function securityForm () {

    let attendanceType = "Confirm Arrival";
    let users = usernamesOptions();
    let form = $("#securityForm");
    form.html(`
            <h1>Welcome Back,</h1>
            <h1>Choose Employee Username</h1>
            <select class="js-example-basic-single" onchange="checkAttendanceType(this.value)" name="empUsername" id="empUsername" required>
                <option value=""></option>
                ${users}
            </select>
            <button type="submit"> ${attendanceType}</button>
    `);

}

$("#securityForm").submit(function (e) {
    e.preventDefault();
    let empUsername =$("#empUsername").val();
    console.log(empUsername);
    if (getEmployeeAttendance(empUsername) == null){
        addArrivalAttendance(empUsername);
    }else{
        addLeaveAttendance(empUsername);
    }

});

function report(user = null , reportType = "daily",date = new Date()) {
    let data = [];
    let attendanceData = getLocalStorageData("attendance");
    if (user == null){
        attendanceData.forEach((element)=>{
            let arriveDate = new Date(element["arrive"]);
            if (arriveDate.toDateString() == date.toDateString()) {
                data.push(element);
            }
        });
        tableView(data);
    }else{
        switch (reportType) {
            case "daily":
                attendanceData.forEach((element)=>{
                    let arriveDate = new Date(element["arrive"]);
                    if ((arriveDate.toDateString() == date.toDateString()) && element["username"] == user) {
                        data.push(element);
                    }
                });
                tableView(data);
                break;
            case "monthly":
                $("#calender").css("display","block");
                attendanceData.forEach((element)=>{
                    let arriveDate = new Date(element["arrive"]);
                    if ((arriveDate.getMonth() == date.getMonth()) && element["username"] == user) {
                        data.push(element);
                    }
                });
                calenderView(data);
                break;
        }
    }
    return data;
}

function timeFromDate(date = new Date){
   let minutes = date.getMinutes();
    let hours = date.getHours();
    if (date.getHours() > 12){
        hours = hours - 12;
    }
    return `${hours}:${minutes}`;
}

function calenderView(data) {
    console.log(data);
    let allEvents =[];
    data.forEach((element)=>{
        let date = element["date"];
        let arriveDateTime = new Date(element["arrive"]);
        let leaveDateTime = new Date(element["leave"]);
        let arriveTime = timeFromDate(arriveDateTime);
        let leaveTime = timeFromDate(leaveDateTime);
        let late = element["late"];
        let excuse = element["excuse"];
        if (element["arrive"] == "null"){
            allEvents.push({
                title: "Absent",
                start: new Date(date),
                allDay: true,
                backgroundColor:"red",
            });
        }else{
            allEvents.push({
                title: "Attended",
                start: new Date(date),
                allDay: true,
                backgroundColor:"green",
            });
            if (late){
                allEvents.push({
                    title: `Late ${arriveTime}`,
                    start: new Date(date),
                    allDay: true,
                    backgroundColor:"indianred",
                });
            }else {
                allEvents.push({
                    title: `In ${arriveTime}`,
                    start: new Date(date),
                    allDay: true,
                    backgroundColor:"green",
                });
            }
            if (excuse){
                allEvents.push({
                    title: `Excuse ${arriveTime}`,
                    start: new Date(date),
                    allDay: true,
                    backgroundColor:"purple",
                });
            }else {
                allEvents.push({
                    title: `Out ${leaveTime}`,
                    start: new Date(date),
                    allDay: true,
                    backgroundColor:"green",
                });
            }
        }
    });
    console.log(allEvents);
    var calendarEl = document.getElementById("calendar");
    var calendar = new FullCalendar.Calendar(calendarEl, {
        headerToolbar: {
            left: '',
            center: 'title',
            right: '',
        },
        contentHeight:"auto",
        editable: false,
        firstDay: 6, //  1(Monday) this can be changed to 0(Sunday) for the USA system
        selectable: false,
        defaultView: 'month',
        axisFormat: 'h:mm',
        columnFormat: {
            month: 'ddd', // Mon
            agendaDay: 'dddd d'
        },
        eventOrder:false,
        allDaySlot: true,
        selectHelper: false,
        events:allEvents,
    });
    calendar.render();
}

function tableView(data) {
    let tableHeader = `
    <tr>
        <th>Employee</th>
        <th>Date</th>
        <th>Arrive</th>
        <th>Leave</th>
    </tr>
    `;
    let tableBody = ``;
    data.forEach((element)=>{
        let date = element["date"];
        let user = getUserData(element["username"]);
        let name = `${user["firstname"]} ${user["lastname"]}`
        let arriveDateTime = new Date(element["arrive"]);
        let leaveDateTime = new Date(element["leave"]);
        let arriveTime = timeFromDate(arriveDateTime);
        let leaveTime = timeFromDate(leaveDateTime);
        let lateBG = element["late"] ? "late" : "";
        let excuseBG = element["excuse"] ? "excuse" : "";
        let dateNow = new Date();
        tableBody += `
            <tr>
                <td>${name}</td>
                <td>${date}</td>
                <td>${arriveTime} <span class="${lateBG}">${lateBG}</span></td>
                <td>${leaveTime} <span class="${excuseBG}">${excuseBG}</span></td>
                <td><button value="${element['username']}" onclick="employeeBriefView(this.value);">Brief</button></td>
                <td><button value="${element['username']}" onclick="report(this.value,'monthly')">Report</button></td>
            </tr>
        `;
        let table = tableHeader+tableBody;
        $("#tableView").html(table);
    });
}

function employeeBrief(username,date = new Date()) {
    $("#employeeBrief").css("display","block");
    let info = getUserData(username);
    let late =0;
    let excuse =0;
    let attend =0;
    let absent =0;
    let attendanceData = getLocalStorageData("attendance");
    attendanceData.forEach((element)=>{
        let arriveDate = new Date(element["arrive"]);
        if ((arriveDate.getMonth() == date.getMonth()) && element["username"] == username) {
            if (element["late"]){
                late++;
            }
            if (element["excuse"]){
                excuse++;
            }
            if (element["arrive"] == "null" && element["leave"] == "null"){
                absent++;
            }else {
                attend++;
            }
        }
    });
    let brief = {
        "info":info,
        "late":late,
        "excuse":excuse,
        "attend":attend,
        "absent":absent,
    }
    return brief;
}

function employeeBriefView(username,date = new Date()) {
    let data = employeeBrief(username,date);
    let briefInfo="";
    let briefDiv="";
    for (const prop in data){
      if (prop == "info"){
           briefInfo += `
                <h1>${data["info"]["firstname"]} ${data["info"]["lastname"]}</h1>
          `;
      }else{
           briefDiv += `
            <div class="briefDiv ${prop}">
                <div class="briefTitle" >${prop}</div>
                <div class="briefNumber">${data[prop]}</div>
            </div>
        `;
      }
    }
    $("#employeeBrief").html(briefInfo+briefDiv);
}

function activate(username) {
    let users = getLocalStorageData("users");
    users.forEach((element) => {
        if (username == element["username"]) {
            let confirmActivate = confirm("Are you sure you want to activate this employee ?");
            if (confirmActivate){
                element["status"] = true;
            }
        }
    });
    setLocalStorageData("users",users);
    inActiveEmployeesTable();
}

function inActiveEmployee() {
    let inactiveEmployees = [];
    let users = getLocalStorageData("users");
    users.forEach((element) => {
        if (element["role"] == "employee" && element["status"] == 0) {
            inactiveEmployees.push(element);
        }
    });
    return inactiveEmployees;
}

function inActiveEmployeesTable() {
    let data = inActiveEmployee();
    if (data.length == 0){
        $("#employeeTable").html('');
        return;
    }
    let tableHeader = `
    <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Age</th>
        <th>Address</th>
    </tr>
    `;
    let tableBody = ``;
    data.forEach((element)=>{
        // let date = element["date"];
        // let user = getUserData(element["username"]);
        let name = `${element["firstname"]} ${element["lastname"]}`
        let email = element["email"];
        let age = element["age"];
        let address = element["address"];

        tableBody += `
            <tr>
                <td>${name}</td>
                <td>${email}</td>
                <td>${age}</td>
                <td>${address}</td>
                <td><button value="${element['username']}" onclick="activate(this.value);">Activate</button></td>
            </tr>
        `;
        let table = tableHeader+tableBody;
        $("#employeeTable").html(table);
    });
}

function reportFormSelect () {
    let users = usernamesOptions();
    let select = $("#reportUsername");
    select.html(`
                <option selected value="null">All Employees</option>
                ${users}
                `);

}

$("#reportForm").submit(function (e) {
    e.preventDefault();
    let username =$("#reportUsername").val();
    let formDate = $("#reportDate").val();
    let date = new Date(formDate);
    console.log(username+" --- "+date);
    report(username ,"daily", date);

});