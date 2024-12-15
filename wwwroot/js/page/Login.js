const url_login = window.AppUrls.loginUrl;
const url_getCustomers = window.AppUrls.getCustomersUrl;

getCustomers();

function getCustomers() {
    
    console.log('getCustomers', url_getCustomers);
    const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
    const token = tokenElement ? tokenElement.value : null;
    if (!token) {
        console.error("CSRF Token not found.");
        return;
    }
    console.log('token', token);
    $.ajax({
        url: url_getCustomers, // URL ของ API
        type: "POST",
        headers: { "RequestVerificationToken": token },
        success: function (data) {
            console.log("data cus", data);

        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
        }
    });
}

$('#btnLogin').click(function () {
    console.log('Summit', url_login);
    const username = $('#username').val();
    const password = $('#password').val();
    const token = $('input[name="__RequestVerificationToken"]').val();

    if (!username) {
        swal("Warning!", "Please Input Username!", { icon: "warning" });
        return;
    }

    if (!password) {
        swal("Warning!", "Please Input Password!", { icon: "warning" });
        return;
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
