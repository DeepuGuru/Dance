"use strict";

let express = require("express");
let bodyParser = require("body-parser");
let fs = require("fs");

let app = express();
app.use(bodyParser.json());

// Create application/x-www-form-urlencoded parser
let urlencodedParser = bodyParser.urlencoded({ extended: false });


///////////////////////////////////////////////
// ------ Get next ID helper ------------------

function getNextId(counterType)  // use 'group' or 'member' or 'user' as counterType
{
    // read the counter file
    let data = fs.readFileSync(__dirname + "/data/counters.json", "utf8");
    data = JSON.parse(data);

    // find the next id from the counters file and then increment the
    // counter in the file to indicate that id was used
    let id = -1;
    switch (counterType.toLowerCase()) {
        case "group":
            id = data.nextGroup;
            data.nextGroup++;
            break;
        case "member":
            id = data.nextMember;
            data.nextMember++;
            break;
        case "user":
            id = data.nextUser;
            data.nextUser++;
            break;
    }

    // save the updated counter
    fs.writeFileSync(__dirname + "/data/counters.json", JSON.stringify(data));

    return id;
}

///////////////////////////////////////////////
// ------ Validation helpers ------------------

function isValidGroup(group) {
    if (group.ClassName == undefined || group.ClassName.trim() == "")
        return 1;
    if (group.AcademyName == undefined || group.AcademyName.trim() == "")
        return 2;
    if (group.TeacherName == undefined || group.TeacherName.trim() == "")
        return 3;
    if (group.TeacherPhone == undefined || group.TeacherPhone.trim() == "")
        return 4;
    if (group.TeacherEmail == undefined || group.TeacherEmail.trim() == "")
        return 5;
    if (group.ClassSize == undefined || isNaN(group.ClassSize))
        return 6;

    return -1;
}

function isValidMember(member) {
    if (member.StudentEmail == undefined || member.StudentEmail.trim() == "")
        return 1;
    if (member.StudentName == undefined || member.StudentName.trim() == "")
        return 2;
    if (member.StudentPhone == undefined || member.StudentPhone.trim() == "")
        return 3;

    return -1;
}

///////////////////////////////////////////////
// --------------------------------------------

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/" + "index.html");
});


///////////////////////////////////////////////
// ------ REST API endpoints-------------------

/* ************************************************************************* */
// NOTE:  To make debugging easy, these methods echo their processing through
//        to the terminal window.  This means there may be some unnecessary
//        parsing and stringifying.  But it is worth it as you debug your code.
/* ************************************************************************* */

// GET ORGANIZATION
app.get("/api/organizations", function (req, res) {
    console.log("Received a GET request for all organizations");

    let data = fs.readFileSync(__dirname + "/data/organizations.json", "utf8");
    data = JSON.parse(data);

    console.log("Returned data is: ");
    console.log(data);
    res.end(JSON.stringify(data));
});

// GET ALL GROUPS
app.get("/api/groups", function (req, res) {
    console.log("Received a GET request for all groups");

    let data = fs.readFileSync(__dirname + "/data/groups.json", "utf8");
    data = JSON.parse(data);

    console.log("Returned data is: ");
    console.log(data);
    res.end(JSON.stringify(data));
});

// GET ONE GROUP BY ID
app.get("/api/groups/:id", function (req, res) {
    let id = req.params.id;
    console.log("Received a GET request for group " + id);

    let data = fs.readFileSync(__dirname + "/data/groups.json", "utf8");
    data = JSON.parse(data);

    let matchingGroup = data.find(element => element.ClassId == id);
    if (!matchingGroup) {
        res.status(404).send("Group Not Found");
        console.log("Group not found");
        return;
    }

    console.log("Returned data is: ");
    console.log(matchingGroup);
    res.end(JSON.stringify(matchingGroup));
});

// GET MANY GROUPS BY ORGANIZATION
app.get("/api/groups/byorganization/:id", function (req, res) {
    let id = req.params.id;
    console.log("Received a GET request for groups in organization " + id);

    let orgData = fs.readFileSync(__dirname + "/data/organizations.json", "utf8");
    orgData = JSON.parse(orgData);

    let matchingOrganization = orgData.find(element => element.OrganizationId.toLowerCase() == id.toLowerCase());
    if (!matchingOrganization) {
        res.status(404).send("Organization Not Found");
        console.log("Organization Not Found");
        return;
    }

    let data = fs.readFileSync(__dirname + "/data/groups.json", "utf8");
    data = JSON.parse(data);

    // find the matching groups for a specific organization
    let matchingGroups = data.filter(element => element.AcademyName == matchingOrganization.AcademyName);

    console.log("Returned data is: ");
    console.log(matchingGroups);
    res.end(JSON.stringify(matchingGroups));
});

