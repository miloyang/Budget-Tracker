document.addEventListener('DOMContentLoaded', function () {
    var container = document.createElement('div');
    container.className = 'container'; 


    var loginSource = document.getElementById('login-template').innerHTML;
    var signupSource = document.getElementById('signup-template').innerHTML;

    var loginTemplate = Handlebars.compile(loginSource);
    var signupTemplate = Handlebars.compile(signupSource);

var data = {
    logoURL: './images/nobackgroundf.png',  
    signupPageURL: window.location.origin + '/signup-template.html',
    loginPageURL: window.location.origin + '/login-template.html',

};

    var loginHtml = loginTemplate(data);
    var signupHtml = signupTemplate(data);

    container.innerHTML = loginHtml; // For the login page
    container.innerHTML = signupHtml;

    document.body.appendChild(container);
});
