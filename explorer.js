
function load() {                 
  console.log("loading");
  for (var i = components["components"].length - 1; i >= 0; i--){
    var el = document.createElement("p");             
    var t = components["components"][i];
    var content = '<a class="code" href="' + t["url"] + '">' + t["code"] + "</a>";
    if (t["jira"]) {                   
      var jira = t["jira"].split("/").pop();
      content += '<a class="jira" href="' + t["jira"] + '">' + jira + "</a>";
    }
    content += '<a href="https://pal.int.bbc.co.uk/kandlroute/developers/staticlibrary/'+t["code"]+'">Library</a>';
    content += t["name"];
    el.innerHTML = content;
    el.className = t["status"];
    document.body.appendChild(el);
  };
}

document.addEventListener("DOMContentLoaded", load, false);