const BASE_URL = "http://localhost:5050"; // your backend port

// Fetch and display events
function loadEvents() {
  $.get(`${BASE_URL}/events`, function(events) {
    let html = "";
    events.forEach(event => {
      html += `
        <div class="col-md-4 mb-4">
          <div class="card shadow-sm">
            <div class="card-body">
              <h5>${event.title}</h5>
              <p><strong>Date:</strong> ${event.date.split("T")[0]}</p>
              <p><strong>Location:</strong> ${event.location}</p>
              <p>${event.description}</p>
              <button class="btn btn-success registerBtn" data-id="${event.event_id}" data-bs-toggle="modal" data-bs-target="#registerModal">Register</button>
            </div>
          </div>
        </div>`;
    });
    $("#eventsContainer").html(html);
  });
}

// Handle registration
$(document).on("click", ".registerBtn", function() {
  $("#eventId").val($(this).data("id"));
});

$("#registerForm").submit(function(e) {
  e.preventDefault();
  const data = {
    user_name: $("#userName").val(),
    user_email: $("#userEmail").val(),
    event_id: $("#eventId").val()
  };
  $.ajax({
    url: `${BASE_URL}/register`,
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(data),
    success: () => {
      alert("Registration successful!");
      $("#registerModal").modal("hide");
      $("#registerForm")[0].reset();
    },
    error: () => alert("Registration failed!")
  });
});

$(document).ready(loadEvents);
