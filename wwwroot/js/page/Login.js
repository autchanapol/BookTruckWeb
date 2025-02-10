const url_login = window.AppUrls.loginUrl;
const url_getCustomers = window.AppUrls.getCustomersUrl;


// ดึงค่า username และ password
let usernameInput = document.getElementById("username");
let passwordInput = document.getElementById("password");
let loginForm = document.getElementById("loginForm");

document.addEventListener('DOMContentLoaded', function () {
    loginForm.addEventListener('submit', function (event) {
        if (!loginForm.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }
        loginForm.classList.add('was-validated');
    });
});

// ลบ is-invalid เมื่อพิมพ์
usernameInput.addEventListener("input", function () {
    if (usernameInput.value.trim() !== "") {
        usernameInput.classList.remove("is-invalid");
    }

});

passwordInput.addEventListener("input", function () {
    if (passwordInput.value.trim() !== "") {
        passwordInput.classList.remove("is-invalid");
    }
});

$('#btnLogin').click(function () {

    console.log('Summit', url_login);
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const token = $('input[name="__RequestVerificationToken"]').val();

    if (!username) {
        swal("Warning!", "Please Input Username!", { icon: "warning" });
        usernameInput.classList.add("is-invalid");
        return;
    } else {
        usernameInput.classList.remove("is-invalid");
    }


    if (!password) {
        swal("Warning!", "Please Input Password!", { icon: "warning" });
        passwordInput.classList.add("is-invalid");
        return;
    }
    else {
        passwordInput.classList.remove("is-invalid");
    }
   

    console.log(JSON.stringify({ Username: username, Password: password }));

    $.ajax({
        url: url_login,
        type: 'POST',
        contentType: 'application/json',
        headers: { "RequestVerificationToken": token },
        data: JSON.stringify({ Username: username, Password: password }),
        success: function (response) {
            console.log('data', response);

            if (response.success) {
                // Redirect to the URL provided in the response
                window.location.href = response.redirectUrl;
            } else {
                // Show error message if login failed
                swal("Error!", response.message || "Login failed.", { icon: "error" });
            }
        },
        error: function (xhr, status, error) {
            // Show error message with status and error details
            swal("Error!", `Status: ${xhr.status}, Message: ${xhr.responseText || error}`, { icon: "error" });
        }
    });

});
