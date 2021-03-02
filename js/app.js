
let contactsList
let departmentsList
let locationsList

async function getAllContacts() {
 await $.ajax({
        url: 'https://dev1.mattt.uk/projects/companydirectory/app/main.php',
        type: 'POST',
        dataType: 'json',
        data: {crud: 'read', requestType: 'all_contacts' },
        success: contacts => {
            contactsList = contacts['contacts']
            departmentsList = contacts['departments']
            locationsList = contacts['locations']
            $('#contactsList').html(``)
            $('#departmentsList').html(``)
            $('#locationsList').html(``)
            $('#departmentInput').html(``)
            $('#departmentInputNew').html(``)
            $('#locationsInput').html(``)
            $('#locationsInputNew').html(``)

            contactsList.forEach( (contact,index) => {
                $('#contactsList').append(`
                <li><a href="#" onClick="getContact(${contact.id})" data-bs-toggle="modal" data-bs-target="#ContactModal" >
                <div class="contactIcon">${contact.firstName[0]}${contact.lastName[0]}</div>
                <div class="contactDetails"> ${contact.lastName}, ${contact.firstName}<br>
                <p class="small" >${contact.department}</p>
                </div></a></li>
                `)
            })
           departmentsList.forEach( (department,index) => {
            $('#departmentInput').append(`
            <option value="${department.id}">${department.name}</option>
            `)
            $('#departmentInputNew').append(`
            <option value="${department.id}">${department.name}</option>
            `)
            $('#contactSearchDepartments').append(`
            <option value="${department.name}">${department.name}</option>
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
                $('#contactSearchLocations').append(`
                <option value="${location.name}">${location.name}</option>
                `)
                $('#locationsList').append(`
                <li><a href="#" onClick="getLocation(${location.id})" data-bs-toggle="modal" data-bs-target="#editLocationModal" >${location.name}</a></li>
                   
                `)
            })
        }
    })
}

$("#contactSearchInput,#contactSearchDepartments,#contactSearchLocations").on("change paste keyup", function() {
    $('#contactsList').html(``)
    contactsList.forEach( (contact,index) => {
        let contactFullName = contact.firstName + ' ' + contact.lastName
        if( contactFullName.toLowerCase().includes( $('#contactSearchInput').val().toLowerCase() ) && 
            contact.location.includes( $('#contactSearchLocations').val() )  && 
            contact.department.includes( $('#contactSearchDepartments').val() ))   {
        $('#contactsList').append(`
        <li><a href="#" onClick="getContact(${contact.id})" data-bs-toggle="modal" data-bs-target="#ContactModal" >
                <div class="contactIcon">${contact.firstName[0]}${contact.lastName[0]}</div>
                <div class="contactDetails"> ${contact.lastName}, ${contact.firstName}<br>
                <p class="small" >${contact.department}</p>
                </div></a></li>
        `)
    }
})
});



async function getDepartment(departmentId) {
    let findDepartment
    let findContacts
    await Promise.resolve(
        findDepartment  = departmentsList.filter(department => department.id == departmentId),
        findContacts = contactsList.filter(contacts => contacts.departmentID == departmentId )
    ).then(() => {
        let department = findDepartment[0];
        $('#departmentContacts').html(``)
        $('#locationsInput').html(``)
        $('#singleDepartmentNameInput').val(department.name)
        $('#singleDepartmentName').html(`${department.name}`)
        $('#deleteBtn').css('display','block')
        $('#locationsInput').append(`
        <option selected="selected" value="${department.locationID}">${department.locationName}</option>
        `)
        $('#updateBtn').attr('onclick',`updateDepartment(${department.id})`)
        $('#deleteBtn').attr('onclick',`deleteItem('department',${department.id})`)
        if (findContacts[0]) {
            $('#deleteTitle').html(`Delete Department`)
            $('#deleteMessage').html(`This department cannot be deleted because it has personnel attatched to it.`)
            $('#deleteBtn').css('display','none')
            findContacts.forEach( (contact,index) => {
            $('#departmentContacts').append(`
            <li><a href="#"  >
                    <div class="contactIcon">${contact.firstName[0]}${contact.lastName[0]}</div>
                    <div class="contactDetails"> ${contact.lastName}, ${contact.firstName}<br>
                    <p class="small" >${contact.department}</p>
                    </div></a></li>
            `)
            })
        } else {
            $('#deleteTitle').html(`Are You Sure?`)
            $('#deleteMessage').html(`This will permenantly delete this department from the company directory.`)
        }
    })

}

async function getLocation(locationId) {
    let findLocation
    let findDepartments
    await Promise.resolve(
        findLocation  = locationsList.filter(location => location.id == locationId),
        findDepartments = departmentsList.filter(departments => departments.locationID == locationId )
    ).then(() => {
        let location = findLocation[0];
        
        $('#singleLocationNameInput').val(location.name)
        $('#singleLocationName').html(`${location.name}`)
        $('#deleteBtn').css('display','block')
        $('#locationsInput').val(location.name)
        $('#updateBtn').attr('onclick',`updateLocation(${location.id})`)
        $('#deleteBtn').attr('onclick',`deleteItem('location',${location.id})`)
        if (findDepartments[0]) {
            $('#deleteTitle').html(`Delete Location`)
            $('#deleteMessage').html(`This location cannot be deleted because it has departments attatched to it.`)
            $('#deleteBtn').css('display','none')
            findDepartments.forEach( (department,index) => {
                $('#locationDepartments').append(`
                <li><a href="#" onClick="getDepartment(${department.id})" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" >${department.name}</a></li>
                `)
                })
        } else {
            $('#deleteTitle').html(`Are You Sure?`)
            $('#deleteMessage').html(`This will permenantly delete this location from the company directory.`)
        }
    })

}


async function getContact(contactId) {
    

    let findContact 
    await Promise.resolve(
        findContact  = contactsList.filter(contact => contact.id == contactId)
    ).then(() => {
        let contact = findContact[0];
        $('#departmentInput').html(``)
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
        <p class="small" >Department</p>
        <p class="contactInfoItem">${contact.department}</p>
        <p class="small" >Location</p>
        <p class="contactInfoItem">${contact.location}</p>
        <p class="small" >Job Title</p>
        <p class="contactInfoItem">${contact.jobTitle}</p>
        <p class="small" >Email Address</p>
        <p class="contactInfoItem">${contact.email}</p>
        `)
    })

    
            
}

async function updateContact(contactId) {
await $.ajax({
        url: 'https://dev1.mattt.uk/projects/companydirectory/app/main.php',
        type: 'POST',
        dataType: 'json',
        data: {crud: 'update', requestType: 'contact', id: contactId, firstName: $('#firstNameInput').val(), lastName: $('#lastNameInput').val(), 
        email: $('#emailInput').val(), departmentID: $('#departmentInput').val(), jobTitle: $('#jobTitleInput').val()},
        success: result => {
           if (result['status']['code'] == 200) {
               $('#responseMessage').html('Contact Saved')
            $('.toast').toast('show');
           } else {
            $('#responseMessage').html('Something went wrong')
            $('.toast').toast('show');
           }
          

        } 
    }).then(await getAllContacts()).then(getContact(contactId));
    

}

async function updateDepartment(departmentId) {
    $.ajax({
            url: 'https://dev1.mattt.uk/projects/companydirectory/app/main.php',
            type: 'POST',
            dataType: 'json',
            data: {crud: 'update', requestType: 'department', id: departmentId, departmentName: $('#singleDepartmentNameInput').val(), locationID: $('#locationsInput').val() },
            success: result => {
               if (result['status']['code'] == 200) {
                   $('#responseMessage').html('Department Saved')
                $('.toast').toast('show');
               } else {
                $('#responseMessage').html('Something went wrong')
                $('.toast').toast('show');
               }
              
    
            } 
        })
        const refreshed = await getAllContacts();
        
}

async function updateLocation(locationId) {
    $.ajax({
            url: 'https://dev1.mattt.uk/projects/companydirectory/app/main.php',
            type: 'POST',
            dataType: 'json',
            data: {crud: 'update', requestType: 'location', id: locationId, locationName: $('#singleLocationNameInput').val() },
            success: result => {
               if (result['status']['code'] == 200) {
                   $('#responseMessage').html('Location Saved')
                $('.toast').toast('show');
               } else {
                $('#responseMessage').html('Something went wrong')
                $('.toast').toast('show');
               }
              
    
            } 
        })
        const refreshed = await getAllContacts();
        getLocation(locationId)
}


async function addContact() {
    $.ajax({
            url: 'https://dev1.mattt.uk/projects/companydirectory/app/main.php',
            type: 'POST',
            dataType: 'json',
            data: {crud: 'create', requestType: 'contact', firstName: $('#firstNameInputNew').val(), lastName: $('#lastNameInputNew').val(), 
            email: $('#emailInputNew').val(), departmentID: $('#departmentInputNew').val(), jobTitle: $('#jobTitleInputNew').val()},
            success: result => {
               if (result['status']['code'] == 200) {
                   $('#responseMessage').html('Contact Saved')
                $('.toast').toast('show');
               } else {
                $('#responseMessage').html('Something went wrong')
                $('.toast').toast('show');
               }
              
    
            } 
        })
        const refreshed = await getAllContacts();

}

async function addDepartment() {
    $.ajax({
            url: 'https://dev1.mattt.uk/projects/companydirectory/app/main.php',
            type: 'POST',
            dataType: 'json',
            data: {crud: 'create', requestType: 'department', departmentName: $('#singleDepartmentNameInputNew').val(), locationID: $('#locationsInputNew').val()},
            success: result => {
               if (result['status']['code'] == 200) {
                   $('#responseMessage').html('Department Saved')
                $('.toast').toast('show');
               } else {
                $('#responseMessage').html('Something went wrong')
                $('.toast').toast('show');
               }
              
    
            } 
        })
        const refreshed = await getAllContacts();    
}

async function addLocation() {
    $.ajax({
            url: 'https://dev1.mattt.uk/projects/companydirectory/app/main.php',
            type: 'POST',
            dataType: 'json',
            data: {crud: 'create', requestType: 'location', locationName: $('#singleLocationNameInputNew').val()},
            success: result => {
               if (result['status']['code'] == 200) {
                   $('#responseMessage').html('Department Saved')
                $('.toast').toast('show');
               } else {
                $('#responseMessage').html('Something went wrong')
                $('.toast').toast('show');
               }
              
    
            } 
        })
        const refreshed = await getAllContacts();    
}


async function deleteItem(itemType,itemId) {
 await $.ajax({
        url: 'https://dev1.mattt.uk/projects/companydirectory/app/main.php',
        type: 'POST',
        dataType: 'json',
        data: {crud: 'delete', requestType: itemType, id: itemId },
        success: result => {
            if (result['status']['code'] == 200) {
                $('#responseMessage').html('Succesfully Deleted')
             $('.toast').toast('show');
            } else {
             $('#responseMessage').html('Something went wrong')
             $('.toast').toast('show');
            }
        }
}).then(await getAllContacts()).then();

}

$(document).ready( () => {

    $('#editContactBtn').click(() => {
        $('#contactDetails').toggle()
        $('#editContactForm').toggle()
        $('#editContactBtn').toggle()
        $('#saveContactBtn').toggle()
    })

    $('#saveContactBtn').click(() => {
        $('#contactDetails').toggle()
        $('#editContactForm').toggle()
        $('#editContactBtn').toggle()
        $('#saveContactBtn').toggle()
    })

    $('#toggleSearchFilter').click(() => {
        $('#filterSearch').toggle()
        $('.sspacer').toggle()
    })

 })
 

getAllContacts();
