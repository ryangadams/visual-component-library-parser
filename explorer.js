
function load() {                 
  var container = document.createElement("ul");
  container.setAttribute("id", "component-list");
  document.body.appendChild(container);
  for (var i = components["components"].length - 1; i >= 0; i--){
    var el = document.createElement("li");             
    var t = components["components"][i];
    var content = '<span><a class="code" href="' + t["url"] + '">' + t["code"] + "</a>";
    content += t["name"] + "</span>";
    el.innerHTML = content;
    el.className = t["status"];
    container.appendChild(el);
    el.setAttribute("data-json", JSON.stringify(t));
    el.addEventListener("click", showComponentDetail, false);
                                       
  };                                   
  var title = document.createElement("h1");
  title.setAttribute("id", "component-name");
  title.innerHTML = "Component Library";
  document.body.appendChild(title);
  var pane = document.createElement("iframe");
  pane.setAttribute("id","explorer");
  document.body.appendChild(pane);                         
  pane.appendChild(document.createTextNode("Details go here"));
}

document.addEventListener("DOMContentLoaded", load, false);

function showComponentDetail(e) {
  json = JSON.parse(this.getAttribute("data-json"));
                                                        
  var content = "Component: <span class=\"code\">" + json["code"] + 
    "</span> " + json["name"] + "<p><a href=\"" + json["url"] + "\">Confluence</a>&nbsp;|&nbsp;";
  if (json["cucumber"].slice(0,4) == "http") {
    content += "<a class=\"component-ac open-in-iframe\" " + 
    "href=\"" + json["cucumber"] + "\">" +
    "Acceptance Criteria</a>&nbsp;|&nbsp;";
  } else {
    content += "No link to cucumber&nbsp;|&nbsp;";
  }
  content += "<a class=\"component-preview open-in-iframe\" " + 
    "href=\"https://pal.int.bbc.co.uk/kandlroute/developers/staticlibrary/" + json["code"] + "\">" +
    "Test Harness</a>&nbsp;|&nbsp;";
  if (json["jira"]) {                   
    var jira = json["jira"].split("/").pop();
    content += '<a class="jira" href="' + json["jira"] + '">' + jira + "</a>";
  }          
  content += "</p>";                       
  
  document.getElementById("component-name").innerHTML = content;
  document.getElementById("explorer").setAttribute(
      "src", 
      'https://pal.int.bbc.co.uk/kandlroute/developers/staticlibrary/'+json["code"]
  );  
  setUpOpenInIframe();  
}

function setUpOpenInIframe() {
  var links = document.querySelectorAll("a.open-in-iframe");
  for (var i = links.length - 1; i >= 0; i--){
    links[i].addEventListener("click", openLinkInIframe, false);
  };
}

function openLinkInIframe(e) {
  document.getElementById("explorer").setAttribute("src", this.getAttribute("href"));
    e.preventDefault();                                                                
}

/* make the iframe resize to various widths */
function setUpBreakpoints() {
  var breakpoints = [320, 400, 600, 768, 1024];
  
}