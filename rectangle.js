#!/usr/bin/env node

/**
 * Module dependencies.
 */

var drawService  = require('./drawService'),
	  utilsService = require('./utilsService'),
	  ctx     	   = drawService.axel,
    cursor       = drawService.cursor,
    fs           = drawService.fs,
    _            = drawService._;

module.exports = {
	startRectangle : startRectangle
}

var description = "draw rectangle on the console";

/**
 * Get the params on the console
 */
utilsService.getParams(description, function (err, resp){

	var x1  = resp.firstLevelX || 0,
		  y1  = resp.firstLevelY || 0,
      x2  = resp.secondlevelX || 0,
      y2  = resp.secondlevelY || 0;

		startRectangle(x1, y1, x2, y2, function (err, resp){
      if (err) return console.error(err);
      //console.log("drawn it", resp);
		});
});

/**
 * This function make the logic to draw a rectangle
 * @param  {Integer} x1 
 * @param  {Integer} y1 
 * @param  {Integer} x2 
 * @param  {Integer} y2 
 * @return {Boolean}   
 */
function startRectangle(x1, y1, x2, y2, cb){

  /** put the cursor to the end */
  fs.readFile('./data/localStorage.json', function (err, data) {
    if (err) return console.error("it's necessary have a drawing canvas");
    var data  = _.isEmpty(data) ? {} : JSON.parse(data);

    if(!_.isEmpty(data.canvas)){
      
      /** fix the limits */
      drawService.drawRectangleLimits(data.canvas, x1, y1, x2, y2, function (x1, y1, x2, y2){

        var rectangleObj = {
          x: x1,
          y: y1,
          X: x2,
          Y: y2,
          type: 'rectangle'
        }
        /** hierarchy for canvas */
        drawService.drawInConsole(data.canvas);
        /** let's do the line or lines */
        if(!_.isEmpty(data.line)){

          for (var i in data.line){

             var toDraw = {
                x: data.line[i].x,
                y: data.line[i].y,
                X: data.line[i].X,
                Y: data.line[i].Y,
                type: 'line'
             }
             drawService.drawInConsole(toDraw);
          }

        }
        /** let's do the rectangle */
        drawService.drawStoreItem(rectangleObj, data.rectangle, 'rectangle', function(rectangleArray){

          data.rectangle = rectangleArray;
          /** Save the line in the file */
          utilsService.writeFile(data, function(err, resp){
            if (err) return console.error(err);
            /** put the cursor to the end */
            drawService.resetCursor();
            cb(null, true);
          });

        });
        
      });  

    }
    
  });  

}