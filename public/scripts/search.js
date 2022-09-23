"use strict";

let selectedvalue = " ";

function onClickServicePage() {

  drawSearchPage();

}

let organizations = null;

// Create Array for the Class Tables

let ClassLabel = [

  "ClassName",

  "AcademyName",

  "TeacherName",

  "TeacherPhone",

  "TeacherEmail",

  "ClassSize",

  "Image",

  "Description",

];

let StudentsLabel = ["StudentEmail", "StudentName", "StudentPhone"];



// Create a SearchPage

function drawSearchPage() {

  $("#pageContainer").html("");

  $(".login").html("");

  $("title").html("Dance & Music Academy- SearchPage");

  let searchShell = `<br>

  <section id="search" class=" text-center">

      <div class="container">

          <h4 class="heading1">Explore Our Classes</h4>

          <p class="heading">

              All classes are taught by experienced professionals providing a positive and challenging program for every

              student.

          <p>

              <select id="event" autofocus>

              </select>

          <div id="addGroupButtonPlaceholder">

          </div>

      </div>

      <div id="groups" class="album">

          <div class="container">

              <div id="groupsRow" class="row">

              </div>

              <div id="memberModals"></div>

          </div>

      </div>

      </div>

  </section>`;

  $("#pageContainer").append(searchShell);



  // Call api to load Academy dropdown from organization.json file

  $.getJSON("/api/organizations", function (result) {

    organizations = result;

    loadDropdown();

  });

  $("#event").on("change", onChangeClassselection);

}



//Load the class Category Drop Down List

function loadDropdown() {

  $("#event").append($("<option>").attr("value", "").text("Select Class"));

  organizations.sort(function (a, b) {

    if (a.organizations < b.organizations) return -1;

    else if (a.organizations == b.organizations) return 0;

    return 1;

  });

  $.each(organizations, function (index, organization) {

    $("#event").append(

      $("<option>")

        .attr("value", organization.OrganizationId)

        .text(organization.AcademyName)

    );

  });

  $("#event").append(

    $("<option>").attr("value", "viewAllEvent").text("View All")

  );

  // Make visiable Add Class Option only for the Admin users

  if (isloggedin && isAdmin) {

    let addgroupModal =

      '<button type="button" id="addGroupButton" class="btn btn-sm btn-primary" data-toggle="modal" data-target="#addGroup" data-ClassId="1">Add a Class</button>';

    $("#addGroupButtonPlaceholder").append(addgroupModal);

    // Display Add a New class Modal form after clicking the Add Class option -> Only for Admin user

    createAddGroupModal();

  }

}



// Helper function to select the groups

function onChangeClassselection() {

  selectedvalue = $("#event").val();

  $("#groups #groupsRow").empty();



  // Based on selection from the Academy system displays the respective cards

  if (selectedvalue === "viewAllEvent") {

    // Api call to groups to display classes details on the search page -> if user selects viewAllEvents

    $.getJSON("/api/groups", function (results, status) {

      displayGroupCard(results);

    });

  } else {

    // Api call to groups by providing selected value to display classes details on the search page -> if user selects Dance Academy or Music Academy

    $.getJSON(

      "/api/groups/byorganization/" + selectedvalue,

      function (results, status) {

        displayGroupCard(results);

      }

    );

  }

}



// Helper function to handle login functionalities

function handleLogin() {

  // Get the Login status

  loginstatus = localStorage.getItem("login");

  if (loginstatus === "success") {

    isloggedin = true;

    $("#loginbutton").addClass("d-none");

    $("#profile").addClass("d-block");

    let user = JSON.parse(localStorage.getItem("user"));

    $("#profileName").text("Welcome " + user.username);

    // Check for Admin user - If user as Admin then set as true or set as false

    isAdmin = localStorage.getItem("isAdmin") == "true" ? true : false;



    $("#loginbutton").removeClass("d-block");

    $("#profile").removeClass("d-none");

  } else if (loginstatus === "failed") {

    isloggedin = false;

    $("#profile").addClass("d-none");

    $("#loginbutton").addClass("d-block");



    $("#profile").removeClass("d-block");

    $("#loginbutton").removeClass("d-none");

  }

}



