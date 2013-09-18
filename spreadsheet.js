function Table(tableId, data, headings) {
  this.table = document.getElementById(tableId);
  this.data = data;
  this.headings = headings; // firstname: "First Name", lastname: "Last Name"...
  this.order = new Array(); // 0: firstname 1: lastname...
  this.sortCol = -1;
  this.revSort = false;
  
  this.table.className += " spreadsheet";
  
  this.formatCell = function (row, key, formatFunc) {
    this.data[row][key].format = formatFunc;
    this.update();
  }
  
  this.formatRow = function (row, formatFunc) {
    for (var key in this.data[row]) {
      this.data[row][key].format = formatFunc;
    }
    this.update();
  }
  
  this.formatColumn = function (key, formatFunc) {
    for (var row in this.data) {
      this.data[row][key].format = formatFunc;
    }
    this.update();
  }
  
  this.initStyle = function (row, key) {
    if (this.data[row][key].style === undefined) {
      this.data[row][key].style = new Array();
    }
  }
  
  this.styleCell = function (row, col, key, value) {
    this.initStyle(row, col);
    this.data[row][col].style[key] = value;
    this.update();
  }
  
  this.styleRow = function (row, key, value) {
    for (var col in this.data[row]) {
      this.initStyle(row, col);
      this.data[row][col].style[key] = value;
    }
    this.update();
  }
  
  this.styleColumn = function (col, key, value) {
    for (var row in this.data) {
      this.initStyle(row, col);
      this.data[row][col].style[key] = value;
    }
    this.update();
  }
  
  this.clear = function () {
    for (var index=this.table.rows.length - 1; index >= 0; index--) {
      this.table.deleteRow(index);
    }
  };
  
  this.makeHeadings = function () {
    this.order = new Array();
    var row = this.table.insertRow(0);
    for (var index in this.headings) {
      var cell = document.createElement("th");
      row.appendChild(cell);
      cell.innerHTML = this.headings[index];
      cell.index = index;
      cell.table = this;
      
      // Prevent editting in IE and Opera
      cell.onfocus = function () {
        this.blur();
      }
      
      cell.onclick = function () {
        if (this.table.sortCol != this.index) {
          this.table.sortCol = this.index;
          this.table.revSort = false;
        } else {
          this.table.revSort = !this.table.revSort;
        }
        this.table.update();
      }
      
      if (this.sortCol == index) {
        cell.className += " sorted";
        if (this.revSort) {
          cell.className += " reversed";
        }
      }
      
      this.order.push(index);
    }
  }
  
  this.update = function () {
    this.clear(); // Erase what's already in the table
    this.makeHeadings(); // Make the headingings
    
    // Do the sorting
    var sortCol = this.sortCol;
    this.data.sort(function (a, b) {
      if (a[sortCol] <  b[sortCol]) return -1;
      if (a[sortCol] == b[sortCol]) return  0;
      if (a[sortCol] >  b[sortCol]) return  1;
    });
    if (this.revSort) {
      this.data.reverse();
    }
    
    // Now add the data
    for (var rowIndex in this.data) {
      var row = this.table.insertRow(-1);
      for (var colIndex in this.order) {
        var cell = row.insertCell(colIndex);
        cell.table = this;
        cell.row = rowIndex;
        cell.key = this.order[colIndex];
        cell.column = colIndex;
        this.updateCell(cell, rowIndex, this.order[colIndex]);
        
        // Make editable
        if (!this.data[rowIndex][this.order[colIndex]].frozen) {
          cell.setAttribute("contenteditable", true);
          // One function for enter
          cell.onkeypress = function(event) {
              var key = event.keyCode || event.charCode;
              if (key == 13) {
                  // Store the new value in the data
                  
                  // Save the style and formatting
                  var style = this.table.data[this.row][this.key].style;
                  var format = this.table.data[this.row][this.key].format;
                  
                  alert(this.table.data[this.row][this.key].style);
                  alert(style);
                  // Overwrite the content
                  this.table.data[this.row][this.key] = this.innerHTML;
                  
                  // Now restore the formatting and style
                  this.table.data[this.row][this.key].style = style;
                  this.table.data[this.row][this.key].format = format;

                  alert(format);
                  alert(style);

                  this.blur();
                  
                  this.table.updateCell(this, this.row, this.key);
                  
                  return false;
              }
          };

          // Another for escape
          cell.onkeyup = function(event) {
              var key = event.keyCode || event.charCode;
              if (key == 27) {
                  // Discard change
                  this.table.updateCell(this, this.row, this.key);
                  this.blur();
                  return false;
              }
          };
        }
      }
    }
  };
  
  this.updateCell = function (cell, row, key) {
    cell.innerHTML = this.format(row, key);
    this.styleCell(cell, row, key);
  }
  
  this.format = function (row, key) {
    // Takes data at row,col and formats it
    if (this.data[row][key].format === undefined) {
      return this.data[row][key];
    } else {
      return this.data[row][key].format(this.data[row][key]);
    }
  }
  
  this.styleCell = function (cell, row, key) {
    // Do styling
    if (this.data[row][key].style !== undefined) {
      for (var index in this.data[row][key].style) {
        cell.style[index] = this.data[row][key].style[index];
      }
    }  
  }
  
  this.update(); // Go ahead and fill the table with data
}