// GET A SPECIFIC MEMBER IN A SPECIFIC GROUP
app.get("/api/groups/:ClassId/members/:StudentId", function (req, res) {
    let ClassId = req.params.ClassId;
    let StudentId = req.params.StudentId;
    console.log("Received a GET request for member " + StudentId + " in group " + ClassId);

    let data = fs.readFileSync(__dirname + "/data/groups.json", "utf8");
    data = JSON.parse(data);

    // find the group
    let matchingGroup = data.find(element => element.ClassId == ClassId);
    if (!matchingGroup) {
        res.status(404).send("Group Not Found");
        console.log("Group Not Found");
        return;
    }

    // find the member 
    let matchingMember = matchingGroup.Members.find(m => m.StudentId == StudentId);
    if (!matchingMember) {
        res.status(404).send("Member Not Found");
        console.log("Member Not Found");
        return;
    }

    console.log("Returned data is: ");
    console.log(matchingMember);
    res.end(JSON.stringify(matchingMember));
});

// ADD A GROUP
app.post("/api/addgroups", urlencodedParser, function (req, res) {
    console.log("Received a POST request to add a group");
    console.log("BODY -------->" + JSON.stringify(req.body));

    // assemble group information so we can validate it
    let group = {
        ClassId: getNextId("group"),  // assign id to group
        ClassName: req.body.ClassName,
        AcademyName: req.body.AcademyName,
        TeacherName: req.body.TeacherName,
        TeacherPhone: req.body.TeacherPhone,
        TeacherEmail: req.body.TeacherEmail,
        ClassSize: Number(req.body.ClassSize),
        Image: req.body.Image,
        Description: req.body.Description,
        Members: []
    };

    console.log("Performing validation...");
    let errorCode = isValidGroup(group);
    if (errorCode != -1) {
        console.log("Invalid data found! Reason: " + errorCode);
        res.status(400).send("Bad Request - Incorrect or Missing Data");
        return;
    }

    let data = fs.readFileSync(__dirname + "/data/groups.json", "utf8");
    data = JSON.parse(data);

    // add the group
    data.push(group);

    fs.writeFileSync(__dirname + "/data/groups.json", JSON.stringify(data));

    console.log("Group added: ");
    console.log(group);

    //res.status(201).send(JSON.stringify(group));
    res.end(JSON.stringify(group));  // return the new group w it's ClassId
});

// EDIT A GROUP
app.put("/api/groups/:id", urlencodedParser, function (req, res) {
    let ClassId = req.params.id;
    console.log("Received a PUT request to edit group " + ClassId);
    console.log("BODY -------->" + JSON.stringify(req.body));

    // assemble group information so we can validate it
    let group = {
        ClassId: Number(req.body.ClassId),
        ClassName: req.body.ClassName,
        AcademyName: req.body.AcademyName,
        TeacherName: req.body.TeacherName,
        TeacherPhone: req.body.TeacherPhone,
        TeacherEmail: req.body.TeacherEmail,
        ClassSize: Number(req.body.ClassSize),
        Image: req.body.Image,
        Description: req.body.Description,
    };

    
    console.log("Performing validation...");
    let errorCode = isValidGroup(group);
    if (errorCode != -1) {
        console.log("Invalid data found! Reason: " + errorCode);
        res.status(400).send("Bad Request - Incorrect or Missing Data");
        return;
    }

    let data = fs.readFileSync(__dirname + "/data/groups.json", "utf8");
    data = JSON.parse(data);

    
    // find the group
    let match = data.find(element => element.ClassId == group.ClassId);
    if (!match) {
        res.status(404).send("Group Not Found");
        console.log("Group Not Found");
        return;
    }

    // update the group
    match.ClassName = group.ClassName;
    match.AcademyName = group.AcademyName;
    match.TeacherName = group.TeacherName;
    match.TeacherPhone = group.TeacherPhone;
    match.TeacherEmail = group.TeacherEmail;
    match.Image = group.Image;
    match.Description = group.Description;

    // make sure new values for ClassSize doesn't invalidate grooup
    if (Number(group.ClassSize) < match.Members.length) {
        res.status(409).send("New group size too small based on current number of members");
        console.log("New group size too small based on current number of members");
        return;
    }
    match.ClassSize = Number(group.ClassSize);

    fs.writeFileSync(__dirname + "/data/groups.json", JSON.stringify(data));

    console.log("Update successful!  New values: ");
    console.log(match);
    res.status(200).send();
});

