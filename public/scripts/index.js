"use strict";
// Cretaed user templeted for Login functionality

let userTemplate = { name: "Name", username: "UserName", password: "Password" };

let loginstatus = "failed";

let isloggedin = false;

let isAdmin = false;

//on load function for the index page

$(document).ready(function () {
  displayHomePage();

  $("#userLogin").on("submit", function (e) {
    e.preventDefault();

    sendReqToServer("/api/login", "POST", "#userLogin");
  });

  $("#logout").on("click", function (e) {
    e.preventDefault();

    localStorage.removeItem("login");

    localStorage.removeItem("loggedInTime");

    localStorage.removeItem("user");

    localStorage.removeItem("isAdmin");

    window.location = "index.html";
  });
});

// Display the Home page including NavBar and Main content

function displayHomePage() {
  // erase previous contents

  $("#bodyDiv").html("");

  createNavBar();

  handleLogin();

  createSignup();

  createHomepageMainSection();
}

// Created NavBar

function createNavBar() {
  $("title").html("Dance & Music Academy- Home");

  //creating a navshell for the Home page

  let navShell = $(`
  <div class="top-content">
  <nav class="navbar navbar-expand-md navbar-dark fixed-top" id="banner">
  <a class="navbar-brand" href="index.html"><img class="logo" alt="logo"
  src="images/logo/newLogo.png"></a
      <!-- Brand -->
      <!-- Toggler/collapsibe Button -->
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
          <span class="navbar-toggler-icon"></span>
      </button>
      <!-- Navbar links -->
      <div class="collapse navbar-collapse" id="collapsibleNavbar">
          <ul class="navbar-nav ml-auto">
              <li class="nav-item rest">
                  <a class="nav-link" href="#" id="searchLink">Search</a>
              </li>
              <li class="nav-item" id="loginbutton" class="d-block">
                  <a class="nav-link" onclick="enableLoginPage();">Login</a>
              </li>
              <!-- Dropdown -->
              <li class="nav-item dropdown" id="profile" class="d-none">
                  <a class="nav-link dropdown-toggle" id="profileName" data-toggle="dropdown">
                  </a>
                  <div class="dropdown-menu">
                      <a class="dropdown-item" id="logout">Logout</a>
                  </div>
              </li>
          </ul>
      </div>
  </nav>
  <!-- Created Login button in NavBar -->
  <div class="login d-none">
      <div class="pt-5">
          <div class="global-container">
              <div class="card login-form">
                  <div class="card-body">
                      <h3 class="card-title text-center"> Login Form </h3>
                      <div class="card-text">
                          <form id="userLogin">
                             <div class="form-group">
                                  <label for="username"> Enter User Name </label>
                                  <input type="text" class="form-control form-control-sm" id="username"
                                      name="username" aria-describedby="usernameHelp" autofocus>
                              </div>
                              <div class="form-group">
                                  <label for="password">Enter Password </label>
                                  <input type="password" class="form-control form-control-sm" id="password"
                                      name="password">
                              </div>
                              <button type="submit" id="signIn" class="btn btn-primary btn-block"> Sign in </button>
                              <div class="sign-up">
                                  Don't have an account? <a class="link-primary" data-toggle="modal"
                                      data-target="#userSignup"> Create One </a>
                              </div>
                              <input type="button" value="Go back!" onclick="history.back()">
                              <div id="msgDiv" class="text-center" style="background-color:tomato"></div>
                          </form>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
</div>`);

  //add the NavShell to the page

  $("#bodyDiv").append(navShell);
  // Call display Home page
  $("#homeLink").on("click", displayHomePage);
}

// Helper function to call Home Main page - Displaying Images using Boot strap carousel

function createHomepageMainSection() {
  let pageShell = $(`<div class="topContent">
  <div id="carousel" class="carousel slide fwh" data-ride="carousel">

      <ol class="carousel-indicators">

          <li data-target="#carousel" data-slide-to="0" class="active"></li>

          <li data-target="#carousel" data-slide-to="1"></li>

      </ol>

      <div class="carousel-inner">

          <div class="carousel-item active text-center">

              <img src="/images/background/mainbdance.jpg" class="img-fluid img-responsive"
                  class="d-block w-100 h-100" alt="slide-img-1">

              <div class="carousel-caption">

                  <h1 class="carouselCaption">Dance Academy</h1>

                  <div class="carousel-caption-description">

                      <p class="para">

                          Our diverse and dedicated staff holds a passion for teaching proper alignment and technique.

                          Our students are also provided with in-depth instruction for the professional artist world.

                          We incorporate education in self-care, resume assistance, audition advice,

                          and master classes into our curriculum to ensure that students receive adequate training in

                          all aspects of professional life.

                      </p>

                  </div>

              </div>

          </div>

          <div class="carousel-item">

              <img src="/images/background/mainbdance1.jpg" class="img-fluid img-responsive"
                  class="d-block w-100 h-100" alt="slide-img-3">

              <div class="carousel-caption">

                  <h1>Music Academy</h1>

                  <div class="carousel-caption-description">

                      <p class="para">The essential course for your entire worship team. A step-by-step course

                          teaching the skills that make you a seasoned musician and invaluable worship team player. we

                          are specializing in

                          customized private lessons with talented teachers who are committed to high quality

                          instruction and inspiring each student on their musical journey

                      </p>

                  </div>
              </div>
          </div>
      </div>
      <a class="carousel-control-prev" href="#carousel" role="button" data-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="sr-only">Previous</span>
      </a>
      <a class="carousel-control-next" href="#carousel" role="button" data-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="sr-only">Next</span>
      </a>
  </div>
</div>`);

  // Add the carousel to the body

  $("#pageContainer").append(pageShell);

  // Search link

  $("#searchLink").on("click", onClickServicePage);
}
