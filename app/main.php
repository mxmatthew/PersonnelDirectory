<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

require 'config.php';

header('Content-Type: application/json; charset=UTF-8');

$requestType = $_POST['requestType'];
$crud = $_POST['crud'];

$create = false; $read = false; $update = false; $delete = false;

switch ($crud) {
    case 'create':
        $create = true;
        break;
    case 'read':
        $read = true;
        break;
    case 'update':
        $update = true;
        break;
    case 'delete':
        $delete = true;
}


$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    
    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "database unavailable";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);

    exit;

}

if($read) {

    if ($requestType == 'all_contacts') {
        $contactQuery = 'SELECT p.id,p.lastName, p.firstName, p.jobTitle, p.email,p.departmentID, d.name as department, l.name as location FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) ORDER BY p.lastName, p.firstName, d.name, l.name';
        $departmentQuery = 'SELECT id, name, locationID FROM department';
    } 

    $contactResult = $conn->query($contactQuery);
    $departmentResult = $conn->query($departmentQuery);
	
	if (!$contactResult || !$departmentResult ) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}
   
   	$contacts = [];
    $departments = [];

	while ($contactsRow = mysqli_fetch_assoc($contactResult)) {
		array_push($contacts, $contactsRow);
	}
    while ($departmentRow = mysqli_fetch_assoc($departmentResult)) {
		array_push($departments, $departmentRow);
	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['contacts'] = $contacts;
    $output['departments'] = $departments;
	
	mysqli_close($conn);

	echo json_encode($output); 

} elseif ($create) {

    if ($requestType == 'contact') {
    $query = 'INSERT INTO personnel (firstName,lastName,email,departmentID,jobTitle) VALUES("' . $_POST['firstName'] . '","' . $_POST['lastName'] . '","' . $_POST['email'] . '",' . $_POST['departmentID'] . ',
    "' . $_POST['jobTitle'] . '")';
    }
	$result = $conn->query($query);
	
	if (!$result) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];
	
	mysqli_close($conn);

	echo json_encode($output); 

} elseif ($update) {

    if ($requestType == 'contact') {
        $query = 'UPDATE personnel SET firstName = "'. $_POST['firstName'].'", lastName = "'. $_POST['lastName'].'", email = "'. $_POST['email'].'",
        departmentID = "'. $_POST['departmentID'].'", jobTitle = "'. $_POST['jobTitle'].'" WHERE id =  ' . $_POST['id'];
    }

    $result = $conn->query($query);

    if (!$result) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}

    $output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];
	
	mysqli_close($conn);

	echo json_encode($output); 


} elseif ($delete) {

    if ($requestType == 'contact') {
    $query = 'DELETE FROM personnel WHERE id = ' . $_POST['id'];
    }

	$result = $conn->query($query);
	
	if (!$result) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];
	
	mysqli_close($conn);

	echo json_encode($output); 

}