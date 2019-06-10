function signup(){
    signupEmail = document.getElementById("signupEmail").value
    signupPassword = document.getElementById("signupPassword").value

    firebase.auth().createUserWithEmailAndPassword(signupEmail, signupPassword)
    	.then(() => {
    		console.log('User has signed up - ' + signupEmail)
		})
		.catch (function (error){
			console.log(error)
		 	document.getElementById("alertSignupFailed").setAttribute('style', 'display: block;')
		})
}

function login(){
    loginEmail = document.getElementById("loginEmail").value
    loginPassword = document.getElementById("loginPassword").value

    firebase.auth().signInWithEmailAndPassword(loginEmail, loginPassword)
    	.then((cred) => {
    		console.log(cred.user.email)

		})
		.catch (function (error){
			console.log(error)
		 	document.getElementById("alertLoginFailed").setAttribute('style', 'display: block;')
			// document.getElementById("alertNotLogged").setAttribute('style', 'display: block; margin-top: 10px;')
		})
}

function logout(){
    firebase.auth().signOut().then(() => {  
    	console.log(cred.user.email);
	})
}

function checkIfLoggedIn(){
	firebase.auth().onAuthStateChanged(function(user){
		if (user) {
			// User is signed in.
			console.log('User is logged in - ' + user.email)
			document.getElementById('user').innerHTML = user.email;
			document.getElementById("buttonLogin").setAttribute('style', 'display: none;')
			document.getElementById("buttonSignup").setAttribute('style', 'display: none;')
			document.getElementById("buttonLogout").setAttribute('style', 'display: block;')
			document.getElementById("iconUser").setAttribute('style', 'display: block;')
			document.getElementById("app").setAttribute('style', 'display: block;')
 			document.getElementById("alertNotLogged").setAttribute('style', 'display: none;')
			document.getElementById("landing-text").setAttribute('style', 'margin-top: 90px;')
		} else {
			// No user is signed in.
			console.log('User is logged OUT !')
			document.getElementById("buttonLogin").setAttribute('style', 'display: block;')
			document.getElementById("buttonSignup").setAttribute('style', 'display: block;')
			document.getElementById("buttonLogout").setAttribute('style', 'display: none;')
			document.getElementById("iconUser").setAttribute('style', 'display: none;')
			document.getElementById("app").setAttribute('style', 'display: none;')
			document.getElementById("alertNotLogged").setAttribute('style', 'display: block;')
			document.getElementById("landing-text").setAttribute('style', 'margin-top: 30px;')
			// document.getElementById("alertLoginFailed").setAttribute('style', 'display: block; margin-top: 70px;')
			// document.getElementById("alertNotLogged").setAttribute('style', 'display: block; margin-top: 10px;')

		}
	})
}

window.onload = function(){
	checkIfLoggedIn()
}