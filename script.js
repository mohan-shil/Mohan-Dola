const weddingDate = new Date("2026-10-18T10:30:00+05:30").getTime();

function updateCountdown() {
  const distance = Math.max(0, weddingDate - Date.now());
  const units = {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((distance / (1000 * 60)) % 60),
    seconds: Math.floor((distance / 1000) % 60)
  };

  Object.entries(units).forEach(([unit, value]) => {
    document.getElementById(unit).textContent = String(value).padStart(2, "0");
  });
}

const modal = document.getElementById("rsvpModal");
const form = document.getElementById("rsvpForm");
const formMessage = document.getElementById("formMessage");

document.getElementById("rsvpButton").addEventListener("click", () => {
  modal.hidden = false;
  document.querySelector("input[name=name]").focus();
});

document.getElementById("modalClose").addEventListener("click", () => {
  modal.hidden = true;
});

modal.addEventListener("click", (event) => {
  if (event.target === modal) modal.hidden = true;
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = new FormData(form).get("name");
  formMessage.textContent = `Thank you, ${name}. We cannot wait to celebrate with you!`;
  form.reset();
});

updateCountdown();
setInterval(updateCountdown, 1000);