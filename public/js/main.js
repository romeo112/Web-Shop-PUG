$(document).ready(() => {
  $(".delete-proizvod").on("click", e => {
    $target = $(e.target);
    const id = $target.attr("data-id");
    $.ajax({
      type: "DELETE",
      url: "/proizvodi/delete/" + id,
      success: response => {
        alert("Deleting Article");
        window.location.href = "/";
      },
      error: err => {
        console.log(err);
      }
    });
  });
});

$(document).ready(() => {
  $(".delete-item").on("click", e => {
    $target = $(e.target);
    const id = $target.attr("data-id");
    $.ajax({
      type: "DELETE",
      url: "/korpa/delete/" + id,
      success: response => {
        alert("Removing from basket");
        window.location.href = "/";
      },
      error: err => {
        console.log(err);
      }
    });
  });
});
