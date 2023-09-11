import React from 'react';
import '../css/Calender.css';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useState, useEffect } from 'react';
import axios from 'axios';

const CalendarWithLegend = () => {
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [selectedDate, setSelectedDate] = useState(''); // Initialize with an empty string
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
    const [events, setEvents] = useState([]);
    const [selectedName, setSelectedName] = useState('');
    const [selectedAge, setSelectedAge] = useState('');
    const [selectedEmail, setSelectedEmail] = useState('');
    const [slotAvailable, setSlotAvailable] = useState(true);
    const [message, setMessage] = useState('');


    useEffect(() => {
        // Fetch events data from the backend API when the component mounts
        axios.get('http://localhost:5000/api/events')
            .then((response) => {
                setEvents(response.data);
                console.log(response.data)
            })
            .catch((error) => {
                console.error('Error fetching events:', error);
            });
    }, []);

    const handleEventClick = (arg) => {
        if (arg.event.start) {
            const date = new Date(arg.event.start); // Convert to Date object
            const options = { timeZone: 'Asia/Kolkata', day: '2-digit', month: '2-digit', year: '2-digit' };
            const dateString = date.toLocaleDateString('en-US', options);
            setSelectedDate(dateString);
            setShowBookingForm(true);
        }
    };

    const hideForm = () => {
        setShowBookingForm(false);
    };

    const bookAppointment = () => {
        // Get the form input values from the component's state
        const selectedDateFormatted = new Date(selectedDate);
        const year = selectedDateFormatted.getFullYear();
        const month = (selectedDateFormatted.getMonth() + 1).toString().padStart(2, '0');
        const day = selectedDateFormatted.getDate().toString().padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        const appointmentData = {
            name: selectedName, // Assuming 'name' is the state variable for the name input
            age: selectedAge, // Assuming 'age' is the state variable for the age input
            email: selectedEmail, // Assuming 'email' is the state variable for the email input
            selectedDate: formattedDate,
            selectedTimeSlot,
        };

        console.log(appointmentData)

        axios.post('http://localhost:5000/api/booked-dates/book-appointment', appointmentData)
            .then((response) => {

                console.log('Appointment booked:', response.data);
                setSlotAvailable(true); // Slot is available
                setSelectedName('');
                setSelectedAge('');
                setSelectedEmail('');
                setSelectedTimeSlot('');

                alert(response.data.message || 'Appointment booked successfully');
            })
            .catch((error) => {
                // Handle error (e.g., show an error message)
                console.error('Error booking appointment:', error);
                setSlotAvailable(false); // Slot is not available
                setMessage(error.response.data.error || 'Error booking appointment');
            });
    };

    return (
        <div className="calendar-container">
            <div className="calendar">
                <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    eventClick={handleEventClick}
                    eventClassNames="custom-event"
                // Other props for the FullCalendar component
                />
                {showBookingForm && (
                    <div className="booking-form">
                        <img src="https://i.postimg.cc/XNxzNwVd/images-removebg-preview-3.png"
                            alt="" id='cross' onClick={() => {
                                hideForm();
                            }} />
                        <h2>Book an Appointment</h2>
                        <br />
                        <form>
                            <div className="form-group">
                                <label htmlFor="selectedDate">Selected Date:</label>
                                <input
                                    type="text"
                                    id="selectedDate"
                                    name="selectedDate"
                                    value={selectedDate} // Display the selected date here
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={selectedName}
                                    onChange={(e) => setSelectedName(e.target.value)}
                                ></input>
                            </div>
                            <div className="form-group">
                                <label htmlFor="age">Age</label>
                                <input
                                    type="number"
                                    id="age"
                                    name="age"
                                    value={selectedAge}
                                    onChange={(e) => setSelectedAge(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={selectedEmail}
                                    onChange={(e) => setSelectedEmail(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="timeSlot">Select Time Slot:</label>
                                <select
                                    id="timeSlot"
                                    name="timeSlot"
                                    value={selectedTimeSlot} // Store the selected time slot in state
                                    onChange={(e) => setSelectedTimeSlot(e.target.value)}
                                >
                                    <option value="">Select a time slot</option>
                                    <option value="09:00 AM">09:00 AM-10:00 AM</option>
                                    <option value="11:00 AM">11:00 AM-12:00 PM</option>
                                    <option value="12:00 PM">12:00 PM-2:00 PM</option>
                                    <option value="2:00 PM">2:00 PM-4:00 PM</option>
                                </select>
                            </div>
                            <button type="button" onClick={bookAppointment}>
                                Book Appointment
                            </button>
                            <br />
                            {!slotAvailable && (
                                <div className="error-message" style={{color:'red'}}>
                                    {message}
                                </div>
                            )}
                        </form>
                    </div>
                )}
            </div>
            <div className="legend">
                <div className="legend-item">
                    <div className="legend-color available"></div>
                    Available
                </div>
                <div className="legend-item">
                    <div className="legend-color fully-booked"></div>
                    Booked
                </div>
            </div>
        </div>
    );
};

export default CalendarWithLegend;