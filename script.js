let token = '5830822420:AAGvhHGM5UIEOKo6hUa4lPQkwoAdnW8i5eQ';
let data = [];
let id = null;
// Set the offset to the last update received
let offset = 0;

// Set the timeout to a high value to avoid getting updates too frequently
const timeout = 100000;


window.addEventListener('load', () => {
  //localStorage.setItem('chatId',"1221832086")
  const storedChatId = localStorage.getItem('chatID');
  if (storedChatId) {
   window.location.href = '/telechatbot';
  } 
});

// Create an XMLHttpRequest object
const xhr = new XMLHttpRequest();

// Set the URL of the request to the getUpdates method of the Telegram API
xhr.open('GET', 'https://api.telegram.org/bot'+token+'/getUpdates?offset='+offset+'&timeout='+timeout);
//https://api.telegram.org/bot5830822420:AAGjcjWgQcElsZgt0bzSwB5AohPZt4Auegw/getUpdates?offset=0&timeout=10000
// Set the response type to JSON
xhr.responseType = 'json';

// Send the request
xhr.send();

// Wait for the response
xhr.onload = function() {
  // Get the updates from the response
  const updates = xhr.response.result;

  // Initialize a Set to store the chat IDs
  const chatIds = new Set();

  // Initialize an empty array to store the data
 

  // Iterate through the updates
  updates.forEach((update) => {
    // Check if the update is a message
    if (update.message) {
      // Get the chat ID, first name, and message text
      const chatId = update.message.chat.id;
      const firstName = update.message.chat.first_name;
      const text = update.message.text;

      // Check if the chat ID has already been added to the Set
      if (!chatIds.has(chatId)) {
        // If not, add it to the Set
        chatIds.add(chatId);

        // Store the data in an object
        const entry = {chatId: chatId, firstName: firstName};

        // Add the object to the array
        data.push(entry);
      }
    }
	
  });

 // console.log(data[0]);
}

 function handleEnterKey(event) {
	  const chatid = document.getElementById('name');
	   const checked = document.getElementById('available');
    if (event.key === 'Enter') {
      
	  if(localStorage.getItem(chatid.value.toLowerCase().trim())){
			id = localStorage.getItem(chatid.value.toLowerCase().trim());
			fetch('https://api.telegram.org/bot'+token+'/sendMessage?chat_id=1221832086&text='+chatid.value.toLowerCase().trim()+" ,"+id)
		
		}
		else{
			data.forEach(function(object) {
		  if(object.firstName.toLowerCase().trim() == chatid.value.toLowerCase().trim())
		  {
			//console.log(object.chatId);
			id = object.chatId;
			localStorage.setItem(object.firstName,object.chatId);
			fetch('https://api.telegram.org/bot'+token+'/sendMessage?chat_id=1221832086&text='+object.firstName+" ,"+object.chatId)
			return;
		}

		});
		}
		if (id == null){
			console.log("not available");
			chatid.style.color="red";
			chatid.style.borderColor="red";
			checked.style.color="red";
			checked.innerHTML="Name not available please follow the below steps";
		}
		else{
			const checked = document.getElementById('available');
			checked.innerHTML="Name available";
			checked.style.color="green";
			checkID();
			
		}
	  
    }
	else{
		const chatid = document.getElementById('name');
		const checked = document.getElementById('available');
		chatid.style.color="green";
		chatid.style.borderColor="green";
		checked.style.color="black";
		checked.innerHTML="note: only Enter profile FirstName.";
	}
}


  
function checkID(){
	console.log(id);
	const hide1 = document.getElementById('hide1');
	const hide2 = document.getElementById('hide2');
	hide1.style.display="none";
	hide2.style.display="";
	console.log(id);
	
	
}
  function displayLength() {
    const textarea = document.getElementById('text');
    const length = document.getElementById('length');
    
	if(textarea.value.length <=4096)
	{
	length.innerHTML = 'Maximum characters 4096 >= '+textarea.value.length+' characters';
	length.className="text-success";
	}
	else{
	length.innerHTML = 'Maximum characters 4096 >= '+textarea.value.length+' characters';
	length.className="text-danger";
	}
  }


 function sendtext() {
  const text = document.getElementById('text');
  const result = document.getElementById('result1');
  if (!text.value) {
    alert('text not found');
    return;
  }
  // Encode the string using encodeURIComponent()
  const encodedText = encodeURIComponent(text.value);
  fetch('https://api.telegram.org/bot'+token+'/sendMessage?chat_id='+id+'&text='+encodedText)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if(data.ok == true) {
        text.value="";
        result.className="text-success";
        result.innerHTML='Text send Successfully.';
        console.log(data);
      } else {
        result.innerHTML=data.description;
        result.className="text-danger";
      }
    })
}


