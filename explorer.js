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
}
function buildAndAdd(element, id, innerHTML) {
  var el = make(element);
  el.setAttribute("id", id);
  el.innerHTML = innerHTML
  document.body.appendChild(el);
  return el;
}
function sortComponentsByCode() {
  components["components"].sort(function(a, b){
    return a["code"] < b["code"] ? 1 : -1;
  });
}
function makeComponentItem(t) {
  var el = make("li");
  var content = '<span><a class="code" href="' + t["url"] + '">' + t["code"] + "</a>";
  content += t["name"] + "</span>";
  el.innerHTML = content;
  el.className = t["status"];
  el.setAttribute("data-json", JSON.stringify(t));
  el.addEventListener("click", showComponentDetail, false);
  return el;
}


function showComponentDetail(e) {
  e.preventDefault();
  hidePreviewPaneAndShowOverview();
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
  get("#component-name").innerHTML = content;
  get("#component-summary").innerHTML = summary;

  setUpOverviewLink();
  setUpOpenInIframe();
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
  get("#explorer").style.width =  size + "px";
}

function hidePreviewPaneAndShowOverview() {
  var iframe = get("#explorer");
  iframe.style.visibility = null;
  var resizer = get("#breakpoint-container");
  resizer.style.visibility = null;
  var summary = get("#component-summary");
  summary.style.visibility = null;
}
function showPreviewPaneAndHideOverview() {
  var iframe = get("#explorer");
  iframe.style.visibility = "visible";
  var resizer = get("#breakpoint-container");
  resizer.style.visibility = "visible";
  var summary = get("#component-summary");
  summary.style.visibility = "hidden";
}


document.addEventListener("DOMContentLoaded", load, false);