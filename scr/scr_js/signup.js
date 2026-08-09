
import isEmail from "validator/lib/isEmail";
import {data_api, page_api} from "./apis.js";
import "./../scr_css/signup.css"
import { notify } from "./notification"


// debounce fnc for showing feedback for email and pass

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



let valid_user_email = "";
let valid_user_pass = "";

//validating email

function validate_email() {
    let user_email = user_email_input.value;
    if (isEmail(user_email)) {
        document.getElementById('email_feedback').textContent = ""
        return valid_user_email = user_email;
    } else {
        document.getElementById('email_feedback').textContent = "Please provide a valid email"
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
        return valid_user_pass = user_pass
    } else {
        document.getElementById('pass_feedback').textContent = "Please create a Strong password";
    }
}

// sending email to backend for checking the email already exist or not

async function send_email() {
    
    validate_email();
    try {
        
        const response = await data_api.post('/signup/check_email', {
            user_email: valid_user_email
        });
        
    } catch (error) {
        document.getElementById('email_feedback').textContent = "This email address is already associated with an account. Please use a different email address."
    }
}

async function send_phone_no() {
    console.log('sending phone no to backend for check')
    try {
        
        let response = await data_api.post("/signup/check_phone_no", {
            phone_no: user_phone_no_input.value
        })
        
    } catch (error) {
        document.getElementById('phone_feedback').textContent = "Phone number. is used many times, use diffrent phone number"
    }
}

// send username to backend for checking
async function send_username() {
    
    try {
        let response = await data_api.post('/signup/check_username', {
            username: user_username_input.value
        })

        console.log(user_username_input.value)
        if (response.data.exists === "exist") {
            document.getElementById('username_feedback').textContent = "username is already is being used, try a diffrent one"
        } else {
            document.getElementById('username_feedback').textContent = ""
        }
    } catch (error) {
        console.log(error)
    }
}

// sending cred to backend

async function sendcred() {

    validate_email();
    validate_pass();

    try {
        const response = await data_api.post('/signup/signup', {
            user_email: valid_user_email,
            phone_no: user_phone_no_input.value,
            user_username: user_username_input.value,
            user_pass: valid_user_pass
        })
    }
    catch (err) {
        console.log(err);
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

async function login_page() {
    try {
        window.location.href = "/login"
        console.log("sending req to get login page")
    } catch (err) {
        console.log(err)
    }
}

signup_btn.addEventListener("click", check_user_fillup_or_not);
login_btn.addEventListener("click", login_page);

debounce(validate_email, user_email_input, 2000);
debounce(validate_pass, user_pass_input, 2000);
debounce(send_email, user_email_input, 3000)
debounce(send_username, user_username_input, 500);

user_username_input.addEventListener("click", send_phone_no);

