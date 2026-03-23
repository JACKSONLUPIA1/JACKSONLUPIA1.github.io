/* Ensure blog images are equal to the size of the Experience Dates */
function setBlogImageWidth() {
    const jobYear = document.querySelector('.job-year');
    const blogImage = document.querySelector('.blog-image');

    if (jobYear && blogImage) {
        blogImage.style.width = `${jobYear.offsetWidth}px`;
    }
}

document.addEventListener('DOMContentLoaded', setBlogImageWidth);
window.addEventListener('resize', setBlogImageWidth);

/* Typing Text */

document.addEventListener('DOMContentLoaded', () => {
  // Typing animation for homepage roles
  const words = ["Web Security Analyst ", "Web Application Penetration Tester ", "Cyber Security Student "];
  let i = 0;
  let alt = 0;

  function flicker() { 
    alt ^= 1;
    document.getElementById('cursor')?.setAttribute("hidden", alt === 1);
  }

  setInterval(flicker, 600);

  function typeNow() {
    let word = words[i].split("");
    function loopTyping() {
      if (word.length > 0) {
        document.getElementById('text')?.insertAdjacentText("beforeend", word.shift());
      } else {
        setTimeout(deleteNow, 3000);
        return;
      }
      setTimeout(loopTyping, 200);
    }
    loopTyping();
  }

  function deleteNow() {
    let word = document.getElementById('text')?.innerText.split("") || [];
    function loopDeleting() {
      if (word.length > 0) {
        word.pop();
        document.getElementById('text').innerText = word.join("");
      } else {
        i = (i + 1) % words.length;
        typeNow();
        return;
      }
      setTimeout(loopDeleting, 200);
    }
    loopDeleting();
  }

  typeNow();

  // Typing animation for about page whoami /all
  const wordsAbout = ["whoami /all"];
  let j = 0;
  let altAbout = 0;

  function flickerAbout() { 
    altAbout ^= 1;
    document.getElementById('cursor-about')?.setAttribute("hidden", altAbout === 1);
  }

  setInterval(flickerAbout, 600);

  function typeAbout() {
    let word = wordsAbout[j].split("");
    function loopTyping() {
      if (word.length > 0) {
        document.getElementById('text-about')?.insertAdjacentText("beforeend", word.shift());
      } else {
        setTimeout(deleteAbout, 50000);
        return;
      }
      setTimeout(loopTyping, 150);
    }
    loopTyping();
  }

  function deleteAbout() {
    let word = document.getElementById('text-about')?.innerText.split("") || [];
    function loopDeleting() {
      if (word.length > 0) {
        word.pop();
        document.getElementById('text-about').innerText = word.join("");
      } else {
        j = (j + 1) % wordsAbout.length;
        typeAbout();
        return;
      }
      setTimeout(loopDeleting, 100);
    }
    loopDeleting();
  }

  typeAbout();
});


/**
 * Ascii Morph
 * @author: Tim Holman (http://tholman.com)
 */

