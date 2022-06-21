const io = require("socket.io")();
const eventIO = {
    io: io,
    path: '/'
};
// Add your socket.io logic here!
io.sockets.on("connection", function(socket) {
    console.log("có 1 connect với socket id : " + socket.id);

    console.log("have connect: " + socket.id)

    socket.on('message', (data) => {
        console.log(data)
        socket.emit('message', 'co gui sms la: ' + data)
    })

    socket.on('disconnect', async function() {

        console.log("disconnect set user offline")
        socket.leaveAll()
    })
});
// end of socket.io logic

module.exports = eventIO;