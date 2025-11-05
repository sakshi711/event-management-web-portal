const BASE_URL = "http://localhost:5050";

function loadAdminEvents() {
  $.get(`${BASE_URL}/events`, function(events) {
    let html = "";
    events.forEach(e => {
      html += `
        <div class="col-md-4 mb-3">
          <div class="card shadow-sm p-3">
            <h5>${e.title}</h5>
            <p>${e.date.split("T")[0]} – ${e.location}</p>
            <button class="btn btn-danger deleteBtn" data-id="${e.event_id}">Delete</button>
          </div>
        </div>`;
    });
    $("#adminEvents").html(html);
  });
}

$("#addEventForm").submit(function(e) {
  e.preventDefault();
  const data = {
    title: $("#title").val(),
    date: $("#date").val(),
    location: $("#location").val(),
    description: $("#description").val()
  };
  $.ajax({
    url: `${BASE_URL}/events`,
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(data),
    success: () => {
      alert("Event added!");
      $("#addEventForm")[0].reset();
      loadAdminEvents();
    },
    error: () => alert("Failed to add event")
  });
});

$(document).on("click", ".deleteBtn", function() {
  const id = $(this).data("id");
  $.ajax({
    url: `${BASE_URL}/events/${id}`,
    method: "DELETE",
    success: () => {
      alert("Event deleted!");
      loadAdminEvents();
    },
    error: () => alert("Delete failed")
  });
});

$(document).ready(loadAdminEvents);