var AsciiMorph = (function() {

	'use strict';
	
	var element = null;
	var canvasDimensions = {};
	
	var renderedData = [];
	var framesToAnimate = [];
	var myTimeout = null;
	
	/**
	 * Utils
	 */
  
	function extend(target, source) {
	  for (var key in source) {
		if (!(key in target)) {
		  target[key] = source[key];              
		}
	  }
	  return target;
	}
	
	function repeat(pattern, count) {
		if (count < 1) return '';
		var result = '';
		while (count > 1) {
			if (count & 1) result += pattern;
			count >>= 1, pattern += pattern;
		}
		return result + pattern;
	}
	
	function replaceAt(string, index, character ) {
	  return string.substr(0, index) + character + string.substr(index+character.length);
	}
	
	/**
	 * AsciiMorph
	 */
  
	function init(el, canvasSize) {
	  
	  // Save the element
	  element = el;
	  canvasDimensions = canvasSize;
	}
	
	function squareOutData(data) {
	   var i;
	  var renderDimensions = {
		x: 0,
		y: data.length
	  };
  
	  // Calculate centering numbers
	  for (i = 0; i < data.length; i++ ) {
		if (data[i].length > renderDimensions.x) {
		  renderDimensions.x = data[i].length
		}
	  }
	  
	  // Pad out right side of data to square it out
	  for (i = 0; i < data.length; i++ ) {
		if (data[i].length < renderDimensions.x) {
		  data[i] = (data[i] + repeat(' ', renderDimensions.x - data[i].length ));
		}
	  }
	  
	  var paddings = {
		x: Math.floor((canvasDimensions.x - renderDimensions.x) / 2),
		y: Math.floor((canvasDimensions.y - renderDimensions.y) / 2)
	  }
	  
	  // Left Padding
	  for (var i = 0; i < data.length; i++ ) {
		data[i] = repeat(' ', paddings.x) + data[i] + repeat(' ', paddings.x);
	  }
	  
	  // Pad out the rest of everything
	  for (var i = 0; i < canvasDimensions.y; i++ ) {
		if( i < paddings.y) {
		  data.unshift( repeat(' ', canvasDimensions.x));
		} else if (i > (paddings.y + renderDimensions.y)) {
		  data.push( repeat(' ', canvasDimensions.x));
		}
	  }
	  
	  return data;
	}
	
	// Crushes the frame data by 1 unit.
	function getMorphedFrame(data) {
	  
	  var firstInLine, lastInLine = null;
	  var found = false;
	  for (var i = 0; i < data.length; i++) {
		
		var line = data[i];
		firstInLine = line.search(/\S/);
		if (firstInLine === -1) {
		  firstInLine = null;
		}
		
		for (var j = 0; j < line.length; j++) {
		  if( line[j] != ' ') {
			lastInLine = j;
		  }
		}
		
		if (firstInLine !== null && lastInLine !== null) {
		  data = crushLine(data, i, firstInLine, lastInLine)
		  found = true;
		}
	
		firstInLine = null, lastInLine = null;
	  }
	  
	  if (found) {
		return data;
	  } else {
		return false;
	  }
	}
	
	function crushLine(data, line, start, end) {
	  var centers = {
		x: Math.floor(canvasDimensions.x / 2),
		y: Math.floor(canvasDimensions.y / 2)
	  }
	  
	  var crushDirection = 1;
	  if( line > centers.y ) {
		crushDirection = -1;
	  }
	  
	  data[line] = replaceAt(data[line], start, " ");
	  data[line] = replaceAt(data[line], end, " ");
  
	  if( !((end - 1) == (start + 1)) && !(start === end) && !((start + 1) === end)) {
		data[line + crushDirection] = replaceAt(data[line + crushDirection], (start + 1), '+*/\\'.substr(Math.floor(Math.random()*'+*/\\'.length), 1));
		data[line + crushDirection] = replaceAt(data[line + crushDirection], (end - 1), '+*/\\'.substr(Math.floor(Math.random()*'+*/\\'.length), 1));
	  } else if ((((start === end) || (start + 1) === end)) && ((line + 1) !== centers.y && (line - 1) !== centers.y && line !== centers.y)) {
		data[line + crushDirection] = replaceAt(data[line + crushDirection], (start), '+*/\\'.substr(Math.floor(Math.random()*'+*/\\'.length), 1));
		data[line + crushDirection] = replaceAt(data[line + crushDirection], (end), '+*/\\'.substr(Math.floor(Math.random()*'+*/\\'.length), 1));
	  }
	  
	  return data;
	}
	
	function render(data) {
	  var ourData = squareOutData(data.slice());
	  renderSquareData(ourData);
	}
	
	function renderSquareData(data) {
	  element.innerHTML = "";
	  for( var i = 0; i < data.length; i++ ) {
		element.innerHTML = element.innerHTML + data[i] + '\n';
	  }
	  
	  renderedData = data;
	}
	
	// Morph between whatever is current, to the new frame
	function morph(data) {
	  
	  clearTimeout(myTimeout);
	  var frameData = prepareFrames(data.slice());
	  animateFrames(frameData);
	}
	
	function prepareFrames(data) {
	  
	  var deconstructionFrames = [];
	  var constructionFrames = [];
  
	  var clonedData = renderedData
	  
	  // If its taking more than 100 frames, its probably somehow broken
	  // Get the deconscrution frames
	  for(var i = 0; i < 100; i++) {
		var newData = getMorphedFrame(clonedData);
		if( newData === false) {
		  break;
		}
		deconstructionFrames.push(newData.slice(0)); 
		clonedData = newData;
	  }
	  
	  // Get the constuction frames for the new data
	  var squareData = squareOutData(data);
	  constructionFrames.unshift(squareData.slice(0));
	  for( var i = 0; i < 100; i++ ) {
		var newData = getMorphedFrame(squareData);
		if( newData === false) {
		  break;
		}
		constructionFrames.unshift(newData.slice(0));
		squareData = newData;
	  }
	  
	  return deconstructionFrames.concat(constructionFrames)
	}
	
	function animateFrames(frameData) {
	  framesToAnimate = frameData;
	  animateFrame();
	}
	
	function animateFrame() {
	  myTimeout = setTimeout(function() {
		
		renderSquareData(framesToAnimate[0]);
		framesToAnimate.shift();
		if( framesToAnimate.length > 0 ) {
		  animateFrame();
		}
	  }, 20)
  
	  // framesToAnimate
	}
  
	function main(element, canvasSize) {
	  
	  if( !element || !canvasSize ) {
		return;   
	  }
	  
	  init(element, canvasSize);
	}
  
	return extend(main, {
	  render: render,
	  morph: morph
	});
	
  })();
  
  var element = document.querySelector('pre');
  AsciiMorph(element, {x: 45,y: 15});
  
  var asciis = [
	// lol dont ask how long this took
	[
		"        _________________",
"       /                 \\",
"      / _________________ \\",
"     | |_________________| |",
"     | | (root@kali)-[~] | |",
"     | |                 | |",
"     | |                 | |",
"     | |_________________| |",
"     |_____________________|",
"      \\___________________/",
"       /\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\"\\",
"      /:::::::::::::::::::\\",
"     (_____________________)" 
	],

  [
"    .----------------.",
"   |                  |",
"   |        _.-;;-._  |",
"   | '-..-'|   ||   | |",
"   | '-..-'|_.-;;-._| |",
"   | '-..-'|   ||   | |",
"   | '-..-'|_.-''-._| |",
"   |                  |",
"    '----------------' ",

  ],
  
  [
"    .------------------.",
"   |                   |",
"   |        / \\        |",
"   |       /   \\       |",
"   |      /^.   \\      |",
"   |     /  .-.  \\     |",
"   |    /  (   ) _\\    |",
"   |   / _.~   ~._^\\   |",
"   |  /.^         ^.\\  |",
"   |                   |",
"    '-----------------' ",
  ],

];
  
	AsciiMorph.render(asciis[0]);

	var currentIndex = 2;

	setTimeout(function() {
		AsciiMorph.morph(asciis[1]);
	}, 1000);

	setInterval(function() {
		AsciiMorph.morph(asciis[currentIndex]);
		currentIndex++;
		currentIndex%= asciis.length;
	}, 3000);
