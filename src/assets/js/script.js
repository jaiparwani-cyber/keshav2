import "../css/style.css";

document.addEventListener("DOMContentLoaded", function(){
  console.log("IISc Smart Mess frontend loaded");

  const modalSubmit = document.getElementById("modalSubmitBtn");
  if(modalSubmit){
    modalSubmit.addEventListener("click", () => {
      const name = document.getElementById("fb-name");
      const msg = document.getElementById("fb-message");
      if(name && msg && name.value.trim() && msg.value.trim()){
        const modal = bootstrap.Modal.getInstance(document.getElementById("feedbackModal"));
        modal.hide();
        alert("Thanks for your feedback! (This is a demo - no backend attached)");
        name.value = "";
        msg.value = "";
      } else {
        alert("Please fill name and message");
      }
    });
  }

  const contactForm = document.getElementById("contactForm");
  if(contactForm){
    contactForm.addEventListener("submit", function(e){
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const hostel = document.getElementById("hostel").value.trim();
      const message = document.getElementById("message").value.trim();
      if(!name || !email || !message){
        alert("Please fill required fields");
        return;
      }
      const subject = encodeURIComponent("Feedback from " + name);
      const body =
`Name: ${name}

Email: ${email}

Hostel: ${hostel}

Message:
${message}`;
      window.location.href = `mailto:jaiparwani4@gmail.com?subject=${subject}&body=${encodeURIComponent(body)}`;
    });
  }
});
