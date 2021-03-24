/*
// TODO: statusbar mostra o retorno de cada função da ctype pro char selecionado
// TODO: Tip: Ctrl+V for VERBATIM input (e.g.: CTRL+V M -> produces ^M)
*/
function init() {
  var base = document.getElementById('panel');
  for (var i = 0; i < 128; ++i)
  {
    var char = base.cloneNode(true);
    char.id = "char"+i;
    setEventsListenersForChar(char, i);

    var c = chars[i];
    char.querySelector(".rep").innerText = c.txt;

    char.querySelector(".dec").innerText = i;
    var hexValue = ('0'+i.toString(16)).substr(-2).toUpperCase()+'h';
    char.querySelector(".hex").innerText = hexValue;

    for(var key in c){
      // console.log(key + ': ' + c[key]);
      var attr = char.querySelector("."+key);
      if (c[key] == 0 && attr)
        attr.style.display = "none";
    }

    if (c["cntrl"] == 0) {
      char.classList.add("printchar");
      char.querySelector(".printfooter").classList.remove("ctrlfooter");
      char.querySelector(".caret").style.display = "none";
      char.querySelector(".escape").style.display = "none";
    } else {
      char.classList.add("controlchar");
      char.querySelector(".caret").innerText = c["caret"];
      if (c["esc"])
        char.querySelector(".escape").innerText = c["esc"];
      else if (c["obs"])
        char.querySelector(".escape").innerText = c["obs"];
    }

    char.style.float="left";
    if ((i % 16) == 0)
      char.style.clear = "both";

    base.parentNode.appendChild(char);
  }
  base.style.display = "none";
  setupFilters();
}

function setEventsListenersForChar(element, n){
  element.addEventListener('mouseenter', function(evt){
    mouseEnterChar(n, evt);
  }, false);
  element.addEventListener('mouseleave', mouseLeaveChar, false);
}

function mouseEnterChar(i, evt) {
  var statusbar = document.getElementById("status");
  var char = chars[i];
  for(var key in char){
    var attr = statusbar.querySelector("."+key);
    if (char[key] != 1 && attr)
    {
      attr.style.visibility = "hidden";
    }
  }
  createTooltip(i, evt);
}

function mouseLeaveChar() {
  var labels = document.getElementById('status').getElementsByClassName("attr");
  for(var i=0; i<labels.length; i++) {
    labels[i].style.visibility = "visible";
  }
  destroyTooltip();
}

function createTooltip(charCode, evt) {
  // console.log('x: ' + evt.pageX + ' y: ' + evt.pageY);
  var tooltip = document.createElement("div");
  tooltip.classList.add("tooltip");
  // tooltip.style.top = evt.clientY + 10 + 'px';
  // tooltip.style.left = evt.clientX + 10 +'px';
  document.body.appendChild(tooltip);
  document.tooltipElem = tooltip;
  document.addEventListener('mousemove', function(e){documentMouseMove(e, charCode);});
  fillTooltip(tooltip, charCode);
}

function fillTooltip(tooltip, charCode) {
  var char = chars[charCode];
  tooltip.innerHTML = '<span class="rep">'+char.txt+'</span><br />';
  var note = notes[char.txt];
  if (note) {
    // console.log(note);
    tooltip.innerHTML += note + '<br />';
  }
  tooltip.innerHTML += 'Decimal: <span class="num">'+charCode+'</span>';
  tooltip.innerHTML += ' Hexadecimal: <span class="num">0x'+('0'+charCode.toString(16)).substr(-2).toUpperCase()+'</span>';
  tooltip.innerHTML += '<br />Octal: <span class="num">0'+charCode.toString(8)+'</span>';
  tooltip.innerHTML += ' Binary: <span class="num">'+toBin(charCode)+'</span>';
  if (char.caret) {
    tooltip.innerHTML += '<br />Caret notation: <span class="caret">'+char.caret+'</span>';
  }
  if (char.esc) {
    tooltip.innerHTML += '<br />C escape sequence: <span class="escape">'+char.esc+'</span>';
  }
  var labels = document.getElementById('status').getElementsByClassName("attr");
  for(var i=0; i<labels.length; i++) {
    if (labels[i].style.visibility == "visible") {
      // tooltip.innerText += '\n';
      var label = labels[i].cloneNode(true);
      tooltip.innerHTML += '<br />';
      tooltip.appendChild(label);
    }
  }
}

