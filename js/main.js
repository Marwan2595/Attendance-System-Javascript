// window.addEventListener("load",
//     function(){
//         var calendarEl = document.getElementById('calendar');
//         var calendar = new FullCalendar.Calendar(calendarEl, {
//             headerToolbar: {
//                 left: '',
//                 center: 'title',
//                 right: '',
//             },
//             editable: false,
//             firstDay: 6, //  1(Monday) this can be changed to 0(Sunday) for the USA system
//             selectable: false,
//             defaultView: 'month',
//             axisFormat: 'h:mm',
//             columnFormat: {
//                 month: 'ddd', // Mon 
//                 agendaDay: 'dddd d'
//             },
//             eventOrder:false,
//     allDaySlot: true,
//     selectHelper: false,
//             events: [
//                 {
//                     title: "Attended",
//                     start: new Date(),
//                     allDay: true,
//                     backgroundColor: 'green',
//                 },
//                 {
//                     title: "in : 9:30",
//                     start: new Date(),
//                     allDay: true,
//                     backgroundColor:"blue",
//                 },
//                 {
//                     title: "out : 5:05",
//                     start: new Date(),
//                     allDay: true,
//                     backgroundColor:"blue",
//                 },
//                 {
//                     title: "Absent",
//                     start: new Date(),
//                     allDay: true,
//                     backgroundColor:"red",
//                 },
//                 {
//                     title: "Excuse out 3:00",
//                     start: new Date(),
//                     allDay: true,
//                     backgroundColor:"purple",
//                 },
//             ],
//         });
//         calendar.render();
//     }
// );