// DELETE A GROUP
app.delete("/api/groups/:id", function (req, res) {
    let id = req.params.id;
    console.log("Received a DELETE request for group " + id);

    let data = fs.readFileSync(__dirname + "/data/groups.json", "utf8");
    data = JSON.parse(data);

    // find the index number of the group in the array
    let foundAt = data.findIndex(element => element.ClassId == id);

    // delete the group if found
    if (foundAt != -1) {
        data.splice(foundAt, 1);
    }

    fs.writeFileSync(__dirname + "/data/groups.json", JSON.stringify(data));

    console.log("Delete request processed");
    // Note:  even if we didn't find the group, send a 200 because they are gone
    res.status(200).send();
});

// ADD A MEMBER TO A GROUP
app.post("/api/groups/:id/members", urlencodedParser, function (req, res) {
    let id = req.params.id;
    console.log("Received a POST request to add a member to group " + id);
    console.log("BODY -------->" + JSON.stringify(req.body));

    // assemble member information so we can validate it
    let member = {
        StudentId: getNextId("member"),   // assign new id
        StudentEmail: req.body.StudentEmail,
        StudentName: req.body.StudentName,
        StudentPhone: req.body.StudentPhone
    };

    console.log("Performing member validation...");
    let errorCode = isValidMember(member);
    if (errorCode != -1) {
        console.log("Invalid data found! Reason: " + errorCode);
        res.status(400).send("Bad Request - Incorrect or Missing Data");
        return;
    }

    let data = fs.readFileSync(__dirname + "/data/groups.json", "utf8");
    data = JSON.parse(data);

    // find the group
    let matchingGroup = data.find(element => element.ClassId == id);
    if (!matchingGroup) {
        res.status(404).send("Group Not Found");
        console.log("Group Not Found");
        return;
    }

    if (matchingGroup.Members.length == matchingGroup.ClassSize) {
        res.status(409).send("Member not added - group at capacity");
        console.log("Member not added - group at capacity");
        return;
    }

    // add the member
    matchingGroup.Members.push(member);

    fs.writeFileSync(__dirname + "/data/groups.json", JSON.stringify(data));

    console.log("New member added!");
    console.log(member);

    //res.status(201).send(JSON.stringify(member));
    res.end(JSON.stringify(member));  // return the new member with member id
});

// EDIT A MEMBER IN A GROUP
app.put("/api/groups/:ClassId/members/:StudentId", urlencodedParser, function (req, res) {
    let ClassId = req.params.ClassId;
    let StudentId = req.params.StudentId;
    console.log("Received a PUT request to edit member " + StudentId + " in group " + ClassId);
    console.log("BODY -------->" + JSON.stringify(req.body));

    // assemble member information so we can validate it
    let member = {
        StudentId: StudentId,
        StudentEmail: req.body.StudentEmail,
        StudentName: req.body.StudentName,
        StudentPhone: req.body.StudentPhone
    };

    console.log("Performing member validation...");
    let errorCode = isValidMember(member);
    if (errorCode != -1) {
        console.log("Invalid data found! Reason: " + errorCode);
        res.status(400).send("Bad Request - Incorrect or Missing Data");
        return;
    }

    // find the group
    let data = fs.readFileSync(__dirname + "/data/groups.json", "utf8");
    data = JSON.parse(data);

    // find the group
    let matchingGroup = data.find(element => element.ClassId == ClassId);
    if (!matchingGroup) {
        res.status(404).send("Group Not Found");
        console.log("Group Not Found");
        return;
    }

    // find the member
    let match = matchingGroup.Members.find(m => m.StudentId == StudentId);
    if (!match) {
        res.status(404).send("Member Not Found");
        console.log("Member Not Found");
        return;
    }

    // update the member
    match.StudentEmail = req.body.StudentEmail;
    match.StudentName = req.body.StudentName;
    match.StudentPhone = req.body.StudentPhone;

    fs.writeFileSync(__dirname + "/data/groups.json", JSON.stringify(data));

    console.log("Member updated!");
    res.status(200).send();
});

