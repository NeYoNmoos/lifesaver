function loadcanvas(){
    const canvas = document.getElementById("canvas");
    const data = chrome.storage.local.get(["browsingTime"]);
    const today = new Date().toISOString().split('T')[0];
    if(data){
      if(data[today]){
        for (const url in data[today]) {
          if(data[today][url]){
           
          }
         
    
        
          // You can perform other operations with the URLs here if needed
        }
      }
    }
  }