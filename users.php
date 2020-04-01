<?php 

include('dbmodel.php');

$conn = new dbconnection('127.0.0.1', 'root', '', 'bvue');
$ut = new dbmodel($conn);

$ut->idcol = 'id';
$ut->table = 'users';

header('Content-type: application/json');
switch(@$_GET['action']) {
    case 'update' :
        $user = $_POST;
        if (empty($user['id'])) {
            echo json_encode([ 'success' => false, 'message' => 'empty id' ]);
        } else if ($ut->save($user)) {
            echo json_encode([ 'success' => true ]);
        } else {
            echo json_encode([ 'success' => false, 'message' => 'update failed', 'data' => print_r($user, true)  ]);
        }
        break;
    case 'insert' :
        $user = $_POST;
        if (!empty($user['id'])) {
            echo json_encode([ 'success' => false, 'message' => 'there is id value for new data' ]);
        } else if ($id = $ut->save($user)) {
            $user['id'] = $id;
            echo json_encode([ 'success' => true, 'user' => $user ]);
        } else {
            echo json_encode([ 'success' => false, 'message' => 'insert failed' ]);
        }
        break;
    case 'delete' :
        $id = @$_POST['id'];
        if ($ut->delete($id)) {
            echo json_encode([ 'success' => true ]);
        } else {
            echo json_encode([ 'success' => false ]);
        }
        break;
    default:
        $users = $ut->get_all();
        if (!$users) $users = [];
        echo json_encode($users);
        break;
}


