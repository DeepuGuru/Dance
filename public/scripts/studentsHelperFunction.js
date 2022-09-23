// student
  
"use strict";
  
// Helper Function to  display the Students Details based on user type-

function createStudentsListModal(group) {

 let members = group.Members;

  let studentsCount = Object.keys(members).length;

  // call students tabel shell

  let studentsListContents = createTabelShell(group);

  if (isloggedin && isAdmin) {

    studentsListContents = studentsListContents + '<th scope="col">#</th>';

  }

  studentsListContents =

    studentsListContents + "</tr>" + "</thead>" + "<tbody>";

  // Add Students details if the value is greater than 0

  if (studentsCount > 0) {

    $.each(members, function (index, member) {

      let url = "/api/groups/" + group.ClassId + "/members/" + member.StudentId;

      studentsListContents =

        studentsListContents +

        `<tr>

        <th scope="row">${member.StudentId}</th>

        <td>${member.StudentEmail}</td>

        <td>${member.StudentName}</td>

        <td>${member.StudentPhone}</td>`;

      // Create and display Edit and Delete options only for Admin users

      if (isloggedin && isAdmin) {

        // Dynamically create Edit and delete option for the students -> based on number of students count

        studentsListContents =

          studentsListContents +

          "<td>" +

          '<a class="link-primary" data-toggle="modal" data-target="#memberDetailsEdit-' +

          group.ClassId +

          "-" +

          member.StudentId +

          '">Edit</a>  ' +

          '||  <a class="link-danger" data-toggle="modal" data-target="#memberDetailsDetail-' +

          group.ClassId +

          "-" +

          member.StudentId +

          '">Delete</a></td>';

      }

      studentsListContents = studentsListContents + "</tr>";

      if (isloggedin && isAdmin) {

        // Call the Edit and Delete Member functions -> Set the Modal with respective element locators

        createEditStudentModal(group, member);

        createStudentDeleteModal(group, member);

      }

    }); // If there are no students in the class it shows no students message

  } else {

    studentsListContents =

      studentsListContents +

      `<tr>

            <th scope="row" colspan='5'>Will Upload Students Details soon... </th>

        </tr>`;

  }

  // Add the created table contents to the tbody and table

  studentsListContents = studentsListContents + "</tbody></table>" + "</div>";

  studentsListContents =

    studentsListContents +

    `</div>

            <div class="modal-footer">

              <button type="button" class="btn btn-secondary" data-dismiss="modal\">Close</button>                  

            </div>

          </div>

        </div>

      </div>`;

  // Add the Table shell to the main page shell

  $("#groups #groupsRow").append(studentsListContents);

}

 

function createTabelShell(group) {

  return `<div class="modal fade" id="groupMemberList${group.ClassId}" tabindex="-1" role="dialog"

  aria-labelledby="groupDetailsLabel" aria-hidden="true">

  <div class="modal-dialog modal-lg" role="document">

      <div class="modal-content">

          <div class="modal-header">

              <h5 class="modal-title" id="groupDetailsLabel">View ${group.ClassName}'s Members</h5>

              <button type="button" class="close" data-dismiss="modal" aria-label="Close">

                  <span aria-hidden="true">&times;</span>

              </button>

          </div>

          <div class="modal-body">

              <div class="table-responsive">

                  <table class="table table-striped">

                      <thead class='thead-dark'>

                          <tr>

                              <th scope="col">StudentId</th>

                              <th scope="col">StudentEmail</th>

                              <th scope="col">StudentName</th>

                              <th scope="col">StudentPhone</th>`;

}

 

// Helper Function to edit students details -> Admin user only

function createEditStudentModal(group, member) {

  let studentDetailsEditContent = `<div class="modal fade" id="memberDetailsEdit-${group.ClassId}-${member.StudentId}" tabindex="-1" role="dialog"

  aria-labelledby="groupDetailsLabel" aria-hidden="true">

  <div class="modal-dialog" role="document">

      <div class="modal-content">

          <div class="modal-header">

              <h5 class="modal-title" id="groupDetailsLabel">Edit ${member.StudentName} in Group ${group.ClassName}

              </h5>

              <button type="button" class="close" data-dismiss="modal" aria-label="Close">

                  <span aria-hidden="true">&times;</span>

              </button>

          </div>

          <div class="modal-body">

              <form id="editGroupForm-${group.ClassId}-${member.StudentId}" class="form-group container">`;

  // Create loop to add students details in the form

  $.each(member, function (key, value) {

    if (key !== "StudentId") {

      studentDetailsEditContent =

        studentDetailsEditContent +

        `<div class="form-group row">

        <label for="staticEmail" class="col-sm col-form-label">${key}</label>

        <div class="col-sm">

            <input type="text" class="form-control" id="${key}" name="${key}" value="${value}">

        </div>

    </div>`;

    }

  });

  // Set the Url to edit the students details

  let url = "/api/groups/" + group.ClassId + "/members/" + member.StudentId;

  studentDetailsEditContent =

    studentDetailsEditContent +

    `</form>

    </div>

    <div class="modal-footer">

        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>

        <button type="button" class="btn btn-primary"

            onclick="sendReqToServer('${url}','PUT','#editGroupForm-${group.ClassId}-${member.StudentId}');">Save</button>

    </div>

    </div>

    </div>

    </div>`;

  // Click Save button will pass the updated details to the students test data and on UI

  $("#groups #memberModals").append(studentDetailsEditContent);

}

 