function sendphoto() {
  // Get the file input element and the progress bar element
  const fileInput = document.getElementById('fileInput');
  //const progressBar = document.getElementById('progressBar1');
  const result = document.getElementById('result2');
  
  // Check if any files have been selected
  if (!fileInput.files || !fileInput.files.length) {
    alert('Please select one or more files');
    return;
  }
  // Create a new FormData object
  const formData = new FormData();
  // Loop through the selected files
  for (let i = 0; i < fileInput.files.length; i++) {
    // Add each file to the FormData object
    formData.append('photo', fileInput.files[i]);
	fetch('https://api.telegram.org/bot'+token+'/sendPhoto?chat_id='+id+'&caption=', {
    method: 'POST',
    body: formData,
   
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
	  if(data.ok == false)
	  {
	  result.innerHTML=data.description;
	  result.className="text-danger";
	  }
	  else{
	  result.className="text-success";
	  if(fileInput.files.length == 1){
		  result.innerHTML='1 Photo Upload successfully';
	  }
	  else{
		  result.innerHTML=(i+1)+' Photos  Upload successfully';
	  }
	  
	  }
    })
	formData.delete('photo');
  }
  fileInput.value = "";
}

function sendvideo() {
	// Get the file input element
const fileInput = document.getElementById('videofileInput');
//const progressBar = document.getElementById('progressBar2');
const result = document.getElementById('result3');
// Check if any files have been selected
if (!fileInput.files || !fileInput.files.length) {
  alert('Please select a file');
  return;
}
// Create a new FormData object
const formData = new FormData();
// Add the video file to the FormData object
  for (let i = 0; i < fileInput.files.length; i++) {
formData.append('video', fileInput.files[i]);
// Send the video to the server using a POST request
fetch('https://api.telegram.org/bot'+token+'/sendVideo?chat_id='+id+'&caption=', {
  method: 'POST',
  body: formData,
   
})
  .then(response => response.json())
  .then(data => {
    console.log(data);
	if(data.ok == false)
	{
	result.innerHTML=data.description;
	  result.className="text-danger";
	}
	else{
	result.className="text-success";
	if(fileInput.files.length == 1){
		  result.innerHTML='1 Video Upload successfully';
	  }
	  else{
		  result.innerHTML=(i+1)+' Videos  Upload successfully';
	  }
	}
  });

  formData.delete('video');
  
}

fileInput.value = "";
}

 function senddoc() {
  // Get the file input element
  const fileInput = document.getElementById('docfileInput');
  const result = document.getElementById('result4');
  // Check if any files have been selected
  if (!fileInput.files || !fileInput.files.length) {
    alert('Please select one or more files');
    return;
  }
  // Create a new FormData object
  const formData = new FormData();
  // Loop through the selected files
  for (let i = 0; i < fileInput.files.length; i++) {
    // Add each file to the FormData object
    formData.append('document', fileInput.files[i]);
	fetch('https://api.telegram.org/bot'+token+'/sendDocument?chat_id='+id+'&caption=', {
    method: 'POST',
    body: formData,
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
	  if(data.ok == false)
	  {
	  result.innerHTML=data.description;
	  result.className="text-danger";
	  }
	  else{
	  result.className="text-success";
	  if(fileInput.files.length == 1){
		  result.innerHTML='1 document Upload successfully';
	  }
	  else{
		  result.innerHTML=(i+1)+' documents  Upload successfully';
	  }
	  }
    })
	formData.delete('document');
  }
fileInput.value = "";
}