function toBin(n) {
  return ('00000000'+n.toString(2)).substr(-8).match(/\d{4}/g).join('  ');
}

function documentMouseMove(evt,charCode) {
  if (charCode < 64)
    document.tooltipElem.style.top = evt.clientY + 20 + 'px';
  else
    document.tooltipElem.style.top = evt.clientY - document.tooltipElem.offsetHeight - 20 + 'px';
  document.tooltipElem.style.left = evt.clientX - 128 +'px';
}

function destroyTooltip() {
  document.removeEventListener('mousemove', documentMouseMove);
  document.tooltipElem.remove();
}

function setupFilters() {
  var statusbar = document.getElementById("status");
  var labels = document.getElementById('status').getElementsByClassName("attr");
  for(var i=0; i<labels.length; i++) {
    setFilterFor(labels[i]);
  }
}

function filterBy(charClass) {
  // console.log(charClass);
  for (var i = 0; i < 128; i++) {
    if (chars[i][charClass] != 1) {
      document.getElementById("char"+i).style.visibility = "hidden";
    }
  }
}

function filterClear() {
  for (var i = 0; i < 128; i++) {
    document.getElementById("char"+i).style.visibility = "visible";
  }
}

function setFilterFor(elem) {
  elem.addEventListener('mouseenter', function(){filterBy(elem.id);}, false);
  elem.addEventListener('mouseleave', filterClear, false);
}

