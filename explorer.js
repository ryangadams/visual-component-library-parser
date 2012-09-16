
function load() {                 
  var container = document.createElement("ul");
  container.setAttribute("id", "component-list");
  document.body.appendChild(container);
  components["components"].sort(function(a, b){
    return a["code"] < b["code"] ? 1 : -1;
  });
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
  var summary = document.createElement("div");
  summary.setAttribute("id", "component-summary");
  document.body.appendChild(summary);
  var pane = document.createElement("iframe");
  pane.setAttribute("id","explorer");
  document.body.appendChild(pane);                         
  pane.appendChild(document.createTextNode("Details go here")); 
  setUpBreakpoints();
}

document.addEventListener("DOMContentLoaded", load, false);

function showComponentDetail(e) {
  var iframe = document.getElementById("explorer");
  iframe.style.visibility = null;       
  var summary = document.getElementById("component-summary");
  summary.style.visibility = null;
  json = JSON.parse(this.getAttribute("data-json"));
                                                        
  var content = "Component: <span class=\"code\">" + json["code"] + 
    "</span> " + json["name"] + "<p>" +
    "<a class=\"overview\" href=\"overview\">Overview</a>&nbsp;|&nbsp;" + 
    "<a href=\"" + json["url"] + "\">Confluence</a>&nbsp;|&nbsp;";
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
  var summary = "<p>" + json["overview"] + "</p>";                 
  if (json["design"].length > 0) {           
    summary += "<h2>Design Samples</h2>";
    for (var i=0; i < json["design"].length; i++) {
      var img = json["design"][i];
      var imgname = img.split("/").pop().split("?").shift();
      
      summary += "<p>" + decodeURIComponent(imgname) + "</p><a href=\""+img+"\"><img src=\"" + img + "\"/></a>"
    };
  }
  document.getElementById("component-name").innerHTML = content;
  document.getElementById("component-summary").innerHTML = summary;
  
  // document.getElementById("explorer").setAttribute(
  //       "src", 
  //       'https://pal.int.bbc.co.uk/kandlroute/developers/staticlibrary/'+json["code"]
  //   );            
  setUpOverviewLink();
  setUpOpenInIframe();  
}

function setUpOpenInIframe() {
  var links = document.querySelectorAll("a.open-in-iframe");
  for (var i = links.length - 1; i >= 0; i--){
    links[i].addEventListener("click", openLinkInIframe, false);
  };
}

function openLinkInIframe(e) {
  var iframe = document.getElementById("explorer");
  iframe.style.visibility = "visible";             
  var summary = document.getElementById("component-summary");
  summary.style.visibility = "hidden";
  if (this.className.indexOf("-ac") > -1) {
    // cucumber file display
    document.getElementById("resize-800").click();
  }
  if (this.className.indexOf("-preview") > -1) {
    // test-harness display
    document.getElementById("resize-320").click();
  }
  iframe.setAttribute("src", this.getAttribute("href"));
  e.preventDefault();                                                                
}

/* make the iframe resize to various widths */
function setUpBreakpoints() {
  var breakpoints = [320, 400, 600, 768, 800, 1024];
  var b = document.createElement("p");
  b.appendChild(document.createTextNode("Resize Preview: "));
  b.setAttribute("id", "breakpoint-container");
  for (var i = breakpoints.length - 1; i >= 0; i--){ 
    var l = document.createElement("a");
    l.appendChild(document.createTextNode(breakpoints[i]));
    l.setAttribute("href", "#resize-" + breakpoints[i]);
    l.setAttribute("id", "resize-" + breakpoints[i]);
    b.appendChild(l);
    l.addEventListener("click", resize, false);
  };
  document.body.appendChild(b);
}                                              
          
function setUpOverviewLink() {
  link = document.querySelector("a.overview");
  link.addEventListener("click", function(e){
    var iframe = document.getElementById("explorer");
    iframe.style.visibility = null;       
    var summary = document.getElementById("component-summary");
    summary.style.visibility = null;
    e.preventDefault();
  }, false);
}
function resize(e) {
  e.preventDefault();
  var size = this.getAttribute('href').split("-")[1];
  document.getElementById("explorer").style.width =  size + "px";
}