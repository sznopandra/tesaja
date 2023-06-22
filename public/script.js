// Daftar nama pengguna yang valid
var validUsernames = ["user1", "user2", "user3"];

// Fungsi untuk memeriksa apakah username valid
function isValidUsername(username) {
  return validUsernames.includes(username);
}

// Mendapatkan elemen-elemen yang diperlukan dari DOM
var joinScreen = document.querySelector('.join-screen');
var chatScreen = document.querySelector('.chat-screen');
var usernameInput = document.getElementById('username');
var joinButton = document.getElementById('join-user');

// Fungsi untuk menampilkan pesan chat
function displayMessage(username, message) {
  var messagesDiv = document.querySelector('.messages');
  var messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.innerHTML = '<strong>' + username + ':</strong> ' + message;
  messagesDiv.appendChild(messageElement);
}

// Mendengarkan klik pada tombol "Join"
joinButton.addEventListener('click', function() {
  var username = usernameInput.value;
  
  // Memeriksa apakah username valid
  if (isValidUsername(username)) {
    // Jika valid, lanjutkan ke layar obrolan
    joinScreen.classList.remove('active');
    chatScreen.classList.add('active');
  } else {
    // Jika tidak valid, tampilkan pesan kesalahan atau lakukan tindakan yang sesuai
    alert('Username is not valid. Please try again.');
  }
});

// Mendapatkan elemen-elemen yang diperlukan dari DOM pada layar obrolan
var messageInput = document.getElementById('message-input');
var sendMessageButton = document.getElementById('send-message');

// Mendengarkan klik pada tombol "send"
sendMessageButton.addEventListener('click', function() {
  var message = messageInput.value;
  var username = usernameInput.value;

  // Memeriksa apakah pengguna telah memasukkan pesan
  if (message.trim() !== '') {
    // Menampilkan pesan chat di layar
    displayMessage(username, message);

    // Lakukan tindakan lain yang diperlukan, misalnya, mengirim pesan ke server

    // Mengosongkan input pesan
    messageInput.value = '';
  }
});

(function(){

	const app = document.querySelector(".app");
	const socket = io();

	let uname;

	app.querySelector(".join-screen #join-user").addEventListener("click",function(){
		let username = app.querySelector(".join-screen #username").value;
		if(username.length == 0){
			return;
		}
		uname = username;

		socket.emit("newuser",username);

		app.querySelector(".join-screen").classList.remove("active");
		app.querySelector(".chat-screen").classList.add("active");
	});

	app.querySelector(".chat-screen #exit-chat").addEventListener("click",function(){
		app.querySelector(".join-screen").classList.add("active");
		app.querySelector(".chat-screen").classList.remove("active");
	});

	app.querySelector(".chat-screen #send-message").addEventListener("click",function(){
		let message = app.querySelector(".chat-screen #message-input").value;
		if(message.length == 0){
			return;
		}
		renderMessage("me",{
			username:uname,
			text:message
		});
		
		socket.emit("prompt",{
			username:uname,
			text:message
		});
	});

	socket.on("chatbot",function(message){
		renderMessage("bot",message);
	});

	function renderMessage(type,message){
		let messageContainer = app.querySelector(".chat-screen .messages");
		if(type == "me"){
			let el = document.createElement("div");
			el.setAttribute("class","message my-message");
			el.innerHTML = `
				<div>
					<div class="name">You:${message.username} </div>
					<div class="text">${message.text}</div>
				</div>
			`;
			messageContainer.appendChild(el);
		}else if(type == "bot"){
			let el = document.createElement("div");
			el.setAttribute("class","message other-message");
			el.innerHTML = `
				<div>
					<div class="name">${message.username} </div>
					<div class="text">${message.text}</div>
				</div>
			`;
			messageContainer.appendChild(el);
		}
		//scroll chat to end
		messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
	}

})();
