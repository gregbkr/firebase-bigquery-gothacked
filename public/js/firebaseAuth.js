function signup(){
    // Signup
    signupEmail = document.getElementById("signupEmail").value
    signupPassword = document.getElementById("signupPassword").value

    firebase.auth().createUserWithEmailAndPassword(signupEmail, signupPassword).then(() => {
		console.log('User has signed up - ' + signupEmail)
	    
	    // Login
	    login(signupEmail, signupPassword).then(function(){
		
			// Send email
			sendVerifEmail()
		})
	}).catch (function (error){
		window.alert(error)
	})
}

function sendVerifEmail() {
	var user = firebase.auth().currentUser;
	user.sendEmailVerification().then(function() {
		console.log(user.email + ' has received an email')
		window.alert('Please check your mailbox and confirm your email: ' + user.email)
	}).catch(function(error) {
		window.alert(error)
	});
}

async function login(email, password){    
	if (email === undefined || email === null) {
    	email = document.getElementById("loginEmail").value
		password = document.getElementById("loginPassword").value
	}

    firebase.auth().signInWithEmailAndPassword(email, password).then((cred) => {
		console.log(cred.user.email + ' has logged in with success')
	}).catch (function (error){
		window.alert(error)
	})
}

function logout(){
    firebase.auth().signOut().then(() => {  
    	console.log(cred.user.email + ' has logged out with success');
	})
}

function checkIfLoggedIn(){
	firebase.auth().onAuthStateChanged(function(user){
		if (user) {
			if (!user.emailVerified){
				// User is signed in but not verified
				console.log(user.email + ' is logged in | verified:' + user.emailVerified)
				document.getElementById('user').innerHTML = user.email;
				document.getElementById("buttonLogin").setAttribute('style', 'display: none;')
				document.getElementById("buttonSignup").setAttribute('style', 'display: none;')
				document.getElementById("buttonLogout").setAttribute('style', 'display: block;')
				document.getElementById("iconUser").setAttribute('style', 'display: block;')
				document.getElementById("app").setAttribute('style', 'display: none;')
				document.getElementById("alertNotLogged").setAttribute('style', 'display: none;')
 				document.getElementById("alertNotVerified").setAttribute('style', 'display: block;')
 				document.getElementById("landing-text").setAttribute('style', 'margin-top: 30px;')
			} else {
				// User is signed in and verified
				console.log(user.email + ' is logged in | verified:' + user.emailVerified)
				document.getElementById('user').innerHTML = user.email;
				document.getElementById("buttonLogin").setAttribute('style', 'display: none;')
				document.getElementById("buttonSignup").setAttribute('style', 'display: none;')
				document.getElementById("buttonLogout").setAttribute('style', 'display: block;')
				document.getElementById("iconUser").setAttribute('style', 'display: block;')
				document.getElementById("app").setAttribute('style', 'display: block;')
	 			document.getElementById("alertNotLogged").setAttribute('style', 'display: none;')
	 			document.getElementById("alertNotVerified").setAttribute('style', 'display: none;')
				document.getElementById("landing-text").setAttribute('style', 'margin-top: 90px;')
				document.getElementById("userTemp").value = user.email
			}
		} else {
			// No user is signed in
			console.log('User is logged OUT !')
			document.getElementById("buttonLogin").setAttribute('style', 'display: block;')
			document.getElementById("buttonSignup").setAttribute('style', 'display: block;')
			document.getElementById("buttonLogout").setAttribute('style', 'display: none;')
			document.getElementById("iconUser").setAttribute('style', 'display: none;')
			document.getElementById("app").setAttribute('style', 'display: none;')
			document.getElementById("alertNotLogged").setAttribute('style', 'display: block;')
			document.getElementById("landing-text").setAttribute('style', 'margin-top: 30px;')
		}
	})
}

// Refresh what's is visible on screen after page updates
window.onload = function(){
	checkIfLoggedIn()
}