function createSignup() {

  //Create a User registartion Form

  let userSignupContent = `<div class="modal fade" id="userSignup" tabindex="-1" role="dialog" aria-labelledby="userSignupLabel" aria-hidden="true">

      <div class="modal-dialog" role="document">

      <div class="modal-content">

      <div class="modal-header">

      <h5 class="modal-title" id="userSignupLabel">Create an Account</h5>

      <button type="button" class="close" data-dismiss="modal" aria-label="Close">

        <span aria-hidden="true">&times;</span>

      </button>

      </div>

    <div class="modal-body"><form id="userSignupForm" class="form-group container">`;

  $.each(userTemplate, function (key, value) {

    let type = key === "password" ? "password" : "text";

    userSignupContent =

      userSignupContent +

      '<div class="form-group row">' +

      '<label for="staticEmail" class="col-sm col-form-label">' +

      value +

      "</label>" +

      '<div class="col-sm">' +

      '<input type="' +

      type +

      '" class="form-control" id="' +

      key +

      '" name="' +

      key +

      '">' +

      "</div>" +

      "</div>";

  });

  let url = "/api/users";

  userSignupContent =

    userSignupContent +

    `</form></div>

    <div class="modal-footer">

    <button type="button" class="btn btn-secondary " data-dismiss="modal">Close</button>

   <button type="button" class="btn btn-primary" onclick="sendReqToServer('${url}','POST','#userSignupForm');\">Save</button>

    </div>

    </div>

    </div>

    </div>`;

  $(".sign-up").append(userSignupContent);

}



function createCards(group) {

  let cardDetail = `<div class="card-group col-md-4">

  <div class="card mb-4 box-shadow">

      <img class="card-img-top" src="${group.Image}" alt="Thumbnail">

      <div class="card-body">

          <div class="card-text">${group.Description}</div>

          <div class="d-flex justify-content-between align-items-center">

              <div class="btn-group btn-group-justified w-100">

                  <button type="button" class="btn btn-sm details" data-toggle="modal"

                      data-target="#groupDetails${group.ClassId}" data-ClassId=${group.ClassId}>Details</button> &nbsp`;

  if (isloggedin) {

    cardDetail =

      cardDetail +

      `<button type="button" class="btn btn-sm btn-primary" data-toggle="modal"

                        data-target="#addMemberToGroup${group.ClassId}" data-ClassId=${group.ClassId}>Add

                        Me</button>&nbsp

                        <button type="button" class="btn btn-sm membersList" data-toggle="modal"

                      data-target="#groupMemberList${group.ClassId}" data-ClassId=${group.ClassId}>Students

                      List</button>`;

  }

  cardDetail =

    cardDetail +

    `

              </div>

          </div>

      </div>

  </div>

</div

  `;

  $("#groups #groupsRow").append(cardDetail);

}



//Helper function to display the groups based on selected category in cards

function displayGroupCard(groups) {

  $.each(groups, function (index, group) {

    // Set condition to display Class and students for the user role

    createCards(group);

    createGroupDetailsModal(group);

    if (isloggedin) {

      if (isAdmin) {

        createGroupDeleteModal(group);

        createGroupEditModal(group);

      }

      createStudentsListModal(group);

      createAddNewStudentModal(group);

    }



  });

}



function enableLoginPage() {

  $(".topContent").removeClass("d-block");

  $("searchLink").removeClass("d-block");

  $(".login").removeClass("d-none");



  $(".topContent").addClass("d-none");

  $("searchLink").addClass("d-none");

  $(".login").addClass("d-block");

}



// Common function to call all the API calls with parameters - Url, type of call and locator

function sendReqToServer(url, type, formID) {

  let form = $(formID);

  let data = formID === null ? formID : $(formID).serialize();

  $.ajax({

    url: url,

    type: type,

    data: data,

  }) // Perform below Function after the sucessful Api call

    .done(function (result) {

      console.log("result", result);

      if (url === "/api/login") {

        localStorage.setItem("login", "success");

        localStorage.setItem("loggedInTime", new Date($.now()));

        let user = JSON.parse(result);

        if (user.username === "admin") {

          localStorage.setItem("isAdmin", true);

        } else {

          localStorage.setItem("isAdmin", false);

        }

        localStorage.setItem("user", result);

        window.location = "index.html";

      } else if (url === "/api/users") {

        window.location = "index.html";

      } else {

        $(".modal-backdrop.fade.show").hide();

        $("body").removeClass("modal-open");

        $.getJSON(

          "/api/groups/byorganization/" + selectedvalue,

          function (results, status) {

            displayGroupCard(results);

          }

        );

        drawSearchPage(selectedvalue);

      }

    })  // Perform below Function if API call gets failed

    .fail(function (result) {

      if (url === "/api/login") {

        localStorage.setItem("login", "failed");

        localStorage.removeItem("loggedInTime");

        localStorage.removeItem("user");

        localStorage.removeItem("isAdmin");

        $("#msgDiv").html("Please Check your Credientials ")

      }

    });

}

