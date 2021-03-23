// document.write('A');

// TODO: corrigir cor de cntrl/print[graph][punct][alpha]
// TODO: corrigir alinhamento/centralizar [SP|U|L]
// TODO: Escrever hint/hover text para substituir notas de rodapé
// TODO: TH / HEADERS _0 ate _F na horiz e 0_ ate 7_ na vert
// TODO: binary and octal na tooltip
// TODO: Escape code [C]
// TODO: Caret notation
// TODO: statusbar mostra o retorno de cada função da ctype pro char selecionado
// TODO: isxdigit
// TODO: XON/XOFF
// TODO: Tip: Ctrl+V for VERBATIM input (e.g.: CTRL+V M -> produces ^M)


function ascii() {
  document.write("<table>");
  for (var i = 0; i <= 0x07; ++i)
  {
    document.write('<tr>');
    for (var j = 0; j <= 0x0F; ++j)
    {
      var charCode = (16*i)+j;
      document.write('<td class="outer '+charClass(charCode)+'">');
      // console.log('<td class="outer '+charClass(charCode)+'">');
      writeChar(charCode);
      document.write('</td>');
    }
    document.write('</tr>');
  }
  document.write("</table>");
}

function writeChar(c) {
  document.write("<table style=\"width: 100%\">");
    document.write('<tr>');
      document.write('<td class="charCode dec">'+c.toString(10)+'</td>');
      var northAttrStyle = strIf(isSpace(c), 'SP', '')+strIf(isUpper(c), 'U', '')+strIf(isLower(c), 'L', '');
      var northAttrTxt = filler(strIf(isSpace(c), 'SP', '')+strIf(isUpper(c), 'U', '')+strIf(isLower(c), 'L', ''));
      document.write('<td class="'+northAttrStyle+'">'+northAttrTxt+'</td>');
      document.write('<td class="charCode hex">'+('0'+c.toString(16)).substr(-2).toUpperCase()+'h'+'</td>');
    document.write('</tr>');
    document.write('<tr>');
      var punctDigitAlpha = strIf(isPunct(c), 'punct', '')+strIf(isDigit(c), 'digit', '')+strIf(isAlpha(c), 'alpha', '');
      punctDigitAlpha = filler(punctDigitAlpha);
      document.write('<td class="tagPunctDigitAlpha '+punctDigitAlpha+'">'+filler(punctDigitAlpha)+'</td>');
      document.write('<td class="charMain '+ strIf(isxdigit(c), 'hexDigit', '') +'" colspan="2" rowspan="3">'+charFromCode(c)+'</td>');
    document.write('</tr>');
    document.write('<tr>');
      document.write('<td class="tagGraph">'+strIf(isGraph(c), 'graph', '&nbsp;')+'</td>');
    document.write('</tr>');
    document.write('<tr>');
      var CntrlOrPrint = strIf(isControl(c), 'cntrl', 'print');
      document.write('<td class="tagCtrlPrint '+'">'+CntrlOrPrint+'</td>');
    document.write('</tr>');
  document.write("</table>");
}

function charFromCode(c) {
  if (isGraph(c))
    return String.fromCharCode(c);

  switch (c) {
    case 0x00: return 'NUL';
    case 0x01: return 'SOH';
    case 0x02: return 'STX';
    case 0x03: return 'ETX';
    case 0x04: return 'EOT';
    case 0x05: return 'ENQ';
    case 0x06: return 'ACK';
    case 0x07: return 'BEL 🔔';

    case 0x08: return 'BS ←';
    case 0x09: return 'HT ↹';
    case 0x0A: return 'LF';
    case 0x0B: return 'VT';
    case 0x0C: return 'FF';
    case 0x0D: return 'CR ↵';
    case 0x0E: return 'SO';
    case 0x0F: return 'SI';

    case 0x10: return 'DLE';
    case 0x11: return 'DC1';
    case 0x12: return 'DC2';
    case 0x13: return 'DC3';
    case 0x14: return 'DC4';
    case 0x15: return 'NAK';
    case 0x16: return 'SYN';
    case 0x17: return 'ETB';

    case 0x18: return 'CAN';
    case 0x19: return 'EM';
    case 0x1A: return 'SUB';
    case 0x1B: return 'ESC';
    case 0x1C: return 'FS';
    case 0x1D: return 'GS';
    case 0x1E: return 'RS';
    case 0x1F: return 'US';

    case 0x20: return 'SP';

    case 0x7F: return 'DEL';
  }
}

function isPunct(c) {
  return ((c >= 0x21 && c <= 0x2F) || (c >= 0x3A && c <= 0x40) || (c >= 0x5B && c <= 0x60) || (c >= 0x7B && c <= 0x7E));
}

function isDigit(c) {
  return (c >= 0x30 && c <= 0x39);
}

function isAlpha(c) {
  return ((c >= 0x41 && c <= 0x5A) || (c >= 0x61 && c <= 0x7A));
}

function isControl(c) {
  return !isPrint(c);
}

function isPrint(c) {
  return (c >= 0x20 && c <= 0x7E);
}

function isSpace(c) {
  return ((c == 0x20) || (c >= 0x09 && c <= 0x0D));
}

function isUpper(c) {
  return (c >= 0x41 && c <= 0x5A);
}

function isLower(c) {
  return (c >= 0x61 && c <= 0x7A);
}

function isGraph(c) {
  return (c >= 0x21 && c <= 0x7E);
}

function charClass(c) {
  return (isControl(c)) ? 'cntrl' : 'print';
}

function strIf(condition, strForTrue, strForFalse) {
  return (condition) ? strForTrue : strForFalse;
}

function filler(txt) {
  if (txt == '')
    return '&nbsp;';
  return txt;
}

function isxdigit(c) {
  var yesItIs = ((c >= 0x30 && c <= 0x39)||(c >= 0x41 && c <= 0x46)||(c >= 0x61 && c <= 0x66));
  console.log('isxdigit('+c+'): ' + yesItIs);
  return yesItIs;
}
