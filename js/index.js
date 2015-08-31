/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 
 //generic getById
function getById(id) {
return document.querySelector(id);
}
//generic content logger
function logit(s) {
getById("#content").innerHTML += s;
}


var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
	
		if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
			document.addEventListener("deviceready", this.onDeviceReady, false);
		} else {
			this.onDeviceReady();
		}

    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
		alert('CHEGUEI AQUI');
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, this.onFSSuccess, this.onError);
    },
	onFSSuccess: function(fs) {
		alert('sucesso');
		fileSystem = fs;
		alert('sucesso 2');
		
		getById("#dirListingButton").addEventListener("touchstart",doDirectoryListing);
		getById("#addFileButton").addEventListener("touchstart",doAppendFile);
		getById("#readFileButton").addEventListener("touchstart",doReadFile);
		getById("#metadataFileButton").addEventListener("touchstart",doMetadataFile);
		getById("#deleteFileButton").addEventListener("touchstart",doDeleteFile);

		logit( "Got the file system: "+fileSystem.name +"<br/>" + "root entry name is "+fileSystem.root.name + "<p/>")

		doDirectoryListing();
		
		
	},
	onError: function() {
		alert('deu erro');
	}	
};

function doDeleteFile(e) {
fileSystem.root.getFile("test.txt", {create:true}, function(f) {
f.remove(function() {
logit("File removed<p/>");
});
}, onError);
}

function metadataFile(m) {
logit("File was last modified "+m.modificationTime+"<p/>");
}

function doMetadataFile(e) {
fileSystem.root.getFile("test.txt", {create:true}, function(f) {
f.getMetadata(metadataFile,onError);
}, onError);
}

function readFile(f) {
reader = new FileReader();
reader.onloadend = function(e) {
console.log("go to end");
logit("<pre>" + e.target.result + "</pre><p/>");
}
reader.readAsText(f);
}

function doReadFile(e) {
fileSystem.root.getFile("test.txt", {create:true}, readFile, onError);
}

function appendFile(f) {

f.createWriter(function(writerOb) {
writerOb.onwrite=function() {
logit("Done writing to file.<p/>");
}
//go to the end of the file...
writerOb.seek(writerOb.length);
writerOb.write("Test at "+new Date().toString() + "\n");
})

}

function doAppendFile(e) {
fileSystem.root.getFile("test.txt", {create:true}, appendFile, onError);
}

function gotFiles(entries) {
var s = "";
for(var i=0,len=entries.length; i<len; i++) {
//entry objects include: isFile, isDirectory, name, fullPath
s+= entries[i].fullPath;
if (entries[i].isFile) {
s += " [F]";
}
else {
s += " [D]";
}
s += "<br/>";

}
s+="<p/>";
logit(s);
}


