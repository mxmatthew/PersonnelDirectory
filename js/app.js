
let contactsList
let departmentsList
let locationsList

async function getAllContacts() {
 await $.ajax({
        url: 'http://dev1.mattt.uk/projects/companydirectory/app/main.php',
        type: 'POST',
        dataType: 'json',
        data: {crud: 'read', requestType: 'all_contacts' },
        success: contacts => {
            contactsList = contacts['contacts']
            departmentsList = contacts['departments']
            locationsList = contacts['locations']
            console.log(contacts);
            $('#contactsList').html(``)
            contactsList.forEach( (contact,index) => {
                $('#contactsList').append(`
                <li><a href="#" onClick="getContact(${contact.id})" data-bs-toggle="modal" data-bs-target="#ContactModal" ><div class="contactIcon">${contact.firstName[0]}${contact.lastName[0]}</div> ${contact.lastName}, ${contact.firstName}</a></li>
                `)
            })
           departmentsList.forEach( (department,index) => {
            $('#departmentInput').append(`
            <option value="${department.id}">${department.name}</option>
            `)
            $('#departmentInputNew').append(`
            <option value="${department.id}">${department.name}</option>
            `)
            $('#departmentsList').append(`
            <li><a href="#" onClick="getDepartment(${department.id})" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" >${department.name}</a></li>
               
            `)
            })
            locationsList.forEach( (location,index) => {
                $('#locationsInput').append(`
                <option value="${location.id}">${location.name}</option>
                `)
                $('#locationsInputNew').append(`
                <option value="${location.id}">${location.name}</option>
                `)
                $('#locationsList').append(`
                <li><a href="#" onClick="getDepartment(${location.id})" data-bs-toggle="modal" data-bs-target="#editLocationModal" >${location.name}</a></li>
                   
                `)
            })
        }
    })
}

async function getDepartment(departmentId) {
    let findDepartment
    await Promise.resolve(
        findDepartment  = departmentsList.filter(department => department.id == departmentId)
    ).then(() => {
        let department = findDepartment[0];
        console.log(department);
        $('#singleDepartmentNameInput').val(department.name)
        $('#singleDepartmentName').html(`${department.name}`)
        $('#locationsInput').append(`
        <option selected="selected" value="${department.locationsID}">${department.locationName}</option>
        `)
        $('#updateBtn').attr('onclick',`updateDepartment(${department.id})`)
    })

}


async function getContact(contactId) {
    
    $('#contacts').hide();
    $('#contactSingle').show();

    let findContact 
    await Promise.resolve(
        findContact  = contactsList.filter(contact => contact.id == contactId)
    ).then(() => {
        let contact = findContact[0];
        console.log(contact);
        $('#contactSingleName').html(`${contact.firstName} ${contact.lastName}`)
        $('#firstNameInput').val(contact.firstName)
        $('#lastNameInput').val(contact.lastName)
        $('#emailInput').val(contact.email)
        $('#jobTitleInput').val(contact.jobTitle)
        $('#updateBtn').attr('onclick',`updateContact(${contact.id})`)
        $('#deleteContactBtn').attr('onclick',`deleteItem('contact',${contact.id})`)
        $('#departmentInput').append(`
        <option selected="selected" value="${contact.departmentID}">${contact.department}</option>
        `)
        $('#contactDetails').html(`
        <p class="contactInfoItem">${contact.department}</p>
        <p class="contactInfoItem">${contact.location}</p>
        <p class="contactInfoItem">${contact.email}</p>
        `)
    })

    
            
}

async function updateContact(contactId) {
$.ajax({
        url: 'http://dev1.mattt.uk/projects/companydirectory/app/main.php',
        type: 'POST',
        dataType: 'json',
        data: {crud: 'update', requestType: 'contact', id: contactId, firstName: $('#firstNameInput').val(), lastName: $('#lastNameInput').val(), 
        email: $('#emailInput').val(), departmentID: $('#departmentInput').val(), jobTitle: $('#jobTitleInput').val()},
        success: result => {
           if (result['status']['code'] == 200) {
               $('#responseMessage').html('Contact Saved')
            $('.toast').toast('show');
           } else {
               console.log(result)
            $('#responseMessage').html('Something went wrong')
            $('.toast').toast('show');
           }
          

        } 
    })
    const refreshed = await getAllContacts();
    getContact(contactId)

}

async function updateDepartment(departmentId) {
    $.ajax({
            url: 'http://dev1.mattt.uk/projects/companydirectory/app/main.php',
            type: 'POST',
            dataType: 'json',
            data: {crud: 'update', requestType: 'department', id: departmentId, departmentName: $('#singleDepartmentNameInput').val(), locationID: $('#locationsInput').val() },
            success: result => {
               if (result['status']['code'] == 200) {
                   $('#responseMessage').html('Department Saved')
                $('.toast').toast('show');
               } else {
                   console.log(result)
                $('#responseMessage').html('Something went wrong')
                $('.toast').toast('show');
               }
              
    
            } 
        })
        const refreshed = await getAllContacts();
        getDepartment(departmentId)
    }


async function addContact() {
    $.ajax({
            url: 'http://dev1.mattt.uk/projects/companydirectory/app/main.php',
            type: 'POST',
            dataType: 'json',
            data: {crud: 'create', requestType: 'contact', firstName: $('#firstNameInputNew').val(), lastName: $('#lastNameInputNew').val(), 
            email: $('#emailInputNew').val(), departmentID: $('#departmentInputNew').val(), jobTitle: $('#jobTitleInputNew').val()},
            success: result => {
               if (result['status']['code'] == 200) {
                   $('#responseMessage').html('Contact Saved')
                $('.toast').toast('show');
               } else {
                   console.log(result)
                $('#responseMessage').html('Something went wrong')
                $('.toast').toast('show');
               }
              
    
            } 
        })
        const refreshed = await getAllContacts();

    }



async function deleteItem(itemType,itemId) {
 await $.ajax({
        url: 'http://dev1.mattt.uk/projects/companydirectory/app/main.php',
        type: 'POST',
        dataType: 'json',
        data: {crud: 'delete', requestType: itemType, id: itemId },
        success: result => {
            if (result['status']['code'] == 200) {
                $('#responseMessage').html('Contact Deleted')
             $('.toast').toast('show');
            } else {
                console.log(result)
             $('#responseMessage').html('Something went wrong')
             $('.toast').toast('show');
            }
        }
}).then(getAllContacts()).then(async ()=> {
    const refreshed = await getAllContacts();
    showContacts()
    $('#contactDetails').toggle()
    $('#editContactForm').toggle()
    $('#editContactBtn').toggle()
    $('#contactSingleName').toggle()
    $('#contactActionBar').toggle()
})
}



getAllContacts();
