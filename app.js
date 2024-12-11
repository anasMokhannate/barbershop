const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Middleware to serve static files and parse body
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as templating engine
app.set('view engine', 'ejs');

// Simple in-memory storage for appointments
let appointments = [];

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/booking', (req, res) => {
    res.render('booking', { error: false }); // Pass `null` as the default value for `error`
  });

app.post('/book', (req, res) => {
  const { name, date, time } = req.body;

  // Check for conflicting appointments
  const isConflict = appointments.some(
    (appointment) => appointment.date === date && appointment.time === time
  );

  if (isConflict) {
    // If conflict exists, return error to the booking page
    res.render('booking', {
      error: `The slot on ${date} at ${time} is already taken. Please choose another time.`,
    });
  } else {
    // No conflict, save the appointment
    appointments.push({ name, date, time });
    res.send(
      `<h2>Appointment booked successfully!</h2>
       <p>Thank you, ${name}, your appointment is scheduled for ${date} at ${time}.</p>
       <p><a href="/">Go back</a></p>`
    );
  }
});

app.get('/appointments', (req, res) => {
  res.render('appointments', { appointments });
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
