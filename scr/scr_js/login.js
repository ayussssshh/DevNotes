

import {data_api, page_api} from "./apis.js"
import "./../scr_css/login.css"
import { notify } from "./notification"


const email_or_username_input = document.getElementById("email_or_username_input");
const email_or_usernamefeedback = document.getElementById("email_or_usernamefeedback");
const password_input = document.getElementById("password_input");
const Password_feedback = document.getElementById("Password_feedback");
const login_btn_loginpage = document.getElementById("login-btn-(login)");
const signup_btn_loginpage = document.getElementById("signup-btn-(login)");


async function login_user(){

    let email_or_username = email_or_username_input.value;
    let password = password_input.value;

    console.log(`login user fnc is started ${email_or_username}`)

        try {

            let response = await data_api.post("/login/login",{
                user_email_or_username: email_or_username,
                password: password
            });

           let login_status = response.data.login_status;
            
           if (login_status === "true") {
             window.location.href = '/'
           } 

        } catch (error) {
            notify(error.response.data.message, "error")
        }

 }

function redirect_signup(){
    window.location.href = "/signup"
}

login_btn_loginpage.addEventListener("click", login_user);
signup_btn_loginpage.addEventListener("click", redirect_signup);

