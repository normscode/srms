// Check if a user is authenticated
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in, continue with the dashboard logic
      console.log(user + "is logged in!")
      function loadAddResultForm() {
        // Fetch the content of add_result.html using AJAX
        $.ajax({
            url: 'add_result.html',
            dataType: 'html',
            success: function (data) {
                // Display the result form content inside the placeholder
                document.getElementById('dashboardContentPlaceholder').innerHTML = data;
            },
            error: function () {
                console.error('Error loading add_result.html');
            }
        });
    }
    
    // Reference to the results container in HTML
    var resultsContainer = document.getElementById('resultsContainer');
    
    // Function to display information in a clickable container with View Details and Delete buttons
    function displayClickableInfo(documentId, data) {
    const container = document.createElement('div');
    container.className = 'container-result clickable p-3 mb-3 bg-light rounded';
    
    const viewDetailsButton = document.createElement('button');
    viewDetailsButton.className = 'btn btn-primary mr-2';
    viewDetailsButton.innerText = 'View Details';
    viewDetailsButton.setAttribute('data-toggle', 'modal');
    viewDetailsButton.setAttribute('data-target', '#studentDataModal');
    viewDetailsButton.addEventListener('click', function () {
    displayStudentData(documentId);
    });
    
    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-danger';
    deleteButton.innerText = 'Delete';
    deleteButton.addEventListener('click', function () {
    // Call a function to delete the document by ID
    deleteDocument(documentId);
    });
    
    var createdAtTimestamp = data.createdAt;
    
    // Convert the Firestore Timestamp to a JavaScript Date object
    var createdAtDate = createdAtTimestamp.toDate();
    
    // Format the createdAt date into a human-readable string
    var formattedCreatedAt = createdAtDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    container.innerHTML = 
    `<p>Date Created: ${formattedCreatedAt}</p>` +
    `<p>Subject Name: ${data.subjectName}</p>` +
    `<p>Semester: ${data.semester}</p>` +
    `<p>Class Section: ${data.classSection}</p>`;
    
    viewDetailsButton.style.marginRight = '50px';
    
    container.appendChild(viewDetailsButton);
    container.appendChild(deleteButton);
    
    // Store the document ID as a data attribute for later use
    container.dataset.documentId = documentId;
    
    resultsContainer.appendChild(container);
    }
    // Function to delete a document by ID and its subcollections
    function deleteDocument(documentId) {
    if (confirm('Are you sure you want to delete this result?')) {
    // Reference to the main document
    const resultRef = db.collection('results').doc(documentId);
    
    // Reference to the "students" subcollection
    const studentsRef = resultRef.collection('students');
    
    // Delete each document in the "students" subcollection
    studentsRef.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (studentDoc) {
        studentsRef.doc(studentDoc.id).delete();
      });
    }).then(function () {
      // After deleting all students, delete the main document
      return resultRef.delete();
    }).then(function () {
      console.log('Document and its subcollections successfully deleted!');
      // Reload the page or perform any other action after successful deletion
      location.reload();
    }).catch(function (error) {
      console.error('Error deleting document and subcollections: ', error);
    });
    }
    }
    
    
    // Function to fetch and display student data in the modal
    function displayStudentData(documentId) {
    // Clear previous data
    document.getElementById('studentDataTableBody').innerHTML = '';
    
    // Fetch student data
    db.collection('results').doc(documentId).collection('students').get().then(function (studentSnapshot) {
    if (studentSnapshot.empty) {
      // If no student data, hide the container
      resultsContainer.innerHTML = 'No data available.';
    } else {
      // Show the container
      resultsContainer.style.display = 'block';
    
      studentSnapshot.forEach(function (studentDoc) {
        var studentData = studentDoc.data();
        // Append student data to the table in the modal
        document.getElementById('studentDataTableBody').innerHTML += 
          `<tr>
             <td>${studentData.subjectName}</td>
             <td>${studentData.semestralNumber}</td>
             <td>${studentData.name}</td>
             <td>${studentData.email}</td>
             <td>${studentData.grade}</td>
             <td>${studentData.code}</td>
           </tr>`;
      });
    }
    });
    }
    
    // Fetch all documents in the "results" collection
    db.collection('results').get().then(function (querySnapshot) {
    if (querySnapshot.empty) {
    // If no results, hide the container
    resultsContainer.innerHTML = 'No data available.';
    } else {
    // Show the container
    resultsContainer.style.display = 'block';
    
    querySnapshot.forEach(function (doc) {
      var resultData = doc.data();
      displayClickableInfo(doc.id, resultData);
    });
    }
    });
  
    } else {
      // No user is signed in, redirect to the login page
      window.location.href = "teacher_login.html";
    }
  });