var chars = [
  {txt: "NUL",   cntrl: 1, print: 0, graph: 0, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 0, xdigit: 0, caret: "^@", esc: '\\0'},
  {txt: "SOH",   cntrl: 1, print: 0, graph: 0, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 0, xdigit: 0, caret: "^A"},
  {txt: "STX",   cntrl: 1, print: 0, graph: 0, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 0, xdigit: 0, caret: "^B"},
  {txt: "ETX",   cntrl: 1, print: 0, graph: 0, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 0, xdigit: 0, caret: "^C"},
  {txt: "EOT",   cntrl: 1, print: 0, graph: 0, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 0, xdigit: 0, caret: "^D"},
  {txt: "ENQ",   cntrl: 1, print: 0, graph: 0, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 0, xdigit: 0, caret: "^E"},
  {txt: "ACK",   cntrl: 1, print: 0, graph: 0, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 0, xdigit: 0, caret: "^F"},
  {txt: "BEL🔔", cntrl: 1, print: 0, graph: 0, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 0, xdigit: 0, caret: "^G", esc: '\\a'},

  {txt: "BS ←", cntrl: 1, print: 0, graph: 0, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 0, xdigit: 0, caret: "^H", esc: '\\b'},
  {txt: "HT ↹", cntrl: 1, print: 0, graph: 0, alpha: 0, digit: 0, space: 1, upper: 0, lower: 0, punct: 0, xdigit: 0, caret: "^I", esc: '\\t'},
  {txt: "LF",   cntrl: 1, print: 0, graph: 0, alpha: 0, digit: 0, space: 1, upper: 0, lower: 0, punct: 0, xdigit: 0, caret: "^J", esc: '\\n'},
  {txt: "VT",   cntrl: 1, print: 0, graph: 0, alpha: 0, digit: 0, space: 1, upper: 0, lower: 0, punct: 0, xdigit: 0, caret: "^K", esc: '\\v'},
  {txt: "FF",   cntrl: 1, print: 0, graph: 0, alpha: 0, digit: 0, space: 1, upper: 0, lower: 0, punct: 0, xdigit: 0, caret: "^L", esc: '\\f'},
  {txt: "CR ↵", cntrl: 1, print: 0, graph: 0, alpha: 0, digit: 0, space: 1, upper: 0, lower: 0, punct: 0, xdigit: 0, caret: "^M", esc: '\\r'},
  {txt: "SO",   cntrl: 1, print: 0, graph: 0, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 0, xdigit: 0, caret: "^N"},
  {txt: "SI",   cntrl: 1, print: 0, graph: 0, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 0, xdigit: 0, caret: "^O"},




  {txt: "DLE", cntrl: 1, print: 0, graph: 0, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 0, xdigit: 0, caret: "^P"},
  {txt: "DC1", cntrl: 1, print: 0, graph: 0, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 0, xdigit: 0, caret: "^Q", obs: "xon"},
  {txt: "DC2", cntrl: 1, print: 0, graph: 0, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 0, xdigit: 0, caret: "^R"},
  {txt: "DC3", cntrl: 1, print: 0, graph: 0, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 0, xdigit: 0, caret: "^S", obs: "xoff"},
  {txt: "DC4", cntrl: 1, print: 0, graph: 0, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 0, xdigit: 0, caret: "^T"},
  {txt: "NAK", cntrl: 1, print: 0, graph: 0, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 0, xdigit: 0, caret: "^U"},
  {txt: "SYN", cntrl: 1, print: 0, graph: 0, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 0, xdigit: 0, caret: "^V"},
  {txt: "ETB", cntrl: 1, print: 0, graph: 0, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 0, xdigit: 0, caret: "^W"},

  {txt: "CAN", cntrl: 1, print: 0, graph: 0, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 0, xdigit: 0, caret: "^X"},
  {txt: "EM",  cntrl: 1, print: 0, graph: 0, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 0, xdigit: 0, caret: "^Y"},
  {txt: "SUB", cntrl: 1, print: 0, graph: 0, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 0, xdigit: 0, caret: "^Z"},
  {txt: "ESC", cntrl: 1, print: 0, graph: 0, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 0, xdigit: 0, caret: "^[", esc: '\\e'},
  {txt: "FS",  cntrl: 1, print: 0, graph: 0, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 0, xdigit: 0, caret: "^\\"},
  {txt: "GS",  cntrl: 1, print: 0, graph: 0, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 0, xdigit: 0, caret: "^]"},
  {txt: "RS",  cntrl: 1, print: 0, graph: 0, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 0, xdigit: 0, caret: "^^"},
  {txt: "US",  cntrl: 1, print: 0, graph: 0, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 0, xdigit: 0, caret: "^_"},




  {txt: "SP", cntrl: 0, print: 1, graph: 0, alpha: 0, digit: 0, space: 1, upper: 0, lower: 0, punct: 0, xdigit: 0},
  {txt: "!",  cntrl: 0, print: 1, graph: 1, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 1, xdigit: 0},
  {txt: "\"", cntrl: 0, print: 1, graph: 1, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 1, xdigit: 0},
  {txt: "#",  cntrl: 0, print: 1, graph: 1, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 1, xdigit: 0},
  {txt: "$",  cntrl: 0, print: 1, graph: 1, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 1, xdigit: 0},
  {txt: "%",  cntrl: 0, print: 1, graph: 1, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 1, xdigit: 0},
  {txt: "&",  cntrl: 0, print: 1, graph: 1, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 1, xdigit: 0},
  {txt: "'",  cntrl: 0, print: 1, graph: 1, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 1, xdigit: 0},

  {txt: "(", cntrl: 0, print: 1, graph: 1, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 1, xdigit: 0},
  {txt: ")", cntrl: 0, print: 1, graph: 1, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 1, xdigit: 0},
  {txt: "*", cntrl: 0, print: 1, graph: 1, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 1, xdigit: 0},
  {txt: "+", cntrl: 0, print: 1, graph: 1, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 1, xdigit: 0},
  {txt: ",", cntrl: 0, print: 1, graph: 1, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 1, xdigit: 0},
  {txt: "-", cntrl: 0, print: 1, graph: 1, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 1, xdigit: 0},
  {txt: ".", cntrl: 0, print: 1, graph: 1, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 1, xdigit: 0},
  {txt: "/", cntrl: 0, print: 1, graph: 1, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 1, xdigit: 0},




  {txt: "0", cntrl: 0, print: 1, graph: 1, alpha: 0, digit: 1, space: 0, upper: 0, lower: 0, punct: 0, xdigit: 1},
  {txt: "1", cntrl: 0, print: 1, graph: 1, alpha: 0, digit: 1, space: 0, upper: 0, lower: 0, punct: 0, xdigit: 1},
  {txt: "2", cntrl: 0, print: 1, graph: 1, alpha: 0, digit: 1, space: 0, upper: 0, lower: 0, punct: 0, xdigit: 1},
  {txt: "3", cntrl: 0, print: 1, graph: 1, alpha: 0, digit: 1, space: 0, upper: 0, lower: 0, punct: 0, xdigit: 1},
  {txt: "4", cntrl: 0, print: 1, graph: 1, alpha: 0, digit: 1, space: 0, upper: 0, lower: 0, punct: 0, xdigit: 1},
  {txt: "5", cntrl: 0, print: 1, graph: 1, alpha: 0, digit: 1, space: 0, upper: 0, lower: 0, punct: 0, xdigit: 1},
  {txt: "6", cntrl: 0, print: 1, graph: 1, alpha: 0, digit: 1, space: 0, upper: 0, lower: 0, punct: 0, xdigit: 1},
  {txt: "7", cntrl: 0, print: 1, graph: 1, alpha: 0, digit: 1, space: 0, upper: 0, lower: 0, punct: 0, xdigit: 1},

  {txt: "8", cntrl: 0, print: 1, graph: 1, alpha: 0, digit: 1, space: 0, upper: 0, lower: 0, punct: 0, xdigit: 1},
  {txt: "9", cntrl: 0, print: 1, graph: 1, alpha: 0, digit: 1, space: 0, upper: 0, lower: 0, punct: 0, xdigit: 1},
  {txt: ":", cntrl: 0, print: 1, graph: 1, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 1, xdigit: 0},
  {txt: ";", cntrl: 0, print: 1, graph: 1, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 1, xdigit: 0},
  {txt: "<", cntrl: 0, print: 1, graph: 1, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 1, xdigit: 0},
  {txt: "=", cntrl: 0, print: 1, graph: 1, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 1, xdigit: 0},
  {txt: ">", cntrl: 0, print: 1, graph: 1, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 1, xdigit: 0},
  {txt: "?", cntrl: 0, print: 1, graph: 1, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 1, xdigit: 0},




  {txt: "@", cntrl: 0, print: 1, graph: 1, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 1, xdigit: 0},
  {txt: "A", cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 1, lower: 0, punct: 0, xdigit: 1},
  {txt: "B", cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 1, lower: 0, punct: 0, xdigit: 1},
  {txt: "C", cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 1, lower: 0, punct: 0, xdigit: 1},
  {txt: "D", cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 1, lower: 0, punct: 0, xdigit: 1},
  {txt: "E", cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 1, lower: 0, punct: 0, xdigit: 1},
  {txt: "F", cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 1, lower: 0, punct: 0, xdigit: 1},
  {txt: "G", cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 1, lower: 0, punct: 0, xdigit: 0},

  {txt: "H", cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 1, lower: 0, punct: 0, xdigit: 0},
  {txt: "I", cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 1, lower: 0, punct: 0, xdigit: 0},
  {txt: "J", cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 1, lower: 0, punct: 0, xdigit: 0},
  {txt: "K", cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 1, lower: 0, punct: 0, xdigit: 0},
  {txt: "L", cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 1, lower: 0, punct: 0, xdigit: 0},
  {txt: "M", cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 1, lower: 0, punct: 0, xdigit: 0},
  {txt: "N", cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 1, lower: 0, punct: 0, xdigit: 0},
  {txt: "O", cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 1, lower: 0, punct: 0, xdigit: 0},




  {txt: "P", cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 1, lower: 0, punct: 0, xdigit: 0},
  {txt: "Q", cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 1, lower: 0, punct: 0, xdigit: 0},
  {txt: "R", cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 1, lower: 0, punct: 0, xdigit: 0},
  {txt: "S", cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 1, lower: 0, punct: 0, xdigit: 0},
  {txt: "T", cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 1, lower: 0, punct: 0, xdigit: 0},
  {txt: "U", cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 1, lower: 0, punct: 0, xdigit: 0},
  {txt: "V", cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 1, lower: 0, punct: 0, xdigit: 0},
  {txt: "W", cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 1, lower: 0, punct: 0, xdigit: 0},

  {txt: "X",  cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 1, lower: 0, punct: 0, xdigit: 0},
  {txt: "Y",  cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 1, lower: 0, punct: 0, xdigit: 0},
  {txt: "Z",  cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 1, lower: 0, punct: 0, xdigit: 0},
  {txt: "[",  cntrl: 0, print: 1, graph: 1, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 1, xdigit: 0},
  {txt: "\\", cntrl: 0, print: 1, graph: 1, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 1, xdigit: 0},
  {txt: "]",  cntrl: 0, print: 1, graph: 1, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 1, xdigit: 0},
  {txt: "^",  cntrl: 0, print: 1, graph: 1, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 1, xdigit: 0},
  {txt: "_",  cntrl: 0, print: 1, graph: 1, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 1, xdigit: 0},




  {txt: "`", cntrl: 0, print: 1, graph: 1, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 1, xdigit: 0},
  {txt: "a", cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 0, lower: 1, punct: 0, xdigit: 1},
  {txt: "b", cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 0, lower: 1, punct: 0, xdigit: 1},
  {txt: "c", cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 0, lower: 1, punct: 0, xdigit: 1},
  {txt: "d", cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 0, lower: 1, punct: 0, xdigit: 1},
  {txt: "e", cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 0, lower: 1, punct: 0, xdigit: 1},
  {txt: "f", cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 0, lower: 1, punct: 0, xdigit: 1},
  {txt: "g", cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 0, lower: 1, punct: 0, xdigit: 0},

  {txt: "h", cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 0, lower: 1, punct: 0, xdigit: 0},
  {txt: "i", cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 0, lower: 1, punct: 0, xdigit: 0},
  {txt: "j", cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 0, lower: 1, punct: 0, xdigit: 0},
  {txt: "k", cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 0, lower: 1, punct: 0, xdigit: 0},
  {txt: "l", cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 0, lower: 1, punct: 0, xdigit: 0},
  {txt: "m", cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 0, lower: 1, punct: 0, xdigit: 0},
  {txt: "n", cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 0, lower: 1, punct: 0, xdigit: 0},
  {txt: "o", cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 0, lower: 1, punct: 0, xdigit: 0},




  {txt: "p", cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 0, lower: 1, punct: 0, xdigit: 0},
  {txt: "q", cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 0, lower: 1, punct: 0, xdigit: 0},
  {txt: "r", cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 0, lower: 1, punct: 0, xdigit: 0},
  {txt: "s", cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 0, lower: 1, punct: 0, xdigit: 0},
  {txt: "t", cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 0, lower: 1, punct: 0, xdigit: 0},
  {txt: "u", cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 0, lower: 1, punct: 0, xdigit: 0},
  {txt: "v", cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 0, lower: 1, punct: 0, xdigit: 0},
  {txt: "w", cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 0, lower: 1, punct: 0, xdigit: 0},

  {txt: "x",   cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 0, lower: 1, punct: 0, xdigit: 0},
  {txt: "y",   cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 0, lower: 1, punct: 0, xdigit: 0},
  {txt: "z",   cntrl: 0, print: 1, graph: 1, alpha: 1, digit: 0, space: 0, upper: 0, lower: 1, punct: 0, xdigit: 0},
  {txt: "{",   cntrl: 0, print: 1, graph: 1, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 1, xdigit: 0},
  {txt: "|",   cntrl: 0, print: 1, graph: 1, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 1, xdigit: 0},
  {txt: "}",   cntrl: 0, print: 1, graph: 1, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 1, xdigit: 0},
  {txt: "~",   cntrl: 0, print: 1, graph: 1, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 1, xdigit: 0},
  {txt: "DEL", cntrl: 1, print: 0, graph: 0, alpha: 0, digit: 0, space: 0, upper: 0, lower: 0, punct: 0, xdigit: 0, caret: "^?"},
];

var notes = {
  NUL: "Null character", SOH: "Start of Header", STX: "Start of Text",
  ETX: "End of Text", EOT: "End of Transmission", ENQ: "Enquiry",
  ACK: "Acknowledgment", 'BEL🔔': "Bell", 'BS ←': "Backspace",
  'HT ↹': "Horizontal Tab", LF: "Line feed", VT: "Vertical Tab",
  FF: "Form feed", 'CR ↵': "Carriage return", SO: "Shift Out",
  SI: "Shift In", DLE: "Data Link Escape", DC1: "Device Control 1 (oft. XON)",
  DC2: "Device Control 2", DC3: "Device Control 3 (oft. XOFF)", DC4: "Device Control 4",
  NAK: "Negative Acknowledgment", SYN: "Synchronous idle", ETB: "End of Transmission Block",
  CAN: "Cancel", EM: "End of Medium", SUB: "Substitute",
  ESC: "Escape", FS: "File Separator", GS: "Group Separator",
  RS: "Record Separator", US: "Unit Separator", DEL: "Delete",
  SP: "Space"
};
