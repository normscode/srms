// var firebaseConfig = {
//     apiKey: "AIzaSyC29qEHcGJg4wJV9F0dA0yIhLD-4kBmjOs",
//     authDomain: "srms-fb1c2.firebaseapp.com",
//     projectId: "srms-fb1c2",
//     storageBucket: "srms-fb1c2.appspot.com",
//     messagingSenderId: "692988964724",
//     appId: "1:692988964724:web:f8214cf39181b0e4c7c621",
//     measurementId: "G-4PJPX0YPM2"
//   };

//   firebase.initializeApp(firebaseConfig);

  // Initialize Firebase

if (!firebase.apps.length) {
    const firebaseConfig = {
        apiKey: "AIzaSyC29qEHcGJg4wJV9F0dA0yIhLD-4kBmjOs",
        authDomain: "srms-fb1c2.firebaseapp.com",
        projectId: "srms-fb1c2",
        storageBucket: "srms-fb1c2.appspot.com",
        messagingSenderId: "692988964724",
        appId: "1:692988964724:web:f8214cf39181b0e4c7c621",
        measurementId: "G-4PJPX0YPM2"
    };
    firebase.initializeApp(firebaseConfig);
}


// Check if user is logged in
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        console.log("User is logged in:", user.displayName);
    } else {
        console.log("No user is logged in.");
    }
});

// Check if Firestore is ready
const firestore = firebase.firestore();
firestore.enablePersistence()
    .then(() => {
        console.log("Firestore is ready.");
    })
    .catch((error) => {
        console.error("Error enabling Firestore persistence:", error);
    });



 // Reference to Firestore database
 var db = firebase.firestore();
  
//  // Function to generate codes and store data in Firestore
//  function generateCodes() {
//     var classSection = document.getElementById('classSection').value.trim();
//     var subject = document.getElementById('subject').value.trim();
//     var semestralNumber = document.getElementById('semestralNumber').value.trim();
//     var studentNames = document.getElementById('studentNames').value.split(',');
//     var studentEmails = document.getElementById('studentEmails').value.split(',');
//     var grades = document.getElementById('grades').value.split(',');
  
//     // Validate input lengths
//     if (studentNames.length !== grades.length || studentNames.length !== studentEmails.length) {
//       alert('Number of students, grades, and emails must match.');
//       return;
//     }
  
//     // Clear previous generated codes
//     document.getElementById('generatedCodes').innerHTML = '';
  
//     // Reference to Firestore database
//     var db = firebase.firestore();
  
//     // Generate codes and store data in Firestore
//     for (var i = 0; i < studentNames.length; i++) {
//       var code = generateRandomCode();
//       db.collection('results').doc(subject).collection('semesters').doc(semestralNumber)
//         .collection('students').doc(code).set({
//           classSection: classSection,
//           name: studentNames[i].trim(),
//           email: studentEmails[i].trim(),
//           grade: grades[i].trim()
//         });
  
//       document.getElementById('generatedCodes').innerHTML += `Code for ${studentNames[i].trim()}: ${code}<br>`;
//     }
//   }

// Function to generate codes and store data in Firestore



// Function to generate codes and store data in Firestore
function generateCodes() {
  var classSection = document.getElementById('classSection').value.trim();
  var subject = document.getElementById('subject').value.trim();
  var semestralNumber = document.getElementById('semestralNumber').value.trim();
  var studentNames = document.getElementById('studentNames').value.split(',');
  var studentEmails = document.getElementById('studentEmails').value.split(',');
  var grades = document.getElementById('grades').value.split(',');

  // Validate input lengths
  if (studentNames.length !== grades.length || studentNames.length !== studentEmails.length) {
    alert('Number of students, grades, and emails must match.');
    return;
  }

  // Validate input values
  if (!classSection || !subject || !semestralNumber || studentNames.includes('') || studentEmails.includes('') || grades.includes('')) {
    alert('Please fill in all the fields.');
    return;
  }

  // Clear previous generated codes
  document.getElementById('generatedCodes').innerHTML = '';

  // Reference to Firestore database
  var db = firebase.firestore();

  // Generate auto ID for the subject and store data in Firestore
  var subjectRef = db.collection('results').doc(); // Firestore will generate an auto ID
  var currentDate = new Date();

  subjectRef.set({
    createdAt: currentDate,
    subjectName: subject,
    semester: semestralNumber,
    classSection: classSection
    // other subject-related data if needed
  });

  // Generate codes and store student data in Firestore
  for (let i = 0; i < studentNames.length; i++) {
    if (!studentNames[i] || !studentEmails[i] || !grades[i]) {
      alert('Please fill in all the fields for each student.');
      return;
    }

    var code = generateRandomCode();

    // Use the random code as the document ID for students
    subjectRef.collection('students').doc(code).set({
      name: studentNames[i].trim(),
      email: studentEmails[i].trim(),
      grade: grades[i].trim(),
      code: code,
      semestralNumber: semestralNumber,
      subjectName: subject,
    }).then((function (index, studentCode) {
      return function () {
        document.getElementById('generatedCodes').innerHTML += `Code for ${studentNames[index].trim()}: ${studentCode}<br>`;
        console.log("Student Name Iteration: " + studentNames[index]);
      };
    })(i, code)).catch(function (error) {
      console.error('Error adding student document: ', error);
    });
  }
}

  
  // Function to generate a random code
  function generateRandomCode() {
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var code = '';
    for (var i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  }
  
    
 // Function to view grade based on entered code
function viewGrade() {
  var code = document.getElementById('code').value.trim();

  // Clear previous data in the modal
  document.getElementById('studentDataTableBody').innerHTML = '';

  // Retrieve data from Firestore based on the entered code
  db.collectionGroup('students').where('code', '==', code).get().then(function (querySnapshot) {
    if (!querySnapshot.empty) {
      querySnapshot.forEach(function (studentDoc) {
        var studentData = studentDoc.data();
        // Append student data to the table in the modal
        document.getElementById('studentDataTableBody').innerHTML += 
          `<tr>
             <td>${studentData.subjectName}</td>
             <td>${studentData.semestralNumber}</td>
             <td>${studentData.name}</td>
             <td>${studentData.grade}</td>
             <td>${code}</td>
           </tr>`;
      });

      // Show the modal
      $('#studentDataModal').modal('show');
    } else {
      alert('Invalid code. Please try again.');
    }
  }).catch(function (error) {
    console.error('Error getting student document:', error);
  });
}






//_______AUTHENTICATION_____//
 // Teacher Sign Up
function teacherSignUp() {
  var email = document.getElementById('teacherEmail').value.trim();
  var password = document.getElementById('teacherPassword').value.trim();

  firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
          // Signed in
          var user = userCredential.user;
          console.log("Teacher signed up:", user.email);
          alert("Teacher signed up successfully!");

          // Redirect to teacher_dashboard.html
          window.location.href = "teacher_dashboard.html";
      })
      .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.error("Teacher sign up error:", errorMessage);
          alert("Teacher sign up error: " + errorMessage);
      });
}

// Teacher Login
function teacherLogin() {
  var email = document.getElementById('loginTeacherEmail').value.trim();
  var password = document.getElementById('loginTeacherPassword').value.trim();

  firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
          // Signed in
          var user = userCredential.user;
          console.log("Teacher logged in:", user.email);
          alert("Teacher logged in successfully!");

          // Redirect to teacher_dashboard.html
          window.location.href = "teacher_dashboard.html";
      })
      .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.error("Teacher login error:", errorMessage);
          alert("Teacher login error: " + errorMessage);
      });
}


function teacherLogout(){
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
    window.location.href = 'teacher_login.html'; // Redirect to the login page
  }).catch(function(error) {
    // An error happened.
    console.error('Logout error:', error);
  });
}
//_______AUTHENTICATION_____//




  