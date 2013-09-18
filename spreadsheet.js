function Table(tableId, data, headings) {
  this.table = document.getElementById(tableId);
  this.data = data;
  this.headings = headings; // firstname: "First Name", lastname: "Last Name"...
  this.order = new Array(); // 0: firstname 1: lastname...
  this.sortCol = -1;
  this.revSort = false;
  
  this.table.className += " spreadsheet";
  
  this.formatCell = function (row, col, formatFunc) {
    this.data[row][col].format = formatFunc;
    this.update();
  }
  
  this.formatRow = function (row, formatFunc) {
    for (var col in this.data[row]) {
      this.data[row][col].format = formatFunc;
    }
    this.update();
  }
  
  this.formatColumn = function (col, formatFunc) {
    for (var row in this.data) {
      this.data[row][col].format = formatFunc;
    }
    this.update();
  }
  
  this.initStyle = function (row, col) {
    if (this.data[row][col].style === undefined) {
      this.data[row][col].style = new Array();
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
        cell.innerHTML = this.format(rowIndex, this.order[colIndex]);
        
        // Do styling
        if (this.data[rowIndex][this.order[colIndex]].style !== undefined) {
          for (var key in this.data[rowIndex][this.order[colIndex]].style) {
            cell.style[key] = this.data[rowIndex][this.order[colIndex]].style[key];
          }
        }
        
        // Make editable
        if (!this.data[rowIndex][this.order[colIndex]].frozen) {
          cell.setAttribute("contenteditable", true);
          cell.keydown(function(event) {
              if (event.keyCode == 13 || event.charCode == 13) {
                  alert("Pressed enter");
              } 
          });
        }
      }
    }
  };
  
  this.format = function (row, col) {
    // Takes data at row,col and formats it
    if (this.data[row][col].format === undefined) {
      return this.data[row][col];
    } else {
      return this.data[row][col].format(this.data[row][col]);
    }
  }
  
  this.update(); // Go ahead and fill the table with data
}
