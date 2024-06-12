let passagiers = [
  {
    id: 163821,
    naam: "Leo Daams",
    saldo: 34,
    woonplaats: "Den Bosch",
    telefoonnummer: "06-12345678",
    checkInStop: null,
  },
  {
    id: 145032,
    naam: "Nicole Hops",
    saldo: 18,
    woonplaats: "Maastricht",
    telefoonnummer: "06-87654321",
    checkInStop: null,
  },
];

const stops = 10;

const stopNames = [
  "Venlo Station",
  "Roermond Station",
  "Weert Station",
  "Eindhoven Station",
  "Den Bosch Station",
  "Utrecht Station",
  "Amsterdam Station",
  "Alkmaar Station",
  "Den Helder Station",
  "Groningen Station",
];

let currentStopIndex = 0;
let nextStopIndex = 1;
let startTime = null;
const travelDuration = 6000; // Duration to move between stops in milliseconds

function nieuwePassagier(id, naam, saldo, woonplaats, telefoonnummer) {
  passagiers.push({
    id,
    naam,
    saldo,
    woonplaats,
    telefoonnummer,
    checkInStop: null,
  });
  showPassengerList();
}

function moveBusToNextStop(timestamp) {
  if (!startTime) startTime = timestamp;
  const elapsedTime = timestamp - startTime;
  const progress = Math.min(elapsedTime / travelDuration, 1);

  updateBusPosition(progress);

  if (progress < 1) {
    requestAnimationFrame(moveBusToNextStop);
  } else {
    startTime = null;
    currentStopIndex = nextStopIndex;
    nextStopIndex = (currentStopIndex + 1) % stops;
    updateBusRoute();
    const stopSound = document.getElementById(`stop-${currentStopIndex}-sound`);
    if (stopSound) stopSound.play();
    setTimeout(() => {
      requestAnimationFrame(moveBusToNextStop);
    }, 500);
  }
}

function updateBusRoute() {
  for (let i = 0; i < stops; i++) {
    const stopElement = document.getElementById(`stop-${i}`);
    if (stopElement) stopElement.classList.remove("current-stop");
  }
  const currentStopElement = document.getElementById(
    `stop-${currentStopIndex}`
  );
  if (currentStopElement) currentStopElement.classList.add("current-stop");
}

function updateBusPosition(progress) {
  const bus = document.getElementById("bus");
  const startStop = document.getElementById(`stop-${currentStopIndex}`);
  const endStop = document.getElementById(`stop-${nextStopIndex}`);
  const route = document.querySelector(".bus-route");

  if (bus && startStop && endStop && route) {
    const startRect = startStop.getBoundingClientRect();
    const endRect = endStop.getBoundingClientRect();
    const routeRect = route.getBoundingClientRect();

    const startX =
      startRect.left -
      routeRect.left +
      startStop.offsetWidth / 2 -
      bus.offsetWidth / 2;
    const endX =
      endRect.left -
      routeRect.left +
      endStop.offsetWidth / 2 -
      bus.offsetWidth / 2;

    bus.style.left = `${startX + (endX - startX) * progress}px`;
  }
}

function inchecken(passagierId) {
  const passagier = passagiers.find((p) => p.id === passagierId);
  if (passagier) {
    passagier.checkInStop = currentStopIndex;
    const checkinSound = document.getElementById("checkin-sound");
    if (checkinSound) checkinSound.play();
    console.log(
      `${passagier.naam} heeft ingecheckt bij halte ${stopNames[currentStopIndex]}.`
    );
  } else {
    console.log("Passagier niet gevonden.");
  }
  showPassengerList();
}

function uitchecken(passagierId) {
  const passagier = passagiers.find((p) => p.id === passagierId);
  if (passagier) {
    if (passagier.checkInStop !== null) {
      const stopsTraveled = Math.abs(currentStopIndex - passagier.checkInStop);
      const kosten = stopsTraveled * 2;
      if (passagier.saldo >= kosten) {
        passagier.saldo -= kosten;
        passagier.checkInStop = null;
        const checkoutSound = document.getElementById("checkout-sound");
        if (checkoutSound) checkoutSound.play();
        console.log(
          `${passagier.naam} heeft uitgecheckt bij halte ${stopNames[currentStopIndex]}. Nieuw saldo: ${passagier.saldo}`
        );
      } else {
        console.log("Onvoldoende saldo.");
      }
    } else {
      console.log(`${passagier.naam} is niet ingecheckt.`);
    }
  } else {
    console.log("Passagier niet gevonden.");
  }
  showPassengerList();
}

function passagierVerwijderen(passagierId) {
  passagiers = passagiers.filter((p) => p.id !== passagierId);
  console.log("Passagier verwijderd.");
  showPassengerList();
}

function passagiersLijstOproepen() {
  console.log("Lijst met passagiers:");
  passagiers.forEach((p) => console.log(p));
  showPassengerList();
}

function showPassengerList() {
  const listElement = document.getElementById("passenger-list");
  if (listElement) {
    listElement.innerHTML = "<h2>Lijst met passagiers:</h2>";
    passagiers.forEach((p) => {
      listElement.innerHTML += `
        <div class="passenger">
          <p>Naam: ${p.naam}</p>
          <p>Saldo: €${p.saldo}</p>
          <p>Woonplaats: ${p.woonplaats}</p>
          <p>Telefoonnummer: ${p.telefoonnummer}</p>
          <p>Check-in halte: ${
            p.checkInStop !== null ? stopNames[p.checkInStop] : "N/A"
          }</p>
          <div class="passenger-buttons">
            <button onclick="inchecken(${p.id})">Inchecken</button>
            <button onclick="uitchecken(${p.id})">Uitchecken</button>
            <button onclick="removePassenger(${p.id})">Verwijderen</button>
          </div>
        </div>
      `;
    });
  }
}

function addPassenger() {
  const id = parseInt(prompt("Voer ID in:"), 10);
  const naam = prompt("Voer naam in:");
  const saldo = parseInt(prompt("Voer saldo in:"), 10);
  const woonplaats = prompt("Voer woonplaats in:");
  const telefoonnummer = prompt("Voer telefoonnummer in:");
  nieuwePassagier(id, naam, saldo, woonplaats, telefoonnummer);
}

function checkIn(passengerId) {
  inchecken(passengerId);
}

function checkOut(passengerId) {
  uitchecken(passengerId);
}

function removePassenger(passengerId) {
  passagierVerwijderen(passengerId);
}

window.onload = () => {
  showPassengerList();
  updateBusRoute();
  const busRoute = document.querySelector(".bus-route");
  if (busRoute) {
    const busElement = document.createElement("div");
    busElement.id = "bus";
    busElement.className = "bus";
    busRoute.appendChild(busElement);
    requestAnimationFrame(moveBusToNextStop);
  }
};
