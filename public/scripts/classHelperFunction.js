// Create Add Grop Option on Search Page

function createAddGroupModal() {

    // Model to Add Clas on Search Page - Admin user
  
    let ClassDetailsAddContent = `<div class="modal fade" id="addGroup" tabindex="-1" role="dialog" aria-labelledby="addGroupLabel" aria-hidden="true">"+
  
                            <div class="modal-dialog" role="document">
  
        <div class="modal-content">
  
            <div class="modal-header">
  
                <h5 class="modal-title" id="addGroupLabel">Add New Class</h5>
  
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
  
                    <span aria-hidden="true">&times;<span>
  
                </button>
  
            </div>
  
            <div class="modal-body">
  
                <form id="addGroupForm" class=form-group container">`;
  
    $.each(ClassLabel, function (key, value) {
  
      if (key !== "Members") {
  
        if (value !== "AcademyName") {
  
          ClassDetailsAddContent =
  
            ClassDetailsAddContent +
  
            `<div class="form-group row">
  
            <label for="staticEmail" class="col-sm col-form-label"><b>${value}</b></label>
  
            <div class="col-sm">
  
                <input type="text" class="form-control" id="${value}" name="${value}" required>
  
            </div>
  
        </div>`;
  
        } else if (value === "AcademyName") {
  
          ClassDetailsAddContent =
  
            ClassDetailsAddContent +
  
            `<div class="form-group row">
  
            <label for="staticEmail" class="col-sm col-form-label"><b>${value}</b></label>
  
            <div class="col-sm">
  
                <select class="form-control" id="${value}" name="${value}" required>
  
                    <option value="">Select Class</option>
  
                    <option value="Dance Academy">Dance Academy</option>
  
                    <option value="Music Academy">Music Academy</option>
  
                </select>
  
            </div>
  
        </div>`;
  
        }
  
      }
  
    });
  
    let url = "/api/addgroups"; // Add new Class to Class test data via passing URL, Post by clicking Save Button on Add New Class Form
  
    ClassDetailsAddContent =
  
      ClassDetailsAddContent +
  
      `</form>
  
      </div>
  
      <div class="modal-footer">
  
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
  
          <button type="button" class="btn btn-primary"
  
              onclick="sendReqToServer('${url}','POST','#addGroupForm');">Save</button>
  
      </div>
  
      </div>
  
      </div>
  
     </div>`;
  
    $(ClassDetailsAddContent).insertAfter("#addGroupButton");
  
  }
  
   
  
  // Helper function to display Modal after clicking details buttton on cards (groups)
  
  function createGroupDetailsModal(group) {
  
    var ClassDetailsContent = `<div class="modal fade" id="groupDetails${group.ClassId}" tabindex="-1" role="dialog"
  
      aria-labelledby="groupDetailsLabel" aria-hidden="true">
  
    <div class="modal-dialog" role="document">
  
        <div class="modal-content">
  
            <div class="modal-header">
  
                <h5 class="modal-title" id="groupDetailsLabel">${group.ClassName}</h5>
  
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
  
                    <span aria-hidden="true">&times;</span>
  
                </button>
  
            </div>
  
            <div class="modal-body">`;
  
    $.each(group, function (key, value) {
  
      if (key !== "Members") {
  
        ClassDetailsContent =
  
          ClassDetailsContent +
  
          `<div class="form-group row">
  
          <label for="staticValue" class="col-sm col-form-label"><b>${key}</b></label>
  
          <label for="staticValue" class="col-sm col-form-label">${value}</label>
  
      </div>`;
  
      }
  
    });
  
   
  
    // Only show Edit and Save Option on Add New Class Form to the Admin user only -> register and other user dont have option to Save and Edit
  
    if(isloggedin && isAdmin){
  
    ClassDetailsContent =
  
      ClassDetailsContent +
  
      `</div>
  
            <div class="modal-footer">                         
  
              <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#groupDetailsEdit${group.ClassId}" data-ClassId='${group.ClassId}'>Edit</button>
  
              <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#groupDetailsDelete${group.ClassId}" data-ClassId='${group.ClassId}'>Delete</button>                         
  
            </div>
  
          </div>
  
        </div>
  
      </div>`;
  
  }
  
  $("#groups #groupsRow").append(ClassDetailsContent);
  
  }
  
   
  
  // Helper function to delete the Class on Search page
  
  function createGroupDeleteModal(group) {
  
    let classDetailsDeleteContent = `<div class="modal fade" id="groupDetailsDelete${group.ClassId}" tabindex="-1" role="dialog"
  
    aria-labelledby="groupDetailsDeleteLabel" aria-hidden="true">
  
    <div class="modal-dialog" role="document">
  
        <div class="modal-content">
  
            <div class="modal-header">
  
                <h5 class="modal-title" id="groupDetailsDeleteLabel">Delete ${group.ClassName}</h5>
  
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
  
                    <span aria-hidden="true">&times;</span>
  
                </button>
  
            </div>
  
            <div class="modal-body"><b>Are you sure to delete the ${group.ClassName}?</b>`;
  
  // Delete existing Class from Class test data via passing URL, DELETE by clicking Ok Button
  
    let deleteUrl = "/api/groups/" + group.ClassId;
  
    classDetailsDeleteContent =
  
      classDetailsDeleteContent +
  
      `</div>
  
            <div class="modal-footer">
  
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
  
                <button type="button" class="btn btn-primary" onclick="sendReqToServer('${deleteUrl}','DELETE',null);">Ok</button>
  
            </div>
  
            </div>
  
        </div>
  
        </div>`;
  
   
  
    $("#groups #groupsRow").append(classDetailsDeleteContent);
  
  }
  
   
  
  // Helper Function to create Class Edit Modal
  
  function createGroupEditModal(group) {
  
    let classDetailsEditContent = `<div class="modal fade" id="groupDetailsEdit${group.ClassId}" tabindex="-1" role="dialog" aria-labelledby="groupDetailsLabel" aria-hidden="true">
  
        <div class="modal-dialog" role="document">
  
          <div class="modal-content">
  
            <div class="modal-header">
  
              <h5 class="modal-title" id="groupDetailsLabel">Edit ${group.ClassName}</h5>
  
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
  
                <span aria-hidden="true">&times;</span>
  
              </button>
  
            </div>
  
            <div class="modal-body"><form id="editGroupForm${group.ClassId}" class="form-group container">`;
  
    $.each(group, function (key, value) {
  
      if (key !== "Members") {
  
        classDetailsEditContent =
  
          classDetailsEditContent +
  
          `<div class="form-group row">
  
            <label for="staticEmail" class="col-sm col-form-label"><b>${key}</b></label>                     
  
            <div class="col-sm">
  
              <input type="text" class="form-control" id="${key}" name="${key}" value="${value}">
  
            </div>
  
          </div>`;
  
      }
  
    });
  
    // Modify the existing Class Details from Class test data via passing URL, PUT by clicking Save Button
  
    let url = `/api/groups/:${group.ClassId}`;
  
    classDetailsEditContent =
  
      classDetailsEditContent +
  
      `</form></div>
  
            <div class="modal-footer">
  
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
  
              <button type="button" class="btn btn-primary" onclick="sendReqToServer('${url}','PUT','#editGroupForm${group.ClassId}');">Save</button>
  
            </div>
  
          </div>
  
        </div>
  
      </div>`;
  
    $("#groups #groupsRow").append(classDetailsEditContent);
  
  }
  
   
  
  