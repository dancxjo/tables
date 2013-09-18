function Table(tableId, data, headings) {
  this.table = document.getElementById(tableId);
  this.data = data;
  this.headings = headings; // firstname: "First Name", lastname: "Last Name"...
  this.order = new Array(); // 0: firstname 1: lastname...
  
  this.table.className += " spreadsheet";
  
  this.clear = function () {
    for (var index=this.table.rows.length - 1; index >= 0; index--) {
    	this.table.deleteRow(index);
  	}
  };
  
  this.makeHeadings = function () {
    var header = this.table.createTHead();
    var row = header.insertRow(0);
    for (var index in this.headings) {
      var cell = document.createElement("th");
      row.appendChild(cell);
      cell.innerHTML = this.headings[index];
      this.order[row.cells.length-1] = index;
    }
  }
  
  this.update = function () {
    this.clear(); // Erase what's already in the table
    this.makeHeadings(); // Make the headingings
    
    // Now add the data
    for (var rowIndex in this.data) {
      var row = this.table.insertRow(rowIndex + 1);
      for (var colIndex in this.order) {
        var cell = row.insertCell(colIndex);
        cell.innerHTML = this.data[rowIndex][this.order[colIndex]];
      }
    }
  };
  
  this.update(); // Go ahead and fill the table with data
}
