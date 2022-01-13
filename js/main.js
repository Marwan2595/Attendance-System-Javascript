$(function(){
//   let nowDate = new Date();
//  console.log(nowDate.getUTCMilliseconds());
    localStorage.setItem("logged",false);
    let usersCheck = getLocalStorageData("users");
    if (usersCheck.length == 0) {
      let users =
      [
       {
         username:"admin",
         password:"123",
         firstname:"Marwan",
         lastname:"Sayed",
         age:"27",
         email:"marwan.ss2595@gmail.com",
         address:"ssss",
         role:"admin",
         status:"1",
       },
       {
         username:"security",
         password:"12345",
         firstname:"Ahmed",
         lastname:"Sayed",
         age:"30",
         email:"security@gmail.com",
         address:"ssss",
         role:"security",
         status:"1",
       },
       {
         username:"mm1254",
         password:"12345",
         firstname:"Mohamed",
         lastname:"Mahmoud",
         age:"25",
         email:"example@gmail.com",
         address:"ssss",
         role:"employee",
         status:"1",
       },
 
     ];
     // let attendence = [{},{},{},{}];
     setLocalStorageData("users",users);
     // localStorage.setItem("attendence",attendence);
    }
});


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


function addUser(newUser) {
  let users = getLocalStorageData("users");
  users.push(newUser);
  setLocalStorageData("users",JSON.stringify(users));
}


function checkUsername(username) {
  let users = getLocalStorageData("users");
  let duplicated = false;
  // users.forEach((element) => {
  //   if (username == element["username"]) {
  //     duplicated = true;
  //   }
  // });
  for (let i = 0; i < users.length; i++) {
    if (username == users[i]["username"]) {
          duplicated = true;
        }
  }
  return duplicated;
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
      if (checkUsername(empUsername)) {
        empUsername += nowDate.getMilliseconds();
      }
      //Creating user object
      let newEmployee = {
        username:empUsername,
        password:empPassword,
        firstname:empFirstName,
        lastname:empLastname,
        age:empAge,
        email:empEmail,
        address:empAddress,
        role:"employee",
        status:0,
      }
      //Adding user to local storage
      addUser(newEmployee);
      window.location.replace("login.html");
});


