#pragma strict

function Start () {
	if(networkView.isMine){
		camera.enabled = true;
	}
	else{
		camera.enabled = false;
	}
}
