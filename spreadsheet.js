function Table(tableId, data, headings) {
  this.table = document.getElementById(tableId);
  this.data = data;
  this.headings = headings; // firstname: "First Name", lastname: "Last Name"...
  this.order = new Array(); // 0: firstname 1: lastname...
  this.sortCol = -1;
  this.revSort = false;
  
  this.table.className += " spreadsheet";
  
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
        //cell.innerHTML = this.data[rowIndex][this.order[colIndex]];
        cell.innerHTML = this.format(rowIndex, this.order[colIndex);
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
