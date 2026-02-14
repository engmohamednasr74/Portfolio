(function () {
  emailjs.init({
    publicKey: "x7QgzBhmvu37cugQt", //YOUR_PUBLIC_KEY
  });
})();

// function sendMail() {
//     let params = {
//         from: document.getElementById("name").value,
//         email: document.getElementById("email").value,
//         subject: document.getElementById("subject").value,
//         message: document.getElementById("message").value,
//     };
//     emailjs.send("service_nykapd7","template_80yyi12",params).then();
// }

function sendMail() {
  let name = document.getElementById("name").value;

  let now = new Date();
  let date =
    now.getFullYear() +
    "/" +
    String(now.getMonth() + 1).padStart(2, "0") +
    "/" +
    String(now.getDate()).padStart(2, "0");

  let time = now.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  let params = {
    name: name,
    email: document.getElementById("email").value,
    subject: document.getElementById("subject").value,
    message: document.getElementById("message").value,

    time: `${date} at ${time}`,

    // Gradient avatar 🔥
    avatar: `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(
      name,
    )}&backgroundType=gradientLinear&fontSize=36&size=128`,
  };

  emailjs.send("service_nykapd7", "template_80yyi12", params);
}