// DELETE A MEMBER IN A GROUP
app.delete("/api/groups/:ClassId/members/:StudentId", urlencodedParser, function (req, res) {
    let ClassId = req.params.ClassId;
    let StudentId = req.params.StudentId;
    console.log("Received a DELETE request for member " + StudentId + " in group " + ClassId);

    // find the group
    let data = fs.readFileSync(__dirname + "/data/groups.json", "utf8");
    data = JSON.parse(data);

    let matchingGroup = data.find(element => element.ClassId == ClassId);
    if (!matchingGroup) {
        res.status(404).send("Group Not Found");
        console.log("Group Not Found");
        return;
    }

    // find the member
    let foundAt = matchingGroup.Members.findIndex(member => member.StudentId == StudentId);

    // delete the member if found
    if (foundAt != -1) {
        matchingGroup.Members.splice(foundAt, 1);
    }

    fs.writeFileSync(__dirname + "/data/groups.json", JSON.stringify(data));

    console.log("Delete request completed!");
    // Note:  even if we didn't find them, send a 200 back because they are gone
    res.status(200).send();
});

// -------------------------------
// USER MANAGEMENT endpoints below

// GET request to check if user name is available
app.get("/api/username_available/:username", function (req, res) {
    let username = req.params.username;
    console.log("Checking to see if this username " + username + " is available");

    let data = fs.readFileSync(__dirname + "/data/users.json", 'utf8');
    data = JSON.parse(data);

    let matchingUser = data.find(user => user.username.toLowerCase() == username.toLowerCase());

    let result = {
        available: "YES"
    };
    if (matchingUser) {
        result.available = "NO";
    }

    console.log("Is user name available? " + result.available);
    res.status(200).send(result);
});

// POST request to add a user
app.post("/api/users", urlencodedParser, function (req, res) {
    console.log("Got a POST request to add a user");
    console.log("BODY -------->" + JSON.stringify(req.body));

    let data = fs.readFileSync(__dirname + "/data/users.json", 'utf8');
    data = JSON.parse(data);

    // check for duplicate username
    let matchingUser = data.find(user => user.username.toLowerCase() == req.body.username.toLowerCase());
    if (matchingUser) {
        // username already exists
        console.log("ERROR: username already exists!");
        res.status(403).send();   // forbidden - 403 has no message; programmers should
        // have used GET /api/username_available/:username to see if
        // if user registration would have worked
        return;
    }

    let user = {
        id: getNextId("user"),   // assign new id      
        name: req.body.name,
        username: req.body.username,
        password: req.body.password
    };

    data.push(user);

    fs.writeFileSync(__dirname + "/data/users.json", JSON.stringify(data));

    console.log("New user added!");
    console.log(user);

    // return new user just added w/o password
    let newUser = {
        id: user.id,
        name: user.name,
        username: user.username
    };

    res.status(200).send(newUser);
});

// POST request to login -- sent username and password in request body 
app.post("/api/login", urlencodedParser, function (req, res) {
    console.log("Got a POST request for a user to login");
    console.log("BODY -------->" + JSON.stringify(req.body));

    let data = fs.readFileSync(__dirname + "/data/users.json", 'utf8');
    data = JSON.parse(data);

    // check to see if credentials match a user
    let match = data.find(user => user.username.toLowerCase() == req.body.username.toLowerCase() &&
        user.password == req.body.password);

    if (!match) {
        // credentials don't match any user
        console.log("Error: credentials don't match known user");
        res.status(403).send();   // forbidden
        return;
    }

    let user = {
        id: match.id,
        name: match.name,
        username: match.username
    };

    // login successful - return user w/o password
    console.log("Login successful for: ");
    console.log(user);

    res.end(JSON.stringify(user));
});

// ------------------------------------------------------------------------------
// SITE SET-UP

// provides access to files in public folder
app.use(express.static(__dirname + '/public'));

// supports urlencoded request bodies
app.use(bodyParser.urlencoded({ extended: false }));

// starts the server listening on port 8082
let server = app.listen(8080, function () {
    let port = server.address().port;
    console.log("App listening at port %s", port);
});