// Helper Function to create a New Students Details

function createAddNewStudentModal(group) {

  let members = group.Members;

  let classSize = Number(group.ClassSize); // Get the Maximum class size

  let studentsCount = Object.keys(members).length; // get the students count

  let ClassDetailsAddContent = "";

  // Set condition if students is less than class size generate the ADd New students Form

  if (studentsCount < classSize) {

    ClassDetailsAddContent = `<div class="modal fade" id="addMemberToGroup${group.ClassId}" tabindex="-1" role="dialog"

     aria-labelledby="addMemberToGroupLabel" aria-hidden="true">

     <div class="modal-dialog" role="document">

         <div class="modal-content">

             <div class="modal-header">

                 <h5 class="modal-title" id="addMemberToGroupLabel">Enter new Student details to ${group.ClassName} Class

                 </h5>

                 <button type="button" class="close" data-dismiss="modal" aria-label="Close">

                     <span aria-hidden="true">&times;</span>

                 </button>

             </div>

             <div class="modal-body">

                 <form id="addMemberToGroupForm${group.ClassId}" class="form-group container">`;

    // Create a table from the student label array and students test data

    $.each(StudentsLabel, function (key, value) {

      if (key !== "Members") {

        ClassDetailsAddContent =

          ClassDetailsAddContent +

          `<div class="form-group row">

          <label for="staticEmail" class="col-sm col-form-label">${value}</label>

          <div class="col-sm">

              <input type="text" class="form-control" id="${value}" name="${value}" required>

          </div>

      </div>`;

      }

    });

    // Create URL to POST the students details

    let url = "/api/groups/" + group.ClassId + "/members";

    ClassDetailsAddContent =

      ClassDetailsAddContent +

      `</form></div>

            <div class="modal-footer">

              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>

              <button type="button" class="btn btn-primary" onclick="sendReqToServer('${url}','POST','#addMemberToGroupForm${group.ClassId}');">Save</button>

            </div>

          </div>

        </div>

      </div>`;

  } // If the Class size is equal to the student count then display the  No spot avaliable message to the user

  else {

    ClassDetailsAddContent = `<div class="modal fade" id="addMemberToGroup${group.ClassId}" tabindex="-1" role="dialog" aria-labelledby="addMemberToGroupLabel" aria-hidden="true">

        <div class="modal-dialog" role="document">

          <div class="modal-content">

            <div class="modal-header">

              <h5>Currently No Spot is Avaliable in this ${group.ClassName} class </h5>

              <button type="button" class="close" data-dismiss="modal" aria-label="Close">

                <span aria-hidden="true">&times;</span>

              </button>

            </div>

            </div>

          </div>

        </div>`;

  }

  //Model to Add Group

 

  $("#addGroupButtonPlaceholder").append(ClassDetailsAddContent);

}

 

// Helper function to delete Student details

function createStudentDeleteModal(group, member) {

  let groupDetailsDeleteContent =

    '<div class="modal fade" id="memberDetailsDetail-' +

    group.ClassId +

    "-" +

    member.StudentId +

    '" tabindex="-1" role="dialog" aria-labelledby="groupDetailsDeleteLabel" aria-hidden="true">' +

    '<div class="modal-dialog" role="document">' +

    '<div class="modal-content">' +

    '<div class="modal-header">' +

    '<h5 class="modal-title" id="groupDetailsDeleteLabel">Delete ' +

    member.StudentName +

    "</h5>" +

    '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +

    '<span aria-hidden="true">&times;</span>' +

    "</button>" +

    "</div>" +

    '<div class="modal-body">Are you sure to delete the ' +

    member.StudentName +

    " from Group " +

    group.ClassName +

    " ?";

  // Create URL to delete the details

  let deleteUrl =

    "/api/groups/" + group.ClassId + "/members/" + member.StudentId;

  // After click ok button on confirm modal details should get delete

  groupDetailsDeleteContent =

    groupDetailsDeleteContent +

    "</div>" +

    '<div class="modal-footer">' +

    '<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>' +

    '<button type="submit" class="btn btn-primary" onclick="sendReqToServer(\'' +

    deleteUrl +

    "','DELETE',null);\">Ok</button>" +

    "</div>" +

    "</div>" +

    "</div>" +

    "</div>";

  $("#groups #memberModals").append(groupDetailsDeleteContent);

}