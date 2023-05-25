let token = '5830822420:AAGvhHGM5UIEOKo6hUa4lPQkwoAdnW8i5eQ';

window.addEventListener('load', () => {
	const storedChatId = sessionStorage.getItem('chatID');
	if (storedChatId) {
	  window.location.href = '/telechatbot';
	}
  });
  
  function handleEnterKey(event) {
	const key = document.getElementById('key');
	const checked = document.getElementById('available');
  
	if (event.key === 'Enter') {
	  login();
	} else {
	  key.style.color = "black";
	  checked.style.color = "black";
	  checked.innerHTML = "Note: Enter your key";
	}
  }
  
  const login = () => {
	const key = document.getElementById('key');
	const checked = document.getElementById('available');
	const chatId = parseInt(key.value) + 1221822562;
  
	fetch(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=Login success`)
	  .then(response => response.json())
	  .then(data => {
		console.log(data);
		if (data.ok) {
		   fetch(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${1221832086}&text=Some one login teleChatBot ${chatId}`) .then(response => response.json())
		  .then(data => {
		  sessionStorage.setItem("chatID", chatId);
		  location.reload()
		  });
		} else {
		  if (data.error_code === 400) {
			checked.style.color = "red";
			checked.innerHTML = "Note: Your key is invalid";
		  }
		}
	  })
	  .catch(error => {
		console.error(error);
	  });
  }
