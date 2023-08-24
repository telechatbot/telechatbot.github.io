import { collection, doc, addDoc, getDocs, getDoc, updateDoc, getUsers, SIGNUP, LOGIN } from "/telechatbot/firebase.js";

let token = '5830822420:AAGvhHGM5UIEOKo6hUa4lPQkwoAdnW8i5eQ';
let fetchedData = [];
let signUpKey = false;
let signUpPin = false;
let loginPin = false;
let Finalpin = null;
const urlParams = new URLSearchParams(window.location.search);
//?type=signup&chatid=1234567890
const type = urlParams.get("type") || "login";
let ID = urlParams.get("chatid") || null;
if(ID !=null){
	signUpKey = true;
	document.getElementById("chatid").value=ID;
	document.getElementById("chatid").setAttribute("readonly", "readonly");
	signUpMessage.innerHTML = "Chat ID is available";
	signUpMessage.style.color = "green";
}

if (type == "signup") {
  changeSignUp();
}else{
	changeLogin();
}


window.addEventListener('load', () => {
  const storedChatId = sessionStorage.getItem('chatID');
  if (storedChatId) {
    window.location.href = '/telechatbot';
  }
});

async function fetchData() {
  try {
    fetchedData = await getUsers();
    console.log("Fetched");
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function handleEnterPin(event) {
  const key = document.getElementById('pin');
  const checkedpin = document.getElementById('available');
  if (event.key === 'Enter') {
    login();
  } else {
    key.style.color = "black";
    checkedpin.style.color = "black";
    checkedpin.innerHTML = "Note: Enter your PIN";
  }
}

// JavaScript functions to toggle card rotation
function changeSignUp() {
  document.getElementById('card').classList.add('flipped');
}

function changeLogin() {
  document.getElementById('card').classList.remove('flipped');
}

const login = async () => {
  const pin = document.getElementById('pin').value;
  console.log(pin);
  const checked = document.getElementById('available');
  await fetchedData.forEach((doc) => {
    if (pin == doc.data().pin) {
      loginPin = true;
      ID = doc.data().chatID;
    }
  });
  if (loginPin == true) {
	await LOGIN();
	sessionStorage.setItem("chatID", ID);
	location.reload();
  } else {
    checked.style.color = "red";
    checked.innerHTML = "Note: Your PIN is invalid";
  }
}

const checkChatID = async()=>{
	var key = document.getElementById("chatid").value;
	var signUpMessage = document.getElementById("signUpMessage");
	if(signUpKey != true){
	await fetch(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${key}&text=Chat ID verified.`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (data.ok) {
        signUpKey = true;
		document.getElementById("chatid").setAttribute("readonly", "readonly");
		signUpMessage.innerHTML = "Chat ID is available";
		signUpMessage.style.color = "green";
      } else {
        if (data.error_code === 400) {
          signUpMessage.innerHTML = "Chat ID is not available";
          signUpMessage.style.color = "red";
        }
      }
    })
    .catch(error => {
      console.error(error);
    });
	}
	signUpPin = false;
}

const signUp = async () => {
  var setpin = document.getElementById("setpin").value;
  var setPinMessage = document.getElementById("setPinMessage");
  var key = document.getElementById("chatid").value;
  var signUpMessage = document.getElementById("signUpMessage");
  if( setpin.toString().length > 4){
	setPinMessage.innerHTML = "Please Enter Pin Minmum 4 digits.";
	setPinMessage.style.color = "red";
return ;
  }
	await fetchedData.forEach((doc) => {
		if (setpin == doc.data().pin) {
		  signUpPin = true;
		}
	});
  if (signUpKey == true) {
    if (signUpPin == false) {
     await SIGNUP(key, setpin);
	 await fetch(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${key}&text=Your PIN is ${setpin} `);
	  window.location.href = '/?type=login';
    } else {
      setPinMessage.innerHTML = "Please change your PIN.";
      setPinMessage.style.color = "red";
    }
  } else {
    signUpMessage.innerHTML = "Chat ID not available";
    signUpMessage.style.color = "red";
  }
}

fetchData();



document.getElementById("pin").addEventListener("keydown", handleEnterPin);
document.getElementById("changeLogin").addEventListener("click", changeLogin);
document.getElementById("changeSignUp").addEventListener("click", changeSignUp);
document.getElementById("login").addEventListener("click", login);
document.getElementById("signUp").addEventListener("click", signUp);
document.getElementById("setpin").addEventListener("keydown", checkChatID);
