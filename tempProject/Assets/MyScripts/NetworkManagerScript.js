#pragma strict
var playerPrefab:GameObject;
var spawnObject:Transform;
private var refreshing: boolean;
private var buttonX:float;
private var buttonY:float;
private var buttonHeight:float;
private var buttonWidth:float;
private var hostData:HostData[];
var gameName:String = "Jacob_Crouch_Game";

//Messages
function OnServerInitialized(){
	Debug.Log("Game Initialized");
	spawnPlayer();
}

function OnConnectedToServer(){
	spawnPlayer();
}

function spawnPlayer(){
	Network.Instantiate(playerPrefab, spawnObject.position, Quaternion.identity, 0);
}

function OnMasterServerEvent(mse:MasterServerEvent){
	if(mse == MasterServerEvent.RegistrationSucceeded){
		Debug.Log("Game registered on master server");
	}
}

function refreshHostList(){
	MasterServer.RequestHostList(gameName);
	refreshing = true;
	Update();
	MasterServer.PollHostList();
}

function Update(){
	if(refreshing){
		if(MasterServer.PollHostList().Length > 0){
			refreshing = false;
			Debug.Log("refreshed");
			hostData = MasterServer.PollHostList();
		}
	}
}

function startServer(){
	Network.InitializeServer(2, 25000, !Network.HavePublicAddress);
	MasterServer.RegisterHost(gameName, "Indiana Jones -  Co-op Hunt for Treasure", "Let's get some treasure!");
}


function OnGUI() {
	if(!Network.isClient && !Network.isServer){
		if(GUI.Button(Rect(buttonX, buttonY, buttonWidth, buttonHeight), "Create Game")){
			startServer();
		}
		
		if(GUI.Button(Rect(buttonX, buttonY * 3, buttonWidth, buttonHeight), "Search for Games")){
			refreshHostList();
		}
		if(hostData){
			for(var i:int = 0; i < hostData.length; i++){
				if(GUI.Button(Rect(buttonX * 1.5 + buttonWidth, buttonY * 1.5 + (buttonHeight * i), buttonWidth, buttonHeight * 1.5), hostData[i].gameName)){
					Network.Connect(hostData[i]);
				}
			}
		}
	}
}

function Start () {
	buttonX = Screen.width * .1;
	buttonY = Screen.width * .1;
	buttonWidth = Screen.width * .4;
	buttonHeight = Screen.width * .1;
}

