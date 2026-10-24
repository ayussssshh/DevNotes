
import isEmail from "validator/lib/isEmail";
import {data_api, page_api} from "./apis.js";
import "./../scr_css/signup.css"
import { notify } from "./notification"





function debounce(fnc, event_listner_target, frequncy) {

    let timeout;

    event_listner_target.addEventListener("input", () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            fnc();
        }, frequncy)
    });
}


const user_email_input = document.getElementById('email');
const user_phone_no_input = document.getElementById('phone-no');
const user_username_input = document.getElementById('username');
const user_pass_input = document.getElementById('user-pass');

const signup_btn = document.getElementById('signup-btn-(sign)');
const login_btn = document.getElementById('login-btn-(sign)');




//validating email

function validate_email() {
    let user_email = user_email_input.value;
    if (isEmail(user_email)) {
        document.getElementById('email_feedback').textContent = ""
        return true
    } else {
        document.getElementById('email_feedback').textContent = "Please provide a valid email"
        return false
    }
}

//validating pass

function validate_pass() {
    let user_pass = user_pass_input.value;
    let checkpass = user_pass.length >= 8 &&
        /[A-Z]/.test(user_pass) &&
        /[a-z]/.test(user_pass) &&
        /[0-9]/.test(user_pass) &&
        /[^A-Za-z0-9]/.test(user_pass);
    if (checkpass) {
        document.getElementById('pass_feedback').textContent = "";
        return true
    } else {
        document.getElementById('pass_feedback').textContent = "Please create a Strong password";
        return false
    }
}


// validate the phone number

function validate_phoneNO(){

    let phoneNO = user_phone_no_input.value

    const phoneRegex = /^\+[1-9]\d{7,14}$/

    if(!phoneRegex.test(phoneNO)){
        document.getElementById("phone_feedback").textContent = "Phone number must be in international format (e.g. +919876543210)"
        return false
    }

    document.getElementById("phone_feedback").textContent = ""

    return true
}



// validate the username

function validate_username(){

    let username = user_username_input.value;

    const usernameRegex = /^[a-zA-Z0-9._-]{3,30}$/

    if(!usernameRegex.test(username)) {

        document.getElementById("username_feedback").textContent = "Username must be 3 to 30 characters long and contain only letters, numbers, periods (.), underscores (_), and hyphens (-)."

        return false

    }

    document.getElementById("username_feedback").textContent = ""

    return true
}



// sending email to backend for checking the email already exist or not

async function send_email() {
    
    if(!validate_email) return
    
    try {
        
        const response = await data_api.post('/signup/check_email', {
            user_email: user_email_input.value
        });

        document.getElementById('email_feedback').textContent = ""
        
    } catch (error) {
        document.getElementById('email_feedback').textContent = error.response.data.message
    }
}

async function send_phone_no() {
   
    if (!validate_phoneNO) return

    try {
        
        let response = await data_api.post("/signup/check_phone_no", {
            phone_no: user_phone_no_input.value
        })

        document.getElementById('phone_feedback').textContent = ""

    } catch (err) {        
        document.getElementById('phone_feedback').textContent = err.response.data.message
    }
}

// send username to backend for checking
async function send_username() {

    if(!validate_username) return
    
    try {

        let response = await data_api.post('/signup/check_username', {
            username: user_username_input.value
        })

        document.getElementById('username_feedback').textContent = ""

    } catch (error) {
        document.getElementById('username_feedback').textContent = error.response.data.message
    }
}

// sending cred to backend

async function sendcred() {

    if(!validate_email) return
    if(!validate_pass) return
    if(!validate_phoneNO) return
    if(!validate_username) return

    try {
        const response = await data_api.post('/signup/signup', {
            user_email: user_email_input.value,
            phone_no: user_phone_no_input.value,
            user_username: user_username_input.value,
            user_pass: user_pass_input.value
        })

        notify(response.data.message, "success")

        setInterval(()=>{
            window.location.href = "/"
        }, 2000)
    }
    catch (err) {
        
        notify(err.response.data.message, "error")

    }
}

function check_user_fillup_or_not() {
    let sendcred_bulean = true;
    if (user_email_input.value === "") {
        document.getElementById('email_feedback').textContent = "Email cannot be empty"
        sendcred_bulean = false;
    }
    if (user_phone_no_input.value === "") {
        document.getElementById('phone_feedback').textContent = "Phone No. cannot be empty"
        sendcred_bulean = false;
    }
    if (user_username_input.value === "") {
        document.getElementById('username_feedback').textContent = "Username cannot be empty"
        sendcred_bulean = false;
    }
    if (user_pass_input.value === "") {
        document.getElementById('pass_feedback').textContent = "Password cannot be empty"
        sendcred_bulean = false;
    }
    if (sendcred_bulean) {
        
        sendcred();
    } 
}

function login_page() {
    
    window.location.href = "/login"
    console.log("sending req to get login page")

}

signup_btn.addEventListener("click", check_user_fillup_or_not);
login_btn.addEventListener("click", login_page);

// debounce(validate_email, user_email_input, 2000);
// debounce(validate_pass, user_pass_input, 2000);
debounce(send_email, user_email_input, 3000)
debounce(send_username, user_username_input, 500);

user_username_input.addEventListener("click", send_phone_no);

