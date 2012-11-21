function hasClass(ele,cls) {
return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}
 
function addClass(ele,cls) {
if (!this.hasClass(ele,cls)) ele.className += " "+cls;
}
 
function removeClass(ele,cls) {
if (hasClass(ele,cls)) {
var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
ele.className=ele.className.replace(reg,' ');
}
}
/** previous three function lifted from http://snipplr.com/view/3561/addclass-removeclass-hasclass/ */


var get = function(selector) {
  return document.querySelector(selector);
};
var getAll = function(selector) {
  return document.querySelectorAll(selector);
};
var make = function(element) {
  return document.createElement(element);
};

function load() {
  var container = buildAndAdd("ul", "component-list", "");
  buildAndAdd('h1', "component-name", "Component Library");
  buildAndAdd('div', 'component-summary', '');
  buildAndAdd("iframe", "explorer", "");
  setUpBreakpoints();

  sortComponentsByCode();
  for (var i = components["components"].length - 1; i >= 0; i--){
    container.appendChild(makeComponentItem(components["components"][i]));
  };          
  pullPagesToTop();  
  addKey();
}
function buildAndAdd(element, id, innerHTML) {
  var el = get("#" + id);
  if (el) {
      el.parentNode.removeChild(el);
  }
  el = make(element);
  el.setAttribute("id", id);
  document.body.appendChild(el);
  el.innerHTML = innerHTML
  return el;
}
function sortComponentsByCode() {
  components["components"].sort(function(a, b){
    return a["code"] < b["code"] ? 1 : -1;
  });
}   
function pullPagesToTop() {
  var components = getAll("ul#component-list li");
  for (var i = components.length - 1; i >= 0; i--){
    var data = JSON.parse(components[i].dataset.json);
    if (data.child_components.length > 0) {
      addClass(components[i], "page");
      components[i].parentNode.insertBefore(components[i], get("#component-list").firstChild);
    }
  };
}
function makeComponentItem(t) {
  var el = make("li");
  var content = '<span><a class="code" href="' + t["url"] + '">' + t["code"] + "</a>";
  content += t["name"] + "</span><div class='circle' title='" + t["status"] + "'>&nbsp;</li>";
  el.innerHTML = content;
  el.className = t["status"].toLowerCase().trim().replace(" ", "-");
  el.setAttribute("data-json", JSON.stringify(t));
  el.addEventListener("click", showComponentDetail, false);
  return el;
}

function findComponentByName(name) {
    for (var i=0;i<components["components"].length;i++) {
        if(components["components"][i]["name"] == name.trim()) {
            return components["components"][i];
        }
    }
    return false;
}

function showComponentDetail(e) {
  e.preventDefault();
  for(var x=0;x<this.parentNode.children.length;x++) {
      removeClass(this.parentNode.children[x], "active");
  }
  addClass(this, "active");
  hidePreviewPaneAndShowOverview();
  json = JSON.parse(this.getAttribute("data-json"));
  console.log(json);
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
  var summary = "<p>" + json["overview"].replace(/</g, "&lt;") + "</p>";
  if (json["child_components"].length > 0) {
    summary += "<h2>Child Components</h2>";
    summary += '<ul class="child-components">';
    for (var child=0; child < json["child_components"].length; child++) {
      var component = json["child_components"][child];
      var comp = findComponentByName(component);
      if(comp) {
          var tmp = document.createElement("div");
          tmp.appendChild(makeComponentItem(comp));
          summary += tmp.innerHTML;
      } else {
          summary += "<li>"+ component +"</li>";
      }
    };  
    summary += "</ul>";
  }
  if (json["design"].length > 0) {
    summary += "<h2>Design Samples</h2>";
    for (var i=0; i < json["design"].length; i++) {
      var img = json["design"][i];
      var imgname = img.split("/").pop().split("?").shift();

      summary += "<p>" + decodeURIComponent(imgname) + "</p><a href=\""+img+"\"><img src=\"" + img + "\"/></a>"
    };
  }
  get("#component-name").innerHTML = content;
  get("#component-summary").innerHTML = summary;         
  var status = buildAndAdd("div", "component-status", json["status"]);
  status.className = status.textContent.toLowerCase().trim().replace(" ", "-");
  setUpOverviewLink();
  setUpOpenInIframe();
  setUpChildComponentLinks();
}

function setUpChildComponentLinks() {
    var links = getAll(".child-components li");
    for(var i=0;i<links.length;i++) {
        links[i].addEventListener("click", showComponentDetail, false);
    }
}
function setUpOpenInIframe() {
  var links = getAll("a.open-in-iframe");
  for (var i = links.length - 1; i >= 0; i--){
    links[i].addEventListener("click", openLinkInIframe, false);
  };
}

function openLinkInIframe(e) {
  var iframe = get("#explorer");
  showPreviewPaneAndHideOverview();
  if (this.className.indexOf("-ac") > -1) {
    // cucumber file display
    get("#resize-800").click();
  }
  if (this.className.indexOf("-preview") > -1) {
    // test-harness display
    get("#resize-320").click();
  }
  iframe.setAttribute("src", this.getAttribute("href"));
  e.preventDefault();
}

/* make the iframe resize to various widths */
function setUpBreakpoints() {
  var breakpoints = [320, 400, 600, 768, 800, 1024];
  var b = make("p");
  b.appendChild(document.createTextNode("Resize Preview: "));
  b.setAttribute("id", "breakpoint-container");
  for (var i = breakpoints.length - 1; i >= 0; i--){
    var l = make("a");
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
    hidePreviewPaneAndShowOverview();
    e.preventDefault();
  }, false);
}
function resize(e) {
  e.preventDefault();
  var size = this.getAttribute('href').split("-")[1];
  get("#explorer").style.width = (parseInt(size,10) + 15) + "px";
}

function hidePreviewPaneAndShowOverview() {
  get("#explorer").style.visibility = null;
  get("#breakpoint-container").style.visibility = null;
  get("#component-summary").style.visibility = null;
}
function showPreviewPaneAndHideOverview() {
  get("#explorer").style.visibility = "visible";
  get("#breakpoint-container").style.visibility = "visible";
  get("#component-summary").style.visibility = "hidden";
}                                                          
function addKey() {              
  var key = '<p><div class="draft">&nbsp;</div>Draft</p>';
  key += '<p><div class="for-review">&nbsp;</div>For Review</p>';
  key += '<p><div class="signed-off">&nbsp;</div>Signed off</p>';
  key += '<p><div class="unknown">&nbsp;</div>Unknown</p>';
  buildAndAdd("div", "key", key);
}


document.addEventListener("DOMContentLoaded", load, false);