
function load() {                 
  var container = document.createElement("ul");
  container.setAttribute("id", "component-list");
  document.body.appendChild(container);
  for (var i = components["components"].length - 1; i >= 0; i--){
    var el = document.createElement("li");             
    var t = components["components"][i];
    var content = '<span><a class="code" href="' + t["url"] + '">' + t["code"] + "</a>";
    if (t["jira"]) {                   
      var jira = t["jira"].split("/").pop();
      content += '<a class="jira" href="' + t["jira"] + '">' + jira + "</a>";
    }
    content += t["name"] + "</span>";
    el.innerHTML = content;
    el.className = t["status"];
    container.appendChild(el);
    el.setAttribute("data-json", JSON.stringify(t));
    el.addEventListener("click", function(){
      json = JSON.parse(this.getAttribute("data-json"));
      document.getElementById("explorer").setAttribute(
          "src", 
          'https://pal.int.bbc.co.uk/kandlroute/developers/staticlibrary/'+json["code"]
      );
      return false;
    }, false);
                                       
  };                                   
  
  var pane = document.createElement("iframe");
  pane.setAttribute("id","explorer");
  document.body.appendChild(pane);                         
  pane.appendChild(document.createTextNode("Details go here"));
}

document.addEventListener("DOMContentLoaded", load, false);