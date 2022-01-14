$(function(){
    localStorage.setItem("session",null);
    $('.js-example-basic-single').select2();
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
              "email":"example@gmail.com",
              "address":"ssss",
              "role":"employee",
              "status":false,
          },
     ];
     setLocalStorageData("users",users);
    }
});

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
      window.location.replace("login.html");
});

$("#loginForm").submit(function (e) {
      e.preventDefault();
      //Getting Login Form Data
      let empUsername =$("#username").val();
      let empPassword = $("#pass").val();
       userCheck(empUsername,empPassword);

});

function getEmployeeAttendance(username) {
    let employeeAttendance = {};
    let dateNow = new Date();
    let attendanceData = getLocalStorageData("attendance");
    attendanceData.forEach((element) => {
        if (username == element["username"] && (element["arrive"].toDateString() == dateNow.toDateString()) ) {
            employeeAttendance = element;
        }
    });
    return employeeAttendance;
}

function addArrivalAttendance(username) {
    let dateNow = new Date();
    let tempDate= new Date('2018-04-07 08:30:00');
    let lateCheck = false;
    if (tempDate.getHours()+tempDate.getMinutes() < dateNow.getHours()+dateNow.getMinutes()){
        console.log("late");
        lateCheck = true;
        addToast("Late","The Employee Attendance is Late","error");
    }
    let empAttendance = {
        "username" : username,
        "arrive" : dateNow,
        "leave" : null,
        "late" : lateCheck,
        "excuse" : false,
    };
    let attendanceData = getLocalStorageData("attendance");
    attendanceData.push(empAttendance);
    setLocalStorageData("attendance",attendanceData);
}

function addLeaveAttendance(username) {
    let attendanceData = getLocalStorageData("attendance");
    let dateNow = new Date();
    attendanceData.forEach((element) => {
        if (username == element["username"] && (element["arrive"].toDateString() == dateNow.toDateString()) ) {
            let tempDate= new Date('2018-04-07 15:30:00');
            let excuseCheck = false;
            if (tempDate.getHours()+tempDate.getMinutes() > dateNow.getHours()+dateNow.getMinutes()){
                console.log("excuse");
                excuseCheck = true;
                addToast("Excuse","The Employee Leave is with Excuse","warning");
            }
            element["leave"] = dateNow;
            element["excuse"] = excuseCheck;
        }
    });
    setLocalStorageData("attendance",attendanceData);
}


