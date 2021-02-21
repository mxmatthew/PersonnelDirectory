$(document).ready( () => {

   $('#editContactBtn').click(() => {
       $('#contactDetails').toggle()
       $('#editContactForm').toggle()
       $('#editContactBtn').toggle()
       $('#saveContactBtn').toggle()
   })

   $('#closeEditContactForm').click(() => {
    $('#contactDetails').toggle()
    $('#editContactForm').toggle()
    $('#editContactBtn').toggle()
    $('#contactSingleName').toggle()
    $('#contactActionBar').toggle()
})



})

function showContacts() {
    $('#contacts').show()
    $('#contactSingle').hide()